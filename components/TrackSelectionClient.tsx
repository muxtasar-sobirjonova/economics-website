"use client";

import React, { useState, useTransition } from "react";
import { switchTrackAction } from "@/app/actions/user";
import { useRouter } from "next/navigation";
import { IconTrendingUp, IconBrain, IconGlobe, IconCheck } from "@tabler/icons-react";

interface TrackSelectionClientProps {
  currentTrack: string | null;
}

export function TrackSelectionClient({ currentTrack }: TrackSelectionClientProps) {
  const [selected, setSelected] = useState<string | null>(currentTrack);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const tracks = [
    {
      id: "ENTREPRENEURSHIP_ECONOMICS",
      title: "Entrepreneurship Economics",
      subtitle: "Cost structures, pricing power, and scale economics.",
      description: "Master the microeconomic forces that drive successful ventures. Explore Knightian uncertainty, scale mechanisms, vertical supply integrations, and unit-economic calculations that shape product viability.",
      icon: IconTrendingUp,
    },
    {
      id: "BEHAVIORAL_ECONOMICS",
      title: "Behavioral Economics",
      subtitle: "Human psychology, choice architecture, and cognitive biases.",
      description: "Understand how people actually make decisions, not just how equations say they should. Explore irrational heuristics, loss aversion, nudge theory, framing bias, and social coordination dynamics.",
      icon: IconBrain,
    },
    {
      id: "DEVELOPMENT_ECONOMICS",
      title: "Development Economics",
      subtitle: "Macroeconomic systems, institutions, and poverty traps.",
      description: "Analyze the structures governing national and regional prosperity. Explore institutional development, ease of business regulation, ease of access to credit, cluster economies, and global innovation zone dynamics.",
      icon: IconGlobe,
    }
  ];

  const handleSelectTrack = (trackId: string) => {
    setSelected(trackId);
  };

  const handleConfirm = () => {
    if (!selected) return;

    startTransition(async () => {
      try {
        const res = await switchTrackAction(selected);
        if (!res.success) {
          console.error("Failed to set active track:", res.error);
        } else {
          router.push("/roadmap");
          router.refresh();
        }
      } catch (error) {
        console.error("Failed to set active track:", error);
      }
    });
  };

  return (
    <div className="w-full max-w-5xl flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
        {tracks.map((track) => {
          const Icon = track.icon;
          const isSelected = selected === track.id;

          return (
            <div
              key={track.id}
              onClick={() => handleSelectTrack(track.id)}
              className={`flex flex-col bg-surface border-2 rounded-md p-4 md:p-6 cursor-pointer transition-all duration-300 relative ${
                isSelected
                  ? "border-accent bg-accent-soft shadow-md"
                  : "border-line hover:border-accent shadow-sm"
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 rounded-full w-6 h-6 flex items-center justify-center bg-accent text-on-accent">
                  <IconCheck className="w-4 h-4 stroke-[3px]" />
                </div>
              )}

              <div className="w-10 h-10 md:w-12 md:h-12 rounded-md flex items-center justify-center mb-3 md:mb-6 bg-accent-soft text-accent">
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>

              <h3 className="text-lg md:text-xl font-bold text-ink mb-1 md:mb-2 leading-snug">
                {track.title}
              </h3>
              <p className="text-xs md:text-sm font-semibold text-muted mb-2 md:mb-4">
                {track.subtitle}
              </p>
              <p className="hidden md:block text-muted text-sm leading-relaxed mt-auto">
                {track.description}
              </p>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleConfirm}
        disabled={!selected || isPending}
        className={`px-8 py-3.5 rounded-md font-bold shadow-lg transition-all duration-200 min-w-[200px] flex items-center justify-center gap-2 ${
          selected
            ? "bg-accent text-on-accent hover:bg-accent-strong active:scale-[0.98] cursor-pointer"
            : "bg-bg-sunk text-faint cursor-not-allowed shadow-none"
        }`}
      >
        {isPending ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : currentTrack ? (
          "Switch Active Track"
        ) : (
          "Confirm & Begin Roadmap"
        )}
      </button>
    </div>
  );
}
