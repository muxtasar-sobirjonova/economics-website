import { StaffPermission } from "@prisma/client";

/**
 * Who may do what.
 *
 * Modelled on Telegram: the owner holds everything and cannot be demoted from
 * inside the app, admins hold a subset, and an admin may only grant rights they
 * hold themselves. That last rule is the one that matters — without it any
 * admin with MANAGE_ADMINS could promote themselves to everything.
 *
 * Pure. The owner list comes from the environment so a mistake made in the
 * interface can never lock the owner out of fixing it.
 */

export const ALL_PERMISSIONS: StaffPermission[] = [
  StaffPermission.HOST_COMPETITIONS,
  StaffPermission.MANAGE_QUESTIONS,
  StaffPermission.MANAGE_ADMINS,
];

export const PERMISSION_COPY: Record<StaffPermission, { label: string; note: string }> = {
  HOST_COMPETITIONS: {
    label: "Run competitions",
    note: "Open a competition, admit players and end it.",
  },
  MANAGE_QUESTIONS: {
    label: "Manage questions",
    note: "Add questions, correct them, and retire ones that are keyed wrong.",
  },
  MANAGE_ADMINS: {
    label: "Manage admins",
    note: "Grant and revoke rights — but only rights they hold themselves.",
  },
};

export interface Actor {
  isOwner: boolean;
  permissions: StaffPermission[];
}

export const NOBODY: Actor = { isOwner: false, permissions: [] };

export function owner(): Actor {
  return { isOwner: true, permissions: [...ALL_PERMISSIONS] };
}

export function can(actor: Actor, permission: StaffPermission): boolean {
  if (actor.isOwner) return true;
  return actor.permissions.includes(permission);
}

/** Everything this actor holds, owner included. */
export function held(actor: Actor): StaffPermission[] {
  return actor.isOwner ? [...ALL_PERMISSIONS] : ALL_PERMISSIONS.filter((p) => actor.permissions.includes(p));
}

/**
 * What this actor is allowed to hand out. Nothing unless they can manage
 * admins at all, and never more than they hold.
 */
export function grantable(actor: Actor): StaffPermission[] {
  if (!can(actor, StaffPermission.MANAGE_ADMINS)) return [];
  return held(actor);
}

export type GrantRefusal =
  | "not-allowed"
  | "beyond-your-rights"
  | "cannot-change-owner"
  | "cannot-change-self";

/**
 * Whether `actor` may set `target`'s permissions to `next`.
 *
 * Refuses self-editing on purpose: an admin raising their own rights is the
 * whole attack, and an admin removing their own last right by accident is the
 * whole footgun. The owner does both through the environment instead.
 */
export function refuseGrant(
  actor: Actor,
  next: StaffPermission[],
  target: { isSelf: boolean; isOwner: boolean }
): GrantRefusal | null {
  if (!can(actor, StaffPermission.MANAGE_ADMINS)) return "not-allowed";
  if (target.isOwner) return "cannot-change-owner";
  if (target.isSelf && !actor.isOwner) return "cannot-change-self";

  const allowed = grantable(actor);
  if (next.some((p) => !allowed.includes(p))) return "beyond-your-rights";

  return null;
}

export const REFUSAL_COPY: Record<GrantRefusal, string> = {
  "not-allowed": "You cannot manage admins.",
  "beyond-your-rights": "You can only grant rights you hold yourself.",
  "cannot-change-owner": "The owner's rights are set in the environment, not here.",
  "cannot-change-self": "You cannot change your own rights.",
};

/** Keeps a submitted list to real values, in a stable order, without repeats. */
export function normalise(raw: unknown): StaffPermission[] {
  if (!Array.isArray(raw)) return [];
  return ALL_PERMISSIONS.filter((p) => raw.includes(p));
}
