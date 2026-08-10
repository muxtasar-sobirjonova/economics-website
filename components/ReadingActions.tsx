"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";

const POPUP_WIDTH = 210;

export default function ReadingActions() {
  const pathname = usePathname();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const [selectionRange, setSelectionRange] = useState<{start: number, end: number} | null>(null);
  const [clickedHighlight, setClickedHighlight] = useState<{start: number, end: number} | null>(null);
  const [mounted, setMounted] = useState(false);
  const selectionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // v3: the Concepts page used to expose only its heading as #main-content, so
  // older offsets refer to a different text range.
  const getStorageKey = useCallback(() => `v3-highlights-${pathname}`, [pathname]);

  /** Places the popup above the given rect, clamped inside the viewport. */
  const positionPopup = useCallback((rect: DOMRect) => {
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    let top = rect.top + scrollY - 50;
    if (rect.top < 60) top = rect.bottom + scrollY + 12;

    const maxLeft = Math.max(8, window.innerWidth - POPUP_WIDTH - 8);
    let left = rect.left + scrollX + (rect.width / 2) - (POPUP_WIDTH / 2);
    left = Math.min(Math.max(left, scrollX + 8), scrollX + maxLeft);

    setPopupPos({ top, left });
    setPopupVisible(true);
  }, []);

  const clearHighlightsDOM = useCallback(() => {
    const content = document.getElementById('main-content');
    if (!content) return;
    const marks = content.querySelectorAll('mark.custom-highlight');
    marks.forEach(mark => {
      const parent = mark.parentNode;
      if (parent) {
        while(mark.firstChild) parent.insertBefore(mark.firstChild, mark);
        parent.removeChild(mark);
        parent.normalize();
      }
    });
  }, []);

  const handleHighlightClick = useCallback((start: number, end: number, rect: DOMRect) => {
    setSelectionRange(null);
    setClickedHighlight({ start, end });
    positionPopup(rect);
  }, [positionPopup]);

  const applyHighlightDOM = useCallback((content: HTMLElement, start: number, end: number, colorHex: string) => {
    const treeWalker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null);
    let charCount = 0;
    const nodesToWrap: { node: Node, overlapStart: number, overlapEnd: number }[] = [];

    while (treeWalker.nextNode()) {
      const node = treeWalker.currentNode;
      const length = node.nodeValue?.length || 0;
      const nodeStart = charCount;
      const nodeEnd = charCount + length;

      if (nodeEnd > start && nodeStart < end) {
        const overlapStart = Math.max(0, start - nodeStart);
        const overlapEnd = Math.min(length, end - nodeStart);
        nodesToWrap.push({ node, overlapStart, overlapEnd });
      }

      charCount += length;
      if (charCount >= end) break;
    }

    nodesToWrap.forEach(({ node, overlapStart, overlapEnd }) => {
      const text = node.nodeValue || "";
      const before = text.substring(0, overlapStart);
      const highlightText = text.substring(overlapStart, overlapEnd);
      const after = text.substring(overlapEnd);

      const parent = node.parentNode;
      if (!parent) return;

      if (before) {
        parent.insertBefore(document.createTextNode(before), node);
      }

      if (highlightText) {
        const mark = document.createElement('mark');
        mark.style.backgroundColor = colorHex;
        mark.style.color = 'inherit';
        mark.className = 'custom-highlight';
        mark.dataset.start = start.toString();
        mark.dataset.end = end.toString();
        mark.dataset.color = colorHex;
        mark.textContent = highlightText;

        mark.onclick = (e) => {
          e.stopPropagation();
          handleHighlightClick(start, end, mark.getBoundingClientRect());
        };

        parent.insertBefore(mark, node);
      }

      if (after) {
        parent.insertBefore(document.createTextNode(after), node);
      }

      parent.removeChild(node);
    });
  }, [handleHighlightClick]);

  const restoreHighlights = useCallback(() => {
    clearHighlightsDOM();
    const content = document.getElementById('main-content');
    if (!content) return;

    const highlights = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
    highlights.forEach((h: { start: number; end: number; color?: string }) => {
      applyHighlightDOM(content, h.start, h.end, h.color || "#FEF08A");
    });
  }, [clearHighlightsDOM, applyHighlightDOM, getStorageKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      restoreHighlights();
    }, 100);
    return () => {
      clearTimeout(timer);
      clearHighlightsDOM();
    };
  }, [pathname, restoreHighlights, clearHighlightsDOM]);

  useEffect(() => {
    /**
     * Reads the current selection and opens the colour picker for it.
     * Returns false when there is nothing selectable inside the article.
     */
    const syncFromSelection = () => {
      const content = document.getElementById('main-content');
      if (!content) return false;

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) return false;

      const range = selection.getRangeAt(0);
      if (!range.intersectsNode(content)) return false;

      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(content);
      try {
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
      } catch {
        return false;
      }
      const start = preSelectionRange.toString().length;
      const end = start + range.toString().length;
      if (start === end) return false;

      setSelectionRange({ start, end });
      setClickedHighlight(null);
      positionPopup(range.getBoundingClientRect());
      return true;
    };

    const isInsidePopup = (target: EventTarget | null) => {
      let el = target as HTMLElement | null;
      while (el) {
        if (el.id === 'highlight-popup') return true;
        el = el.parentElement;
      }
      return false;
    };

    // Fires for mouse, touch and pen. `touchend` is kept as a fallback for
    // browsers that do not emit pointer events for text selection.
    const handlePointerUp = (e: Event) => {
      if (isInsidePopup(e.target)) return;

      // Let the browser finish committing the selection first (iOS/Android).
      setTimeout(() => {
        if (syncFromSelection()) return;

        const target = e.target as HTMLElement | null;
        if (target?.tagName !== 'MARK') {
          setPopupVisible(false);
          setSelectionRange(null);
          setClickedHighlight(null);
        }
      }, 20);
    };

    // On touch devices a long-press selection often lands AFTER pointerup, so
    // the selection itself is the trigger.
    const handleSelectionChange = () => {
      if (selectionTimer.current) clearTimeout(selectionTimer.current);
      selectionTimer.current = setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          setClickedHighlight((clicked) => {
            if (!clicked) {
              setPopupVisible(false);
              setSelectionRange(null);
            }
            return clicked;
          });
          return;
        }
        syncFromSelection();
      }, 250);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPopupVisible(false);
        setSelectionRange(null);
        setClickedHighlight(null);
        window.getSelection()?.removeAllRanges();
      }
    };

    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('touchend', handlePointerUp);
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('touchend', handlePointerUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('keydown', handleKeyDown);
      if (selectionTimer.current) clearTimeout(selectionTimer.current);
    };
  }, [positionPopup]);

  const addHighlightInterval = (newH: {start: number, end: number, color: string}) => {
    const highlights = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
    const result = [];
    for (const h of highlights) {
      if (h.end <= newH.start || h.start >= newH.end) {
        result.push(h);
      } else {
        if (h.start < newH.start) result.push({ start: h.start, end: newH.start, color: h.color });
        if (h.end > newH.end) result.push({ start: newH.end, end: h.end, color: h.color });
      }
    }
    result.push(newH);
    localStorage.setItem(getStorageKey(), JSON.stringify(result));
  };

  const applyPopupColor = (color: string) => {
    if (clickedHighlight) {
      addHighlightInterval({ start: clickedHighlight.start, end: clickedHighlight.end, color });
    } else if (selectionRange) {
      addHighlightInterval({ start: selectionRange.start, end: selectionRange.end, color });
    }
    restoreHighlights();
    setPopupVisible(false);
    setSelectionRange(null);
    setClickedHighlight(null);
    window.getSelection()?.removeAllRanges();
  };

  const eraseFromPopup = () => {
    if (clickedHighlight) {
      let highlights = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
      highlights = highlights.filter((h: { start: number; end: number }) => h.start !== clickedHighlight.start || h.end !== clickedHighlight.end);
      localStorage.setItem(getStorageKey(), JSON.stringify(highlights));
    } else if (selectionRange) {
      const highlights = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
      const result = [];
      for (const h of highlights) {
        if (h.end <= selectionRange.start || h.start >= selectionRange.end) {
          result.push(h);
        } else {
          if (h.start < selectionRange.start) result.push({ start: h.start, end: selectionRange.start, color: h.color });
          if (h.end > selectionRange.end) result.push({ start: selectionRange.end, end: h.end, color: h.color });
        }
      }
      localStorage.setItem(getStorageKey(), JSON.stringify(result));
    }
    restoreHighlights();
    setPopupVisible(false);
    setSelectionRange(null);
    setClickedHighlight(null);
    window.getSelection()?.removeAllRanges();
  };

  if (!mounted) return null;

  const swatch = (color: string, label: string) => (
    <button
      type="button"
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onTouchStart={(e) => e.stopPropagation()}
      onClick={() => applyPopupColor(color)}
      style={{ width: '26px', height: '26px', borderRadius: '50%', background: color, cursor: 'pointer', border: '1px solid rgba(0,0,0,0.1)', padding: 0 }}
    />
  );

  return (
    <>
      <div className="text-[11px] sm:text-[12px] text-gray-400 font-medium flex items-center gap-1.5 italic bg-white/50 px-2.5 sm:px-3 py-1.5 rounded-full border border-gray-100 shadow-sm pointer-events-none select-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        Select text to highlight
      </div>
      {popupVisible && typeof document !== 'undefined' && createPortal(
        <div
          id="highlight-popup"
          data-mode={clickedHighlight ? 'clicked' : 'selection'}
          style={{
            position: 'absolute',
            top: popupPos.top,
            left: popupPos.left,
            width: POPUP_WIDTH,
            zIndex: 9999,
            background: '#ffffff',
            border: '1px solid #E0E0E0',
            borderRadius: '10px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            touchAction: 'manipulation'
          }}
        >
          {swatch('#FCD34D', 'Highlight Yellow')}
          {swatch('#93C5FD', 'Highlight Blue')}
          {swatch('#F9A8D4', 'Highlight Pink')}
          {swatch('#6EE7B7', 'Highlight Green')}

          <div style={{ width: '1px', height: '18px', background: '#EBEBEB' }}></div>

          <button
            type="button"
            aria-label="Remove highlight"
            onMouseDown={(e) => e.preventDefault()}
            onClick={eraseFromPopup}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', padding: '2px', borderRadius: '4px', border: 'none' }}
            title="Remove highlight"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>,
        document.body
      )}
    </>
  );
}
