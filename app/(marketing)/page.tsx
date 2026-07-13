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
  try {
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
  } catch (error: any) {
    return (
      <div style={{ padding: '50px', background: 'white', color: 'red', fontFamily: 'monospace' }}>
        <h1>FATAL 500 ERROR CAUGHT</h1>
        <p><strong>Message:</strong> {error?.message || String(error)}</p>
        <p><strong>Stack:</strong> {error?.stack || "No stack"}</p>
        <p><strong>Name:</strong> {error?.name || "Unknown"}</p>
        <hr />
        <p>Please take a screenshot of this page and send it to your AI.</p>
      </div>
    )
  }
}
