import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ExchangeBoard, BoardParams } from "@/components/internships/ExchangeBoard";

export const metadata: Metadata = {
  title: "The Opportunity Exchange | That's So Econ",
  description:
    "Every internship-ready organisation in Uzbekistan, by region and sector — who to contact and where to apply.",
};

export default async function InternshipsPage({
  searchParams,
}: {
  searchParams?: BoardParams;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return <ExchangeBoard searchParams={searchParams} />;
}
