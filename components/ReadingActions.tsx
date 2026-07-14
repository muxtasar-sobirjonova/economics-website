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
let currentMode = null; // 'draw' or 'erase'
let canvas = null;
let ctx = null;
let isDrawing = false;
let strokes = [];
let currentStroke = null;

function initCanvas() {
  const content = document.getElementById('main-content');
  if (!content) return;

  if (document.getElementById('annotation-canvas')) return;

  content.style.position = 'relative';

  canvas = document.createElement('canvas');
  canvas.id = 'annotation-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none'; 
  canvas.style.zIndex = '5';
  
  content.insertBefore(canvas, content.firstChild);

  ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = content.offsetWidth;
    canvas.height = content.offsetHeight;
    redrawCanvas();
  }
  
  resizeCanvas();
  const ro = new ResizeObserver(resizeCanvas);
  ro.observe(content);

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  window.addEventListener('mouseup', stopDrawing);
}

function redrawCanvas() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  strokes.forEach(stroke => {
    if (stroke.points.length === 0) return;
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    ctx.lineWidth = stroke.mode === 'erase' ? 24 : 16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (stroke.mode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = stroke.color;
    }
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    ctx.stroke();
  });
}

function startDrawing(e) {
  if (!currentMode) return;
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  currentStroke = { mode: currentMode, color: activeHighlightColor, points: [{x, y}] };
  strokes.push(currentStroke);
  
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineWidth = currentMode === 'erase' ? 24 : 16;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  if (currentMode === 'erase') {
    ctx.globalCompositeOperation = 'destination-out';
  } else {
    ctx.globalCompositeOperation = 'multiply';
    ctx.strokeStyle = activeHighlightColor;
  }
}

function draw(e) {
  if (!isDrawing || !currentMode) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  currentStroke.points.push({x, y});
  
  ctx.lineTo(x, y);
  ctx.stroke();
}

function stopDrawing() {
  if (!isDrawing) return;
  isDrawing = false;
  ctx.closePath();
}

window.setHighlightColor = function(color, id) {
  if (!canvas) initCanvas();
  
  if (activeHighlightColor === color && currentMode === 'draw') {
    currentMode = null;
    activeHighlightColor = null;
    canvas.style.pointerEvents = 'none';
    document.body.style.cursor = 'default';
  } else {
    currentMode = 'draw';
    activeHighlightColor = color;
    canvas.style.pointerEvents = 'auto';
    document.body.style.cursor = 'crosshair';
  }
  
  document.querySelectorAll('[id^="color-"], #eraser-btn').forEach(el => {
    el.style.outline = 'none';
    el.style.transform = 'scale(1)';
    if (el.id === 'eraser-btn') el.style.background = 'transparent';
  });
  
  if (currentMode === 'draw') {
    const activeEl = document.getElementById(id);
    if (activeEl) {
      activeEl.style.outline = '2px solid #7B6FE7';
      activeEl.style.outlineOffset = '2px';
      activeEl.style.transform = 'scale(1.2)';
    }
  }
}

window.enableEraser = function() {
  if (!canvas) initCanvas();
  
  if (currentMode === 'erase') {
    currentMode = null;
    canvas.style.pointerEvents = 'none';
    document.body.style.cursor = 'default';
  } else {
    currentMode = 'erase';
    activeHighlightColor = null;
    canvas.style.pointerEvents = 'auto';
    document.body.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'24\\' height=\\'24\\' viewBox=\\'0 0 24 24\\' fill=\\'white\\' stroke=\\'black\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><path d=\\'m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21\\'/><path d=\\'M22 21H7\\'/><path d=\\'m5 11 9 9\\'/></svg>") 0 24, auto';
  }
  
  document.querySelectorAll('[id^="color-"]').forEach(el => {
    el.style.outline = 'none';
    el.style.transform = 'scale(1)';
  });
  
  const eraserEl = document.getElementById('eraser-btn');
  if (currentMode === 'erase') {
    eraserEl.style.background = '#F3F0FF';
    eraserEl.style.outline = '2px solid #7B6FE7';
    eraserEl.style.outlineOffset = '2px';
    eraserEl.style.transform = 'scale(1.1)';
  } else {
    eraserEl.style.background = 'transparent';
    eraserEl.style.outline = 'none';
    eraserEl.style.transform = 'scale(1)';
  }
}
      `;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      <div 
        dangerouslySetInnerHTML={{
          __html: `
            <div id="highlight-toolbar" style="background: #ffffff; border: 1px solid #E0E0E0; border-radius: 10px; padding: 6px 12px; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <span style="font-size: 14px;">🖊️</span>
              
              <div 
                id="color-blue"   
                onclick="setHighlightColor('rgba(147, 197, 253, 0.4)', 'color-blue')" 
                style="width: 18px; height: 18px; border-radius: 50%; background: #93C5FD; cursor: pointer; border: 2px solid transparent; outline: none; transition: all 0.15s ease;"></div>
              <div 
                id="color-yellow" 
                onclick="setHighlightColor('rgba(252, 211, 77, 0.4)', 'color-yellow')" 
                style="width: 18px; height: 18px; border-radius: 50%; background: #FCD34D; cursor: pointer; border: 2px solid transparent; outline: none; transition: all 0.15s ease;"></div>
              <div 
                id="color-pink"   
                onclick="setHighlightColor('rgba(249, 168, 212, 0.4)', 'color-pink')" 
                style="width: 18px; height: 18px; border-radius: 50%; background: #F9A8D4; cursor: pointer; border: 2px solid transparent; outline: none; transition: all 0.15s ease;"></div>
              <div 
                id="color-green"  
                onclick="setHighlightColor('rgba(110, 231, 183, 0.4)', 'color-green')" 
                style="width: 18px; height: 18px; border-radius: 50%; background: #6EE7B7; cursor: pointer; border: 2px solid transparent; outline: none; transition: all 0.15s ease;"></div>

              <div style="width: 1px; height: 16px; background: #EBEBEB;"></div>
              
              <div 
                id="eraser-btn"
                onclick="enableEraser()" 
                style="cursor: pointer; display: flex; align-items: center; justify-content: center; background: transparent; padding: 2px; border-radius: 4px; outline: none; transition: all 0.15s ease;" 
                title="Eraser tool"
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
