"use client";

import React, { useState, useTransition } from "react";
import { saveDailyChallengeThought } from "@/app/(app)/home/actions";

export function DailyChallengeInput({
  challengeId,
  initialContent = ""
}: {
  challengeId: string;
  initialContent?: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState("");
  const [failed, setFailed] = useState(false);

  // Saved on request, not on a timer — the same rule as lesson notes, so there
  // is time to think before anything is written.
  const handleSave = () => {
    if (!content.trim()) {
      setFailed(true);
      setSaveStatus("Write something first.");
      setTimeout(() => setSaveStatus(""), 2500);
      return;
    }

    setFailed(false);
    setSaveStatus("Saving…");
    startTransition(async () => {
      try {
        await saveDailyChallengeThought(content, challengeId);
        setSaveStatus("Saved to My Notes");
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (error) {
        console.error(error);
        setFailed(true);
        setSaveStatus("Couldn't save. Try again.");
      }
    });
  };

  return (
    <div className="w-full">
      <label htmlFor="daily-reflection" className="sr-only">Your reflection</label>
      <textarea
        id="daily-reflection"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Your reflection…"
        className="w-full h-[110px] bg-raised border border-line rounded-md p-s3 text-ui text-ink placeholder:text-faint resize-none transition-colors focus:border-accent"
      />
      <div className="flex items-center gap-s3 mt-s3">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-s4 py-s2 rounded-md border border-line-strong bg-surface text-ui font-medium text-ink hover:border-accent hover:text-accent transition-colors disabled:opacity-50 min-h-[44px]"
        >
          {isPending ? "Saving…" : "Save reflection"}
        </button>
        {saveStatus && (
          <span className={`text-meta ${failed ? "text-danger" : "text-success"}`}>
            {saveStatus}
          </span>
        )}
      </div>
    </div>
  );
}
