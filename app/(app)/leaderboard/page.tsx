import { PageHeader } from "@/components/PageHeader";
import { auth } from "@/auth";
// Triggering Vercel rebuild
import { redirect } from "next/navigation";
import { LeaderboardClient } from "@/components/leaderboard/LeaderboardClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Leaderboard | That's So Econ",
  description: "See how you rank among other learners on That's So Econ!",
};

export default async function LeaderboardPage() {
  const session = await auth();
  
  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  return (
    <div className="w-full bg-bg bg-sky min-h-screen flex flex-col">
      <PageHeader eyebrow="This week" title="Leaderboard" />
      <div className="px-s4 md:px-s5 py-s5">
      <LeaderboardClient currentUserId={userId} />
    </div>
    </div>
  );
}