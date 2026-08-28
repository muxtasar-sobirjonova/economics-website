"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { StaffPermission } from "@prisma/client";
import { searchUsersAction, setPermissionsAction, type FoundUser } from "@/app/actions/staff";
import { PERMISSION_COPY, ALL_PERMISSIONS } from "@/lib/permissions";
import type { StaffRow } from "@/lib/staff";

/**
 * Granting rights, Telegram-style.
 *
 * The list of what can be granted is computed on the server and passed in, so
 * an admin never even sees a checkbox for a right they do not hold themselves.
 */
export function StaffManager({
  staff,
  grantable,
  meId,
  ownerEmails,
}: {
  staff: StaffRow[];
  grantable: StaffPermission[];
  meId: string;
  ownerEmails: string[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [found, setFound] = useState<FoundUser[] | null>(null);
  const [searching, setSearching] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSearching(true);
    const res = await searchUsersAction(query);
    setSearching(false);
    if (!res.ok) return setError(res.error);
    setFound(res.data);
  };

  const save = (userId: string, permissions: StaffPermission[]) => {
    setError(null);
    start(async () => {
      const res = await setPermissionsAction(userId, permissions);
      if (!res.ok) return setError(res.error);
      setFound(null);
      setQuery("");
      router.refresh();
    });
  };

  const toggle = (row: StaffRow, permission: StaffPermission) => {
    const next = row.permissions.includes(permission)
      ? row.permissions.filter((p) => p !== permission)
      : [...row.permissions, permission];
    save(row.userId, next);
  };

  return (
    <div className="flex flex-col gap-s5">
      {error && (
        <p className="rounded-md border px-s4 py-s3 text-meta"
          style={{ borderColor: "var(--danger)", background: "var(--danger-soft)", color: "var(--danger)" }}>
          {error}
        </p>
      )}

      <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5">
        <h2 className="text-label uppercase text-faint mb-s3">Owner</h2>
        {ownerEmails.length === 0 ? (
          <p className="text-meta" style={{ color: "var(--danger)" }}>
            No owner is set. Until ADMIN_EMAILS names someone, nobody can manage
            anything — including this page.
          </p>
        ) : (
          <ul className="list-none m-0 p-0 flex flex-col gap-s2">
            {ownerEmails.map((e) => (
              <li key={e} className="flex items-center gap-s3">
                <span className="text-label uppercase px-s2 py-1 rounded-sm"
                  style={{ background: "var(--reward-soft)", color: "var(--reward)" }}>
                  Owner
                </span>
                <span className="font-mono text-meta text-muted break-all">{e}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="text-meta text-faint mt-s3">
          Set in the environment, not here — so a mistake on this page can never
          lock everyone out.
        </p>
      </section>

      <section>
        <div className="flex items-baseline gap-s4 mb-s3">
          <h2 className="text-h2 font-semibold text-ink whitespace-nowrap">Admins</h2>
          <span className="h-px bg-line flex-1" />
        </div>

        {staff.length === 0 ? (
          <p className="text-meta text-muted">Nobody yet. Find someone below.</p>
        ) : (
          <ul className="list-none m-0 p-0 rounded-lg border border-line bg-surface shadow-sh1 overflow-hidden">
            {staff.map((row) => {
              const isSelf = row.userId === meId;
              return (
                <li key={row.userId} className="px-s4 py-s4 border-t border-line first:border-t-0">
                  <div className="flex items-baseline justify-between gap-s3 flex-wrap">
                    <div className="min-w-0">
                      <span className="block text-ui text-ink truncate">
                        {row.name || "Anonymous"}
                        {isSelf && <span className="text-faint"> · you</span>}
                      </span>
                      <span className="block font-mono text-label uppercase text-faint break-all">
                        {row.email || "no email"}
                      </span>
                    </div>
                    <button
                      onClick={() => save(row.userId, [])}
                      disabled={pending || isSelf}
                      className="min-h-[44px] px-s3 rounded-md border border-line text-meta text-muted hover:text-ink disabled:opacity-40 transition-colors"
                      title={isSelf ? "You cannot change your own rights" : undefined}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-s2 mt-s3">
                    {ALL_PERMISSIONS.map((p) => {
                      const on = row.permissions.includes(p);
                      const allowed = grantable.includes(p) && !isSelf;
                      return (
                        <button
                          key={p}
                          onClick={() => toggle(row, p)}
                          disabled={!allowed || pending}
                          aria-pressed={on}
                          title={
                            isSelf
                              ? "You cannot change your own rights"
                              : !grantable.includes(p)
                                ? "You do not hold this right yourself"
                                : PERMISSION_COPY[p].note
                          }
                          className={`px-s3 py-s2 rounded-md border text-meta min-h-[44px] transition-colors ${
                            on
                              ? "border-transparent bg-accent-soft text-accent-strong"
                              : "border-line text-muted"
                          } ${
                            allowed
                              ? on
                                ? ""
                                : "hover:text-ink hover:border-line-strong"
                              : // A right you cannot change is still a right you
                                // must be able to read. Fading a held permission
                                // to 40% made it unreadable, which turned "you
                                // may not edit this" into "this is not set".
                                // A dashed edge rather than a faded one: the
                                // difference stays visible and the label stays
                                // readable, which fading cannot do at once.
                                "cursor-not-allowed " + (on ? "" : "border-dashed")
                          }`}
                        >
                          {PERMISSION_COPY[p].label}
                        </button>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-line bg-surface shadow-sh1 p-s5">
        <h2 className="text-label uppercase text-faint mb-s3">Add an admin</h2>

        <form onSubmit={search} className="flex gap-s2">
          <label htmlFor="staff-search" className="sr-only">Search by name or email</label>
          <input
            id="staff-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name or email"
            className="flex-1 min-w-0 bg-raised border border-line rounded-md px-s3 py-s2 text-ui text-ink placeholder:text-faint min-h-[44px]"
          />
          <button
            type="submit"
            disabled={searching || query.trim().length < 2}
            className="px-s4 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors min-h-[44px] shrink-0 disabled:opacity-50"
          >
            {searching ? "…" : "Find"}
          </button>
        </form>

        {found !== null && (
          <div className="mt-s4">
            {found.length === 0 ? (
              <p className="text-meta text-muted">Nobody matches that.</p>
            ) : (
              <ul className="list-none m-0 p-0 flex flex-col gap-s2">
                {found.map((u) => (
                  <li key={u.id} className="flex items-center justify-between gap-s3 border-t border-line pt-s3 first:border-0 first:pt-0">
                    <span className="min-w-0">
                      <span className="block text-ui text-ink truncate">{u.name || "Anonymous"}</span>
                      <span className="block font-mono text-label uppercase text-faint break-all">
                        {u.email || "no email"}
                      </span>
                    </span>
                    <button
                      onClick={() => save(u.id, [StaffPermission.HOST_COMPETITIONS])}
                      disabled={pending || u.isStaff || u.id === meId}
                      className="min-h-[44px] px-s4 rounded-md bg-accent text-on-accent text-meta font-semibold hover:bg-accent-strong transition-colors shrink-0 disabled:opacity-40"
                    >
                      {u.isStaff ? "Already an admin" : u.id === meId ? "That is you" : "Make admin"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <p className="text-meta text-faint mt-s4">
          A new admin starts with running competitions only. Add the rest above.
          You can only grant what you hold yourself.
        </p>
      </section>
    </div>
  );
}
