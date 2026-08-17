'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RegionInfo {
  id: string;
  name: string;
}

const regions: RegionInfo[] = [
  { id: 'tashkent-city', name: 'Tashkent City' },
  { id: 'tashkent', name: 'Tashkent Region' },
  { id: 'andijan', name: 'Andijan Region' },
  { id: 'bukhara', name: 'Bukhara Region' },
  { id: 'fergana', name: 'Fergana Region' },
  { id: 'jizzakh', name: 'Jizzakh Region' },
  { id: 'kashkadarya', name: 'Kashkadarya Region' },
  { id: 'khorezm', name: 'Khorezm Region' },
  { id: 'namangan', name: 'Namangan Region' },
  { id: 'navoiy', name: 'Navoiy Region' },
  { id: 'samarkand', name: 'Samarkand Region' },
  { id: 'syrdarya', name: 'Syrdarya Region' },
  { id: 'surkhandarya', name: 'Surkhandarya Region' },
];

export default function RegionMap() {
  const router = useRouter();
  const [svgContent, setSvgContent] = useState<string>('');
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string } | null>(null);

  // Load the SVG from the public folder
  useEffect(() => {
    fetch('/uzbekistan-regions.svg')
      .then((res) => res.text())
      .then((svg) => setSvgContent(svg))
      .catch((err) => console.error('Failed to load map SVG (uzbekistan-regions)', err));
  }, []);

  // After SVG is injected, attach event listeners to each region
  useEffect(() => {
    if (!svgContent) return;
    const container = document.getElementById('region-map-container');
    if (!container) return;
    const svgEl = container.querySelector('svg');
    if (!svgEl) return;

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as SVGRectElement;
      const name = target.getAttribute('data-name') ?? '';
      setTooltip({ x: e.clientX, y: e.clientY, name });
      // Highlight region
      target.setAttribute('fill', 'var(--accent-soft)');
      target.setAttribute('stroke', 'var(--accent)');
    };
    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as SVGRectElement;
      target.setAttribute('fill', 'var(--surface)');
      target.setAttribute('stroke', 'var(--border)');
      setTooltip(null);
    };
    const handleClick = (e: MouseEvent) => {
      const target = e.target as SVGRectElement;
      const id = target.id;
      if (id) router.push(`/internships/${id}`);
    };

    regions.forEach((region) => {
      const el = svgEl.querySelector(`#${region.id}`);
      if (el) {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
        el.addEventListener('click', handleClick);
        // Ensure cursor pointer
        (el as SVGElement).style.cursor = 'pointer';
      }
    });

    // Cleanup listeners on unmount or svg change
    return () => {
      regions.forEach((region) => {
        const el = svgEl.querySelector(`#${region.id}`);
        if (el) {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
          el.removeEventListener('click', handleClick);
        }
      });
    };
  }, [svgContent, router]);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[var(--text)]">Explore Internships by Region</h2>
        <p className="text-lg text-[var(--muted)] mt-2">
          Hover over a region on the map to see its name, then click to view available opportunities.
        </p>
      </div>

      {/* SVG container */}
      <div id="region-map-container" className="group">
        {/* Inject SVG */}
        <div dangerouslySetInnerHTML={{ __html: svgContent }} />
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed left-0 top-0 px-3 py-1 bg-[var(--accent-soft)] text-[var(--accent-strong)] text-sm rounded shadow-lg pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
        >
          {tooltip.name}
        </div>
      )}
    </div>
  );
}
