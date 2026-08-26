/**
 * Who may see the question bank.
 *
 * The bank view shows every question. That is not a list to hand a player on
 * a rated ladder, so it is gated — and gated in the direction that fails safe:
 * with ADMIN_EMAILS unset nobody qualifies, rather than everybody.
 */
export function adminEmails(raw = process.env.ADMIN_EMAILS): string[] {
  return (raw ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdmin(email?: string | null, raw = process.env.ADMIN_EMAILS): boolean {
  const list = adminEmails(raw);
  if (list.length === 0) return false;
  if (!email) return false;
  return list.includes(email.trim().toLowerCase());
}
