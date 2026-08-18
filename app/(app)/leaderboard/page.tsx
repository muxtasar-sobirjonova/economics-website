import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getLeaderboard } from "@/lib/leaderboard";
import { LeaderboardBoard } from "@/components/leaderboard/LeaderboardBoard";

export const metadata: Metadata = {
  title: "Leaderboard | That's So Econ",
  description: "See how you rank among other learners on That's So Econ.",
};

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Three on the podium, seven in the list.
  const { podium, rest, standing, totalRanked } = await getLeaderboard(session.user.id, 10);

  return (
    <LeaderboardBoard
      podium={podium}
      rest={rest}
      standing={standing}
      totalRanked={totalRanked}
    />
  );
}
