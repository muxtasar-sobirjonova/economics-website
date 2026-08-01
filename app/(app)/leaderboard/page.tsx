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
    <div className="w-full bg-[#F8F9FC] min-h-screen pt-8 px-4">
      <LeaderboardClient currentUserId={userId} />
    </div>
  );
}
