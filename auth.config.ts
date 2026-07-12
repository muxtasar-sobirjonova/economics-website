import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      const isAuthRoute = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup');
      const isApiRoute = nextUrl.pathname.startsWith('/api/');
      const isPublicRoute = nextUrl.pathname === '/';

      if (isApiRoute) {
          return true; // Let API routes handle their own auth checking
      }

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/home', nextUrl)); // Redirect to dashboard if already logged in
        }
        return true; // Allow unauthenticated users to see login/signup
      }

      if (isPublicRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/home', nextUrl)); // Redirect to dashboard if already logged in
        }
        return true; // Allow unauthenticated users to see the marketing page
      }

      // Protect all other routes
      if (!isLoggedIn) {
        return false; // Redirect unauthenticated users to login page
      }
      
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  providers: [], // Add providers with an empty array for now
  secret: process.env.AUTH_SECRET,
  session: { 
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
} satisfies NextAuthConfig;
