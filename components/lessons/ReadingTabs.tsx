"use client";

import { useState, useTransition } from "react";
import { StickyNote } from "./StickyNote";
import type { NoteData } from "@/types";
import {
  saveGlobalNoteAction,
  deleteGlobalNoteAction,
} from "@/app/(app)/lessons/[lessonId]/concepts/read/actions";

interface ReadingTabsProps {
  lessonId: string;
  takeawaysText: string;
  initialNotes: NoteData[];
  hideTakeaways?: boolean;
  /** Where the note was written — shown on the My Notes page. */
  source?: string;
}

const noteColors = ["#FFF9C4", "#FFD6D6", "#D6E8FF", "#D6F5E3", "#E8D6FF"];

export const ReadingTabs = ({
  lessonId,
  takeawaysText,
  initialNotes,
  hideTakeaways = false,
  source = "Concept",
}: ReadingTabsProps) => {
  const [activePanel, setActivePanel] = useState<"takeaways" | "notes">(
    hideTakeaways ? "notes" : "takeaways"
  );
  const [notes, setNotes] = useState<NoteData[]>(
    initialNotes.length > 0
      ? initialNotes
      : [{ id: Date.now().toString(), lessonId, color: noteColors[0], content: "" }]
  );
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [saveFailed, setSaveFailed] = useState(false);

  // No auto-save on purpose: notes are only written when the user presses
  // "Save a note", so there is time to think before anything is persisted.

  const addNote = () => {
    setNotes([
      ...notes,
      { id: Date.now().toString(), lessonId, color: noteColors[0], content: "" },
    ]);
  };

  const deleteNote = (id: string) => {
    if (notes.length > 1) {
      setNotes(notes.filter((n) => n.id !== id));
      
      startTransition(async () => {
        try {
          const res = await deleteGlobalNoteAction(id);
          if (!res.success) {
            console.error("Delete failed:", res.error);
          }
        } catch (error) {
          console.error(error);
        }
      });
    }
  };

  const updateNoteColor = (id: string, color: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, color } : n)));
  };

  const updateNoteText = (id: string, content: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, content } : n)));
  };

  const hasWritableNotes = notes.some(
    (n) => typeof n.content === "string" && n.content.replace(/<[^>]*>/g, "").trim().length > 0
  );

  const handleSaveNotes = () => {
    if (!hasWritableNotes) {
      setSaveFailed(true);
      setSaveStatus("Write something first.");
      setTimeout(() => setSaveStatus(""), 2500);
      return;
    }

    setSaveFailed(false);
    setSaveStatus("Saving...");
    startTransition(async () => {
      try {
        for (const note of notes) {
          const plain = (note.content || "").replace(/<[^>]*>/g, "").trim();
          if (plain.length > 0) {
            const res = await saveGlobalNoteAction({
              ...note,
              lessonId: note.lessonId || lessonId,
              source,
            });
            if (!res.success) throw new Error(res.error || "Save failed");
          }
        }
        setSaveStatus("Saved to My Notes!");
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (error) {
        setSaveFailed(true);
        setSaveStatus("Failed to save.");
        console.error(error);
      }
    });
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Drawer handle — a tab on the right edge on desktop, a pill above the
          bottom nav on mobile. */}
      <button
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        className={`fixed z-[55] transition-opacity ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
          bottom-[84px] right-s4 md:bottom-auto md:top-1/2 md:right-0 md:-translate-y-1/2
          bg-surface border border-line shadow-sh2 text-ink
          rounded-md md:rounded-l-md md:rounded-r-none
          px-s4 py-s3 md:px-s2 md:py-s5
          flex items-center gap-s2 min-h-[44px]`}
      >
        <span className="text-ui font-medium md:hidden">Notes</span>
        <span
          className="hidden md:block text-label uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          Takeaways &amp; notes
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[60]"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}

      {/* Bottom sheet on mobile, right drawer on desktop */}
      <aside
        aria-hidden={!isOpen}
        className={`fixed z-[70] bg-surface border-line shadow-sh3 flex flex-col transition-transform duration-300 ease-out
          left-0 right-0 bottom-0 max-h-[82vh] rounded-t-xl border-t
          md:left-auto md:top-0 md:bottom-0 md:h-full md:max-h-none md:w-[340px] md:rounded-none md:border-l md:border-t-0
          ${isOpen ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"}`}
      >
        <div className="px-s5 pt-s4 pb-s3 shrink-0 border-b border-line">
          <div className="flex items-center justify-between mb-s3">
            <h3 className="text-h3 font-semibold text-ink">Notes &amp; takeaways</h3>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close notes"
              className="w-9 h-9 grid place-items-center rounded-md border border-line text-faint hover:text-ink transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {!hideTakeaways && (
            <div className="flex gap-s1 p-1 rounded-md bg-bg-sunk">
              <button
                onClick={() => setActivePanel("takeaways")}
                className={`flex-1 py-s2 rounded-sm text-meta font-medium transition-colors ${
                  activePanel === "takeaways" ? "bg-surface text-ink shadow-sh1" : "text-muted hover:text-ink"
                }`}
              >
                Takeaways
              </button>
              <button
                onClick={() => setActivePanel("notes")}
                className={`flex-1 py-s2 rounded-sm text-meta font-medium transition-colors ${
                  activePanel === "notes" ? "bg-surface text-ink shadow-sh1" : "text-muted hover:text-ink"
                }`}
              >
                My notes
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-s5 py-s4">
          {activePanel === "takeaways" && (
            <div className="rounded-md border border-line bg-raised p-s4">
              <div className="text-label uppercase text-accent mb-s3">Key takeaways</div>
              <div
                className="text-ui text-ink [&_ol]:pl-4 [&_li]:mb-s2"
                dangerouslySetInnerHTML={{ __html: takeawaysText || "<p>No takeaways for this lesson yet.</p>" }}
              />
            </div>
          )}

          {activePanel === "notes" && (
            <div className="flex flex-col gap-s3">
              {notes.map((note) => (
                <StickyNote
                  key={note.id}
                  note={note}
                  updateNoteColor={updateNoteColor}
                  deleteNote={deleteNote}
                  updateNoteText={updateNoteText}
                  canDelete={notes.length > 1}
                />
              ))}

              <button
                onClick={addNote}
                className="text-meta text-muted hover:text-ink transition-colors py-s2 min-h-[44px]"
              >
                + Add another note
              </button>
            </div>
          )}
        </div>

        {activePanel === "notes" && (
          <div className="shrink-0 px-s5 py-s4 border-t border-line bg-surface">
            <button
              onClick={handleSaveNotes}
              disabled={isPending}
              className="w-full py-s3 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors disabled:opacity-50 min-h-[44px]"
            >
              {isPending ? "Saving…" : "+ Save a note"}
            </button>
            {saveStatus && (
              <p className={`text-meta mt-s2 text-center ${saveFailed ? "text-danger" : "text-success"}`}>
                {saveStatus}
              </p>
            )}
          </div>
        )}
      </aside>
    </>
  );
};
