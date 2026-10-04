import { redirect } from "next/navigation";

/**
 * The duel has no page of its own any more.
 *
 * It is the strictest setting on `/practice` — ten multiple-choice questions,
 * timed, no going back — so a page that offered it separately offered the same
 * thing twice. Kept as a redirect rather than deleted because the route is in
 * people's history and in the odd shared link.
 */
export default function DuelPage() {
  redirect("/practice");
}
