import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"
import * as argon2 from "argon2"
import bcrypt from "bcryptjs"
import { ratelimit } from "@/lib/ratelimit"

const PEPPER = process.env.PASSWORD_PEPPER || "default-pepper";

const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (user.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (dbUser?.deletedAt) return false;
      }
      return true;
    }
  },
  providers: [
    ...(googleEnabled
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // 1. IP / Global Rate Limit
        const { success } = await ratelimit.limit(`login_${email}`);
        if (!success) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password || user.deletedAt) return null;

        // 2. Account Lockout Check
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error("Account is temporarily locked. Please try again later.");
        }

        let passwordsMatch = false;

        // 3. Argon2 Check (Modern) with Pepper
        try {
          passwordsMatch = await argon2.verify(user.password, password + PEPPER);
        } catch (e) {
          // 4. Legacy Bcrypt Fallback
          try {
            passwordsMatch = await bcrypt.compare(password, user.password);
            if (passwordsMatch) {
              // Rehash and update to argon2
              const newHash = await argon2.hash(password + PEPPER);
              await prisma.user.update({
                where: { id: user.id },
                data: { password: newHash },
              });
            }
          } catch (err) {
            passwordsMatch = false;
          }
        }

        if (passwordsMatch) {
          // Reset failed attempts on success
          if (user.failedLoginAttempts > 0) {
            await prisma.user.update({
              where: { id: user.id },
              data: { failedLoginAttempts: 0, lockedUntil: null },
            });
          }
          return user;
        }

        // Increment failed attempts and lock if > 10
        const newAttempts = user.failedLoginAttempts + 1;
        const updates: any = { failedLoginAttempts: newAttempts };
        
        if (newAttempts >= 10) {
          updates.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 mins
        }
        
        await prisma.user.update({
          where: { id: user.id },
          data: updates,
        });

        return null;
      },
    }),
  ],
})
