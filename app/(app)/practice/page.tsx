import { Metadata } from "next";
import dynamicImport from "next/dynamic";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPracticeHome } from "@/lib/practice/home";
import { practiceHistory } from "@/lib/compete/practiceService";

/**
 * Practice — the one page you solve on.
 *
 * It used to be two. The duel was ten multiple-choice questions under a clock
 * with no second chances, which is not a different activity from practice; it
 * is practice with the strictest setting on. So the setting is on this page
 * and `/duel` redirects here.
 *
 * What that merge had to protect: a question answered in an unrated session
 * must never come back in a rated one. It cannot, because an unrated session
 * is written to the same table the rated draw reads its "already seen" set
 * from — see `DuelRun.rated`.
 */

const PracticeHome = dynamicImport(
  () => import("@/components/practice/PracticeHome").then((m) => m.PracticeHome),
  { loading: () => <div className="h-[420px] rounded-xl border border-line bg-surface" /> }
);

const PracticeHistory = dynamicImport(
  () => import("@/components/compete/PracticeHistory").then((m) => m.PracticeHistory)
);

export const metadata: Metadata = {
  title: "Practice | That's So Econ",
  description: "Build a session, solve, and climb the ladder.",
};
export const dynamic = "force-dynamic";

export default async function PracticePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [data, history] = await Promise.all([
    getPracticeHome(session.user.id),
    practiceHistory(session.user.id, 30),
  ]);

  return (
    <div className="theme-v2 min-h-screen w-full flex flex-col bg-bg bg-sky">
      <div className="w-full max-w-[1040px] mx-auto px-s4 md:px-s5 py-s5 md:py-s6 flex flex-col gap-s6">
        <PracticeHome data={data} />
        <PracticeHistory attempts={history} />
      </div>
    </div>
  );
}
