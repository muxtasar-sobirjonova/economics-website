import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

import { MarketingNav } from '@/components/marketing/MarketingNav';
import { MarketingHero } from '@/components/marketing/MarketingHero';
import { MarketingSections } from '@/components/marketing/MarketingSections';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';

export default async function MarketingPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/home");
  }

  return (
    <div className="min-h-screen font-sans bg-white text-left selection:bg-brand-primary selection:text-white relative">
      <MarketingNav />
      <MarketingHero />
      <MarketingSections />
      <MarketingFooter />
    </div>
  );
}
