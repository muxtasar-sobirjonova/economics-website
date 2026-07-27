"use server";

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { ratelimit } from '@/lib/ratelimit';
import { ActionError, ActionResponse, catchActionError } from '@/lib/errors';

const SignupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long'),
});

export async function signupAction(data: z.infer<typeof SignupSchema>): Promise<ActionResponse<void>> {
  try {
    // 1. Zod Validation
    const parsed = SignupSchema.safeParse(data);
    if (!parsed.success) {
      throw new ActionError('Validation failed: ' + parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();

    const { success } = await ratelimit.limit(`signup_${normalizedEmail}`);
    if (!success) {
      throw new ActionError("Too many signup attempts. Please try again later.");
    }

    // 2. Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ActionError('User with this email already exists');
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

    return { success: true, data: undefined };
  } catch (error) {
    return catchActionError(error);
  }
}
