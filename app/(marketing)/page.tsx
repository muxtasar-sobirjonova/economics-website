import { auth } from "@/auth";
import { redirect } from "next/navigation";

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
    <div className="min-h-screen font-sans bg-surface text-left selection:bg-accent selection:text-white relative">
      <MarketingNav />
      <MarketingHero />
      <MarketingSections />
      <MarketingFooter />
    </div>
  );
}
