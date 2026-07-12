import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

import { MarketingNav } from '@/components/marketing/MarketingNav';
import { MarketingHero } from '@/components/marketing/MarketingHero';
import { MarketingSections } from '@/components/marketing/MarketingSections';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';

export interface MarketingPageData {
  studentCount: string;
}

const getStudentCount = unstable_cache(
  async (): Promise<string> => {
    try {
      const count = await prisma.user.count();
      return count > 0 ? `${count.toLocaleString()}+` : "thousands of";
    } catch (error) {
      console.error("Failed to fetch student count:", error);
      return "thousands of";
    }
  },
  ['marketing-student-count'],
  { revalidate: 300 }
);

export default async function MarketingPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/home");
  }

  const fetchedCount = await getStudentCount();
  const pageData: MarketingPageData = {
    studentCount: fetchedCount
  };

  return (
    <div className="min-h-screen font-sans bg-white text-left selection:bg-brand-primary selection:text-white relative">
      <MarketingNav />
      <MarketingHero studentCount={pageData.studentCount} />
      <MarketingSections />
      <MarketingFooter />
    </div>
  );
}
