"use server";

import { revalidatePath } from "next/cache";
import { StaffPermission } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { actorFor } from "@/lib/staff";
import { can, normalise, refuseGrant, REFUSAL_COPY } from "@/lib/permissions";
import { isAdmin } from "@/lib/admin";

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function requireActor() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    email: session.user.email ?? null,
    actor: await actorFor(session.user.id, session.user.email),
  };
}

export interface FoundUser {
  id: string;
  name: string | null;
  email: string | null;
  isStaff: boolean;
}

/**
 * Find someone to promote.
 *
 * Gated behind MANAGE_ADMINS: this is a search over every registered person,
 * and that is not a list to hand out. Requires something to search for, so it
 * cannot be used to page through the whole table.
 */
export async function searchUsersAction(query: string): Promise<Result<FoundUser[]>> {
  const me = await requireActor();
  if (!me) return { ok: false, error: "Sign in first." };
  if (!can(me.actor, StaffPermission.MANAGE_ADMINS)) {
    return { ok: false, error: REFUSAL_COPY["not-allowed"] };
  }

  const q = typeof query === "string" ? query.trim() : "";
  if (q.length < 2) return { ok: true, data: [] };

  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: 8,
    select: { id: true, name: true, email: true, staff: { select: { userId: true } } },
  });

  return {
    ok: true,
    data: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      isStaff: u.staff !== null,
    })),
  };
}

/**
 * Set someone's rights. An empty list removes them entirely rather than
 * leaving a row that holds nothing.
 */
export async function setPermissionsAction(
  targetUserId: string,
  raw: unknown
): Promise<Result<null>> {
  const me = await requireActor();
  if (!me) return { ok: false, error: "Sign in first." };
  if (typeof targetUserId !== "string" || !targetUserId) {
    return { ok: false, error: "Missing user." };
  }

  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, email: true },
  });
  if (!target) return { ok: false, error: "No such user." };

  const next = normalise(raw);
  const refusal = refuseGrant(me.actor, next, {
    isSelf: target.id === me.id,
    // The owner is defined in the environment; a row here would not change it,
    // so editing one would only be misleading.
    isOwner: isAdmin(target.email),
  });
  if (refusal) return { ok: false, error: REFUSAL_COPY[refusal] };

  try {
    if (next.length === 0) {
      await prisma.staff.deleteMany({ where: { userId: targetUserId } });
    } else {
      await prisma.staff.upsert({
        where: { userId: targetUserId },
        create: { userId: targetUserId, permissions: next, grantedById: me.id },
        update: { permissions: next },
      });
    }
    revalidatePath("/admin/staff");
    return { ok: true, data: null };
  } catch (e) {
    console.error("setPermissions failed", e);
    return { ok: false, error: "Could not save that." };
  }
}
