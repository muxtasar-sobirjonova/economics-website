import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ResearchRegister, RegisterParams } from "@/components/research/ResearchRegister";

export const metadata: Metadata = {
  title: "The Research Register | That's So Econ",
  description:
    "Faculty across Uzbekistan's universities, by institution and field — who to write to about research, and how to reach them.",
};

export default async function ResearchPage({
  searchParams,
}: {
  searchParams?: RegisterParams;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return <ResearchRegister searchParams={searchParams} />;
}
