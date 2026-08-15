import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TrackSelectionClient } from "@/components/TrackSelectionClient";

export default async function TrackSelectionPage() {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeTrack: true }
  });

  return (
    <div className="min-h-screen bg-bg bg-sky flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-4xl w-full text-center mb-10">
        <h1 className="text-h1 md:text-display font-semibold text-ink mb-s3">
          Choose Your Economics Track
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          Select one of our specialized 56-day curriculums to begin your journey. You can switch tracks or change your selection at any time.
        </p>
      </div>

      <TrackSelectionClient currentTrack={user?.activeTrack || null} />
    </div>
  );
}
