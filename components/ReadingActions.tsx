"use client";

import React, { useEffect } from "react";
import { Eraser } from "lucide-react";

export default function ReadingActions({
  slug,
  lessonId,
  type,
}: {
  slug?: string;
  lessonId?: number;
  type?: string;
}) {
  useEffect(() => {
    // We inject the script exactly as requested
    if (!document.getElementById('article-highlight-script')) {
      const script = document.createElement('script');
      script.id = 'article-highlight-script';
      script.innerHTML = `
let activeHighlightColor = null;

// HIGHLIGHT on mouseup
document.getElementById('main-content')
  .addEventListener('mouseup', function(e) {
    if (!activeHighlightColor) return;
    
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    
    const range = selection.getRangeAt(0);
    const content = document.getElementById('main-content');
    if (!content.contains(range.commonAncestorContainer)) return;
    
    const treeWalker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          if (range.intersectsNode(node)) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodesToWrap = [];
    while(treeWalker.nextNode()) {
      nodesToWrap.push(treeWalker.currentNode);
    }

    if (nodesToWrap.length === 0 && range.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
      nodesToWrap.push(range.commonAncestorContainer);
    }

    nodesToWrap.forEach(textNode => {
      let startOffset = 0;
      let endOffset = textNode.length;

      if (textNode === range.startContainer) {
        startOffset = range.startOffset;
      }
      if (textNode === range.endContainer) {
        endOffset = range.endOffset;
      }
      
      if (startOffset === endOffset) return;
      
      const textToWrap = textNode.nodeValue.substring(startOffset, endOffset);
      if (textToWrap.trim() === '') return;

      const mark = document.createElement('mark');
      mark.style.background = activeHighlightColor;
      mark.style.color = 'inherit';
      mark.style.padding = '0';
      mark.style.borderRadius = '2px';

      const beforeText = textNode.nodeValue.substring(0, startOffset);
      const afterText = textNode.nodeValue.substring(endOffset);

      const parent = textNode.parentNode;
      if (beforeText) {
        parent.insertBefore(document.createTextNode(beforeText), textNode);
      }
      mark.textContent = textToWrap;
      parent.insertBefore(mark, textNode);
      if (afterText) {
        parent.insertBefore(document.createTextNode(afterText), textNode);
      }
      parent.removeChild(textNode);
    });
    
    selection.removeAllRanges();
  });

window.clearAllHighlights = function() {
  const content = document.getElementById('main-content');
  if (!content) return;
  const marks = content.querySelectorAll('mark');
  marks.forEach(mark => {
    const parent = mark.parentNode;
    while (mark.firstChild) {
      parent.insertBefore(mark.firstChild, mark);
    }
    parent.removeChild(mark);
    parent.normalize();
  });
}

window.setHighlightColor = function(color, id) {
  document.getElementById('main-content').style.cursor = 'text';
  
  if (activeHighlightColor === color) {
    activeHighlightColor = null;
    document.querySelectorAll('[id^="color-"]').forEach(el => {
      el.style.outline = 'none';
      el.style.transform = 'scale(1)';
    });
    return;
  }
  
  activeHighlightColor = color;
  document.querySelectorAll('[id^="color-"]').forEach(el => {
    el.style.outline = 'none';
    el.style.transform = 'scale(1)';
  });
  const activeEl = document.getElementById(id);
  if (activeEl) {
    activeEl.style.outline = '2px solid #7B6FE7';
    activeEl.style.outlineOffset = '2px';
    activeEl.style.transform = 'scale(1.2)';
  }
}
      `;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      <style>{`
        mark {
          color: inherit;
          font-size: inherit;
          font-weight: inherit;
          font-style: inherit;
          font-family: inherit;
          line-height: inherit;
          padding: 0;
          border-radius: 2px;
        }
      `}</style>
      <div 
        dangerouslySetInnerHTML={{
          __html: `
            <div id="highlight-toolbar" style="background: #ffffff; border: 1px solid #E0E0E0; border-radius: 10px; padding: 6px 12px; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <span style="font-size: 14px;">🖊️</span>
              
              <div 
                id="color-blue"   
                onclick="setHighlightColor('#93C5FD', 'color-blue')" 
                style="width: 18px; height: 18px; border-radius: 50%; background: #93C5FD; cursor: pointer; border: 2px solid transparent; outline: none; transition: all 0.15s ease;"></div>
              <div 
                id="color-yellow" 
                onclick="setHighlightColor('#FCD34D', 'color-yellow')" 
                style="width: 18px; height: 18px; border-radius: 50%; background: #FCD34D; cursor: pointer; border: 2px solid transparent; outline: none; transition: all 0.15s ease;"></div>
              <div 
                id="color-pink"   
                onclick="setHighlightColor('#F9A8D4', 'color-pink')" 
                style="width: 18px; height: 18px; border-radius: 50%; background: #F9A8D4; cursor: pointer; border: 2px solid transparent; outline: none; transition: all 0.15s ease;"></div>
              <div 
                id="color-green"  
                onclick="setHighlightColor('#6EE7B7', 'color-green')" 
                style="width: 18px; height: 18px; border-radius: 50%; background: #6EE7B7; cursor: pointer; border: 2px solid transparent; outline: none; transition: all 0.15s ease;"></div>

              <div style="width: 1px; height: 16px; background: #EBEBEB;"></div>
              
              <div 
                id="eraser-btn"
                onclick="clearAllHighlights()" 
                style="cursor: pointer; display: flex; align-items: center; justify-content: center; background: transparent; padding: 0; outline: none; transition: all 0.15s ease;" 
                title="Clear all highlights"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eraser"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>
              </div>
            </div>
          `
        }}
      />
    </>
  );
}
