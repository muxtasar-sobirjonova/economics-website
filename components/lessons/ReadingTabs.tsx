"use client";

import React, { useState, useTransition } from "react";
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
}

const noteColors = ["#FFF9C4", "#FFD6D6", "#D6E8FF", "#D6F5E3", "#E8D6FF"];

export const ReadingTabs = ({
  lessonId,
  takeawaysText,
  initialNotes,
  hideTakeaways = false,
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

  // Debounced Auto-Save
  React.useEffect(() => {
    if (activePanel !== "notes") return;
    
    const handler = setTimeout(() => {
      let isSaving = false;
      for (const note of notes) {
        if (note.content && note.content.trim().length > 0) {
          isSaving = true;
          startTransition(async () => {
            try {
              await saveGlobalNoteAction({
                ...note,
                source: "Concept",
              });
              setSaveStatus("Auto-saved");
              setTimeout(() => setSaveStatus(""), 2000);
            } catch (error) {
              console.error(error);
              setSaveStatus("Auto-save failed");
            }
          });
        }
      }
    }, 1500);

    return () => clearTimeout(handler);
  }, [notes, activePanel]);

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
          await deleteGlobalNoteAction(id, lessonId);
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

  const handleSaveNotes = () => {
    setSaveStatus("Saving...");
    startTransition(async () => {
      try {
        for (const note of notes) {
          if (note.content && note.content.trim().length > 0) {
            await saveGlobalNoteAction({
              ...note,
              source: "Concept",
            });
          }
        }
        setSaveStatus("Saved to My Notes!");
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (error) {
        setSaveStatus("Failed to save.");
        console.error(error);
      }
    });
  };

  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    const mainElement = document.querySelector('.content-page') as HTMLElement;
    if (mainElement) {
      if (isOpen && window.innerWidth >= 1024) {
        mainElement.style.paddingRight = '380px';
        mainElement.style.transition = 'padding-right 0.3s ease-in-out';
      } else {
        mainElement.style.paddingRight = '0px';
      }
    }
    return () => {
      if (mainElement) mainElement.style.paddingRight = '0px';
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 right-0 -translate-y-1/2 bg-[#5A4FBD] text-white p-2 rounded-l-md shadow-lg hover:bg-[#483d99] transition-all z-[60] flex flex-col items-center gap-2 border border-r-0 border-[#483d99]"
        style={{ transform: `translateY(-50%) translateX(${isOpen ? '-380px' : '0'})` }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span className="text-[11px] font-bold tracking-widest uppercase rotate-180 mt-1" style={{ writingMode: 'vertical-rl' }}>
          KEY TAKEAWAYS & MY NOTES
        </span>
      </button>

      {/* Overlay for mobile (optional) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[40] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Drawer */}
      <div 
        className={`fixed top-[56px] right-0 h-[calc(100vh-56px)] w-[380px] max-w-[100vw] bg-[#F8F9FC] border-l border-gray-200 shadow-2xl z-[50] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full overflow-y-auto p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Notes & Takeaways</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-700 bg-gray-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
      {!hideTakeaways && (
        <div className="flex bg-[#F8F9FC] p-1 rounded-xl mb-6 shadow-sm border border-gray-100">
          <button
            onClick={() => setActivePanel("takeaways")}
            className={`flex-1 text-center py-2 text-[13px] font-semibold rounded-lg cursor-pointer transition-all ${
              activePanel === "takeaways"
                ? "bg-white text-brand-primary shadow-sm border border-gray-100"
                : "text-gray-500 bg-transparent border border-transparent hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            💡 Takeaways
          </button>
          <button
            onClick={() => setActivePanel("notes")}
            className={`flex-1 text-center py-2 text-[13px] font-semibold rounded-lg cursor-pointer transition-all ${
              activePanel === "notes"
                ? "bg-white text-brand-primary shadow-sm border border-gray-100"
                : "text-gray-500 bg-transparent border border-transparent hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            🗒️ My Notes
          </button>
        </div>
      )}

      {activePanel === "takeaways" && (
        <div className="bg-brand-primary/5 rounded-2xl border border-brand-primary/20 p-5 shadow-sm">
          <div className="text-[11px] font-bold tracking-widest text-brand-primary uppercase mb-4 opacity-80">
            KEY TAKEAWAYS
          </div>
          <div 
            className="text-[#333333] text-[13px] leading-relaxed font-medium prose prose-sm prose-li:marker:text-brand-primary"
            dangerouslySetInnerHTML={{ __html: takeawaysText || "<p>No takeaways available for this lesson.</p>" }}
          />
        </div>
      )}

      {activePanel === "notes" && (
        <div className="overflow-hidden pr-2">
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

          <div className="flex flex-col items-center mt-3 gap-3 pb-8">
            <button
              onClick={addNote}
              className="text-xs font-semibold text-brand-primary bg-transparent border-none cursor-pointer mt-2 text-left px-4 hover:opacity-80 transition-opacity"
            >
              + Add Note
            </button>
            <button
              onClick={handleSaveNotes}
              disabled={isPending}
              className="bg-brand-primary text-white rounded-lg px-4 py-2 text-xs font-bold w-[calc(100%-32px)] mx-4 mt-auto hover:bg-[#6859e0] transition-colors shadow-sm disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Note"}
            </button>
            {saveStatus && (
              <span className="text-[11px] font-medium text-green-600">
                {saveStatus}
              </span>
            )}
          </div>
        </div>
      )}
        </div>
      </div>
    </>
  );
};
