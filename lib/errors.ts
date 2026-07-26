import { Prisma } from "@prisma/client";
import { isRedirectError } from "next/dist/client/components/redirect";
import { isNotFoundError } from "next/dist/client/components/not-found";

export type ActionResponse<T = void> = 
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

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

export function catchActionError(error: unknown): ActionResponse<never> {
  if (isRedirectError(error) || isNotFoundError(error)) {
    throw error;
  }
  
  console.error("Caught Action Error:", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return { success: false, error: 'A unique constraint would be violated.', code: 'UNIQUE_CONSTRAINT' };
    }
  }

  if (error instanceof ActionError) {
    return { success: false, error: error.message, code: error.code };
  }

  return { 
    success: false, 
    error: error instanceof Error ? error.message : "An unexpected error occurred.",
    code: 'INTERNAL_ERROR'
  };
}
