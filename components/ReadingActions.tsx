"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";

export default function ReadingActions() {
  const pathname = usePathname();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const [selectionRange, setSelectionRange] = useState<{start: number, end: number} | null>(null);
  const [clickedHighlight, setClickedHighlight] = useState<{start: number, end: number} | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStorageKey = useCallback(() => `v2-highlights-${pathname}`, [pathname]);

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
    
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    
    let top = rect.top + scrollY - 50; 
    let left = rect.left + scrollX + (rect.width / 2) - 80; 
    
    if (top < scrollY) top = rect.bottom + scrollY + 10; 
    if (left < 10) left = 10;
    
    setPopupPos({ top, left });
    setPopupVisible(true);
  }, []);

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
    const handleMouseUp = (e: MouseEvent) => {
      let el = e.target as HTMLElement | null;
      let inPopup = false;
      while(el) {
        if (el.id === 'highlight-popup') { inPopup = true; break; }
        el = el.parentElement;
      }
      if (inPopup) return;

      const content = document.getElementById('main-content');
      if (!content) return;

      const selection = window.getSelection();
      
      if (!selection || selection.isCollapsed) {
        if ((e.target as HTMLElement)?.tagName !== 'MARK') {
           setPopupVisible(false);
           setSelectionRange(null);
           setClickedHighlight(null);
        }
        return;
      }

      const range = selection.getRangeAt(0);
      if (!range.intersectsNode(content)) {
        setPopupVisible(false);
        return;
      }

      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(content);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      const start = preSelectionRange.toString().length;
      const end = start + range.toString().length;

      if (start === end) {
        setPopupVisible(false);
        return;
      }

      setSelectionRange({ start, end });
      setClickedHighlight(null);

      const rect = range.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      
      let top = rect.top + scrollY - 50; 
      let left = rect.left + scrollX + (rect.width / 2) - 80;
      
      if (top < scrollY) top = rect.bottom + scrollY + 10; 
      if (left < 10) left = 10;
      
      setPopupPos({ top, left });
      setPopupVisible(true);
    };

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setPopupVisible((prev) => {
          if (prev && document.getElementById('highlight-popup')?.dataset.mode !== 'clicked') {
             return false;
          }
          return prev;
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPopupVisible(false);
        setSelectionRange(null);
        setClickedHighlight(null);
        window.getSelection()?.removeAllRanges();
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
    window.getSelection()?.removeAllRanges();
  };

  if (!mounted) return null;

  return (
    <>
      <div className="text-[12px] text-gray-400 font-medium flex items-center gap-1.5 italic bg-white/50 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm pointer-events-none select-none">
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
            zIndex: 9999, 
            background: '#ffffff', 
            border: '1px solid #E0E0E0', 
            borderRadius: '8px', 
            padding: '6px 12px', 
            display: 'flex',
            alignItems: 'center', 
            gap: '8px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <button 
            type="button"
            aria-label="Highlight Yellow"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyPopupColor('#FCD34D')} 
            style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#FCD34D', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.1)' }}></button>
          <button 
            type="button"
            aria-label="Highlight Blue"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyPopupColor('#93C5FD')} 
            style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#93C5FD', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.1)' }}></button>
          <button 
            type="button"
            aria-label="Highlight Pink"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyPopupColor('#F9A8D4')} 
            style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#F9A8D4', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.1)' }}></button>
          <button 
            type="button"
            aria-label="Highlight Green"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyPopupColor('#6EE7B7')} 
            style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#6EE7B7', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.1)' }}></button>

          <div style={{ width: '1px', height: '16px', background: '#EBEBEB', margin: '0 2px' }}></div>
          
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
