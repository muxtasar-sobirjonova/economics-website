"use server";

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { ratelimit } from '@/lib/ratelimit';

const SignupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
});

export async function signupAction(data: z.infer<typeof SignupSchema>) {
  // 1. Zod Validation
  const parsed = SignupSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error('Validation failed: ' + parsed.error.issues.map((e) => e.message).join(", "));
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedName = name.trim();

  const { success } = await ratelimit.limit(`signup_${normalizedEmail}`);
  if (!success) {
    throw new Error("Too many signup attempts. Please try again later.");
  }

  // 2. Check for existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Create User AND initialize UserProgress atomically
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    await tx.userProgress.create({
      data: {
        userId: user.id,
        totalXP: 0,
        hearts: 5,
        streak: 0,
        currentDay: 1,
      },
    });

    return user;
  });

  return { success: true };
}
