import { StaffPermission } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { NOBODY, owner, type Actor } from "@/lib/permissions";

/**
 * Who the signed-in person is, as far as rights go.
 *
 * The owner comes from the environment and the rest from the database, so the
 * root of the tree cannot be edited by anything that went wrong inside the app.
 */
export async function actorFor(
  userId: string | null | undefined,
  email: string | null | undefined
): Promise<Actor> {
  if (isAdmin(email)) return owner();
  if (!userId) return NOBODY;

  const row = await prisma.staff.findUnique({
    where: { userId },
    select: { permissions: true },
  });
  if (!row) return NOBODY;

  return { isOwner: false, permissions: row.permissions };
}

export interface StaffRow {
  userId: string;
  name: string | null;
  email: string | null;
  permissions: StaffPermission[];
  note: string | null;
  createdAt: Date;
}

export async function listStaff(): Promise<StaffRow[]> {
  const rows = await prisma.staff.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      userId: true,
      permissions: true,
      note: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
    },
  });

  return rows.map((r) => ({
    userId: r.userId,
    name: r.user.name,
    email: r.user.email,
    permissions: r.permissions,
    note: r.note,
    createdAt: r.createdAt,
  }));
}
