import { Prisma } from "@prisma/client";

export class ActionError extends Error {
  constructor(message: string, public code: string = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'ActionError';
  }
}

export function handleActionError(error: unknown): never {
  console.error("Action Error:", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new ActionError('A unique constraint would be violated.', 'UNIQUE_CONSTRAINT');
    }
  }

  if (error instanceof ActionError) {
    throw error;
  }

  throw new ActionError(
    error instanceof Error ? error.message : "An unexpected error occurred."
  );
}
