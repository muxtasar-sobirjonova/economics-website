'use client';

import { useMemo, useState } from 'react';
import { Fraunces, Manrope, JetBrains_Mono } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
});

const regions = [
  { symbol: 'KRK', name: 'Republic of Karakalpakstan', count: 4, change: 1, spark: [2, 3, 2, 3, 4, 4] },
  { symbol: 'XOR', name: 'Xorazm Region', count: 5, change: 0, spark: [5, 5, 4, 5, 5, 5] },
  { symbol: 'NAV', name: 'Navoiy Region', count: 5, change: -1, spark: [7, 6, 6, 6, 5, 5] },
  { symbol: 'BUX', name: 'Bukhara Region', count: 12, change: 2, spark: [8, 9, 10, 9, 11, 12] },
  { symbol: 'QSH', name: 'Qashqadaryo Region', count: 7, change: 1, spark: [5, 6, 5, 6, 6, 7] },
  { symbol: 'SUR', name: 'Surxondaryo Region', count: 6, change: 0, spark: [6, 7, 6, 6, 6, 6] },
  { symbol: 'SMQ', name: 'Samarqand Region', count: 15, change: 3, spark: [9, 10, 11, 12, 13, 15] },
  { symbol: 'JIZ', name: 'Jizzakh Region', count: 6, change: -1, spark: [8, 8, 7, 7, 6, 6] },
  { symbol: 'SIR', name: 'Sirdaryo Region', count: 4, change: 0, spark: [4, 5, 4, 4, 4, 4] },
  { symbol: 'TSR', name: 'Tashkent Region', count: 18, change: 2, spark: [13, 14, 15, 16, 17, 18] },
  { symbol: 'TSC', name: 'Tashkent City', count: 34, change: 5, spark: [24, 26, 28, 29, 31, 34] },
  { symbol: 'NAM', name: 'Namangan Region', count: 8, change: 1, spark: [6, 6, 7, 7, 8, 8] },
  { symbol: 'AND', name: 'Andijan Region', count: 9, change: -2, spark: [13, 12, 11, 10, 10, 9] },
  { symbol: 'FRG', name: 'Fergana Region', count: 11, change: 2, spark: [7, 8, 9, 9, 10, 11] },
] as const;

const listings = [
  { role: 'Data Analyst Intern', org: "Ipak Yo'li Bank", region: 'Tashkent City', tag: 'Data' },
  { role: 'Growth Marketing Intern', org: 'Uzum Market', region: 'Tashkent City', tag: 'Marketing' },
  { role: 'Policy Research Fellow', org: 'Center for Economic Research', region: 'Tashkent City', tag: 'Policy' },
  { role: 'Research Assistant', org: 'Prof. D. Karimova — Dev. Econ Lab', region: 'Samarqand Region', tag: 'Research' },
  { role: 'Trade Finance Intern', org: 'Silk Road Exports', region: 'Fergana Region', tag: 'Business' },
  { role: 'Ops Intern', org: 'Bukhara AgriTech Hub', region: 'Bukhara Region', tag: 'Startups' },
  { role: 'Junior Economist', org: 'Namangan Chamber of Commerce', region: 'Namangan Region', tag: 'Business' },
  { role: 'Research Assistant', org: 'Prof. B. Yusupov — Trade Policy', region: 'Andijan Region', tag: 'Research' },
  { role: 'Product Research Intern', org: 'UzAuto Motors', region: 'Tashkent Region', tag: 'Research' },
  { role: 'Data Operations Intern', org: 'NBU Digital', region: 'Tashkent Region', tag: 'Data' },
  { role: 'SMB Growth Intern', org: 'Smart Banking Lab', region: 'Tashkent Region', tag: 'Marketing' },
  { role: 'Policy Analyst Intern', org: 'Ministry of Economy', region: 'Tashkent Region', tag: 'Policy' },
  { role: 'Business Development Intern', org: 'Fergana AgroTech', region: 'Fergana Region', tag: 'Business' },
  { role: 'Startup Analyst', org: 'Startup Valley', region: 'Tashkent City', tag: 'Startups' },
  { role: 'Impact Research Intern', org: 'Green Growth Fund', region: 'Sirdaryo Region', tag: 'Research' },
] as const;

const filterOptions = ['All', 'Data', 'Marketing', 'Policy', 'Research', 'Business', 'Startups'] as const;

const formatChange = (change: number) => {
  if (change > 0) return `▲ ${change}`;
  if (change < 0) return `▼ ${Math.abs(change)}`;
  return '—';
};

const toneClass = (change: number) => {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'flat';
};

const sparklineSvg = (values: number[], color: string, width = 100, height = 32) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height * 0.85 - height * 0.075;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return `
    <svg class="sparkline" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-hidden="true">
      <polyline points="${points}" fill="none" stroke="${color}" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  `;
};

const marqueeText = [...regions, ...regions]
  .map(
    (region) =>
      `<span class="marquee-item"><strong>${region.symbol}</strong> ${region.name.replace(' Region', '')} <span class="marquee-change ${toneClass(region.change)}">${formatChange(region.change)}</span></span><span class="marquee-separator">✦</span>`,
  )
  .join('');

export default function InternshipsPage() {
  const [selectedRegion, setSelectedRegion] = useState('Tashkent City');
  const [activeTag, setActiveTag] = useState<(typeof filterOptions)[number]>('All');

  const selectedRegionData = useMemo(
    () => regions.find((region) => region.name === selectedRegion) ?? regions[0],
    [selectedRegion],
  );

  const visibleListings = useMemo(
    () => (activeTag === 'All' ? listings : listings.filter((listing) => listing.tag === activeTag)),
    [activeTag],
  );

  const regionListings = useMemo(
    () => listings.filter((listing) => listing.region === selectedRegionData.name).slice(0, 3),
    [selectedRegionData.name],
  );

  const movers = [...regions].sort((a, b) => b.change - a.change).slice(0, 3);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        :root {
          --ink: #1B1329;
          --ink-soft: #5B5169;
          --purple-900: #2A0F4E;
          --purple-700: #4C1A85;
          --purple-500: #7C4DBF;
          --purple-300: #B292DE;
          --purple-150: #E4D8F5;
          --purple-100: #EFE6FA;
          --surface: #FBF8F9;
          --line: #E5DAEF;
          --up: #D89A3B;
          --down: #9C5B72;
          --flat: #8C82A0;
          --white: #ffffff;
          --shadow-soft: 0 12px 32px rgba(42, 15, 78, 0.08);
        }

        .internships-page {
          background: var(--surface);
          color: var(--ink);
          font-family: var(--font-body), sans-serif;
          min-height: 100%;
        }

        .internships-page * { box-sizing: border-box; }

        .internships-page a,
        .internships-page button {
          transition: border-color 0.16s ease, transform 0.16s ease, background 0.16s ease, color 0.16s ease, box-shadow 0.16s ease;
        }

        .internships-page button {
          font: inherit;
        }

        .internships-page .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 32px;
          border-bottom: 1px solid var(--line);
          background: rgba(251, 248, 249, 0.96);
          backdrop-filter: blur(8px);
        }

        .internships-page .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .internships-page .brand-mark {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: var(--purple-700);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-size: 17px;
          font-weight: 700;
          flex: none;
        }

        .internships-page .brand-word {
          font-family: var(--font-display), serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.02em;
          color: var(--ink);
        }

        .internships-page .brand-word span {
          display: block;
          font-family: var(--font-mono), monospace;
          font-weight: 500;
          font-size: 9.5px;
          letter-spacing: 0.1em;
          color: var(--ink-soft);
          text-transform: uppercase;
          margin-top: 2px;
        }

        .internships-page .live {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-soft);
          white-space: nowrap;
        }

        .internships-page .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--up);
          box-shadow: 0 0 0 0 rgba(216, 154, 59, 0.6);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(216, 154, 59, 0.45); }
          70% { box-shadow: 0 0 0 8px rgba(216, 154, 59, 0); }
          100% { box-shadow: 0 0 0 0 rgba(216, 154, 59, 0); }
        }

        .internships-page .marquee-track {
          background: var(--purple-900);
          overflow: hidden;
          white-space: nowrap;
          padding: 9px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .internships-page .marquee-inner {
          display: inline-block;
          min-width: max-content;
          animation: marquee-scroll 38s linear infinite;
        }

        .internships-page .marquee-track:hover .marquee-inner {
          animation-play-state: paused;
        }

        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .internships-page .marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono), monospace;
          font-size: 12.5px;
          color: var(--purple-150);
          padding: 0 22px;
        }

        .internships-page .marquee-item strong {
          color: var(--white);
          letter-spacing: 0.06em;
          font-weight: 700;
        }

        .internships-page .marquee-change {
          font-weight: 600;
          font-size: 12px;
        }

        .internships-page .marquee-change.up { color: var(--up); }
        .internships-page .marquee-change.down { color: #f0d1de; }
        .internships-page .marquee-change.flat { color: var(--flat); }

        .internships-page .marquee-separator {
          color: var(--purple-500);
          font-size: 12.5px;
          display: inline-flex;
          align-items: center;
        }

        .internships-page .page-wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 32px 90px;
        }

        .internships-page .hero {
          padding: 48px 0 30px;
        }

        .internships-page .eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono), monospace;
          font-size: 11.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--up);
          margin: 0 0 16px;
        }

        .internships-page .eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--up);
          animation: pulse 2s infinite;
          display: inline-block;
        }

        .internships-page .hero-grid {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
        }

        .internships-page .hero-title {
          margin: 0;
          max-width: 600px;
          font-family: var(--font-display), serif;
          font-weight: 600;
          font-size: clamp(34px, 3.3vw, 46px);
          line-height: 1.06;
          letter-spacing: -0.01em;
        }

        .internships-page .hero-title em {
          font-style: italic;
          color: var(--purple-700);
        }

        .internships-page .hero-sub {
          margin: 16px 0 0;
          max-width: 430px;
          color: var(--ink-soft);
          font-size: 16px;
          line-height: 1.6;
        }

        .internships-page .index-strip {
          display: flex;
          flex: none;
          border: 1px solid var(--line);
          border-radius: 14px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.7);
          box-shadow: var(--shadow-soft);
        }

        .internships-page .index-cell {
          min-width: 160px;
          padding: 14px 20px;
          border-right: 1px solid var(--line);
          text-align: left;
        }

        .internships-page .index-cell:last-child {
          border-right: none;
        }

        .internships-page .index-label {
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }

        .internships-page .index-value {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-top: 3px;
          color: var(--purple-900);
          font-family: var(--font-mono), monospace;
          font-size: 22px;
          font-weight: 700;
        }

        .internships-page .change-pill {
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .internships-page .change-pill.up { color: var(--up); }
        .internships-page .change-pill.down { color: var(--down); }
        .internships-page .change-pill.flat { color: var(--flat); }

        .internships-page .section-label {
          display: flex;
          align-items: baseline;
          gap: 14px;
          margin: 54px 0 6px;
        }

        .internships-page .section-label h2 {
          margin: 0;
          font-family: var(--font-display), serif;
          font-size: clamp(20px, 2vw, 22px);
          font-weight: 600;
          white-space: nowrap;
        }

        .internships-page .section-rule {
          height: 1px;
          background: var(--line);
          flex: 1;
        }

        .internships-page .section-hint {
          margin: 0 0 22px;
          color: var(--ink-soft);
          font-size: 13px;
        }

        .internships-page .movers-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 8px;
        }

        .internships-page .mover-card {
          position: relative;
          overflow: hidden;
          border-radius: 18px;
          background: var(--purple-900);
          color: var(--white);
          padding: 22px;
          min-height: 150px;
        }

        .internships-page .mover-sym {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--purple-300);
        }

        .internships-page .mover-name {
          margin: 6px 0 14px;
          font-family: var(--font-display), serif;
          font-size: 22px;
          font-weight: 600;
        }

        .internships-page .mover-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 10px;
        }

        .internships-page .mover-price {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-family: var(--font-mono), monospace;
          font-size: 34px;
          line-height: 1;
          font-weight: 700;
          color: var(--white);
        }

        .internships-page .mover-price small {
          font-size: 11px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--purple-300);
          font-weight: 500;
        }

        .internships-page .sparkline {
          display: block;
          max-width: 110px;
          width: 100%;
        }

        .internships-page .board-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(320px, 1fr);
          gap: 24px;
          align-items: start;
          margin-top: 14px;
        }

        .internships-page .board-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .internships-page .ticker-card {
          appearance: none;
          border: 1px solid var(--line);
          background: #fff;
          border-radius: 14px;
          padding: 14px 15px;
          cursor: pointer;
          text-align: left;
          min-height: 112px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: var(--ink);
          box-shadow: none;
        }

        .internships-page .ticker-card:hover {
          border-color: var(--purple-300);
          transform: translateY(-2px);
        }

        .internships-page .ticker-card.selected {
          border-color: var(--purple-700);
          background: var(--purple-100);
          box-shadow: inset 0 0 0 1px var(--purple-700);
        }

        .internships-page .ticker-sym {
          color: var(--ink-soft);
          font-family: var(--font-mono), monospace;
          font-size: 10.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .internships-page .ticker-name {
          margin-top: 2px;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.3;
          color: var(--ink);
        }

        .internships-page .ticker-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 8px;
          margin-top: 10px;
        }

        .internships-page .ticker-count {
          font-family: var(--font-mono), monospace;
          font-size: 19px;
          font-weight: 700;
          color: var(--purple-900);
        }

        .internships-page .change-badge {
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .internships-page .change-badge.up { color: var(--up); }
        .internships-page .change-badge.down { color: var(--down); }
        .internships-page .change-badge.flat { color: var(--flat); }

        .internships-page .order-panel {
          position: sticky;
          top: 24px;
          background: var(--purple-900);
          color: var(--white);
          border-radius: 20px;
          padding: 26px;
          min-height: 440px;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-soft);
        }

        .internships-page .panel-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .internships-page .panel-kicker {
          margin: 0;
          font-family: var(--font-mono), monospace;
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--purple-300);
        }

        .internships-page .panel-name {
          margin: 8px 0 2px;
          font-family: var(--font-display), serif;
          font-size: 27px;
          line-height: 1.1;
          font-weight: 600;
        }

        .internships-page .panel-metric {
          margin-top: 14px;
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .internships-page .panel-count {
          font-family: var(--font-mono), monospace;
          font-size: 36px;
          line-height: 1;
          font-weight: 700;
          color: var(--white);
        }

        .internships-page .panel-change {
          font-family: var(--font-mono), monospace;
          font-size: 14px;
          font-weight: 600;
        }

        .internships-page .panel-change.up { color: var(--up); }
        .internships-page .panel-change.down { color: var(--down); }
        .internships-page .panel-change.flat { color: var(--flat); }

        .internships-page .panel-sub {
          margin: 2px 0 20px;
          color: var(--purple-300);
          font-size: 12.5px;
        }

        .internships-page .order-book {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .internships-page .order-row {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 11px 13px;
        }

        .internships-page .order-role {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--white);
          line-height: 1.4;
        }

        .internships-page .order-org {
          margin-top: 2px;
          font-family: var(--font-mono), monospace;
          font-size: 11.5px;
          color: var(--purple-300);
          line-height: 1.4;
        }

        .internships-page .panel-footer {
          margin-top: auto;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
        }

        .internships-page .panel-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--white);
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          letter-spacing: 0.03em;
          text-decoration: none;
        }

        .internships-page .panel-link:hover {
          color: var(--purple-150);
        }

        .internships-page .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 22px;
        }

        .internships-page .chip {
          appearance: none;
          border: 1px solid var(--line);
          background: #fff;
          border-radius: 8px;
          padding: 8px 15px;
          color: var(--ink-soft);
          font-family: var(--font-mono), monospace;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .internships-page .chip:hover {
          border-color: var(--purple-300);
        }

        .internships-page .chip.active {
          background: var(--purple-700);
          border-color: var(--purple-700);
          color: var(--white);
        }

        .internships-page .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .internships-page .listing-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px;
          border-radius: 16px;
          background: #fff;
          border: 1px solid var(--line);
          box-shadow: none;
          min-height: 160px;
        }

        .internships-page .listing-card:hover {
          border-color: var(--purple-300);
          transform: translateY(-2px);
        }

        .internships-page .listing-tag {
          align-self: flex-start;
          background: var(--purple-100);
          color: var(--purple-700);
          border-radius: 6px;
          padding: 4px 10px;
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .internships-page .listing-role {
          margin: 2px 0 0;
          font-family: var(--font-display), serif;
          font-size: 17px;
          line-height: 1.3;
          font-weight: 600;
          color: var(--ink);
        }

        .internships-page .listing-org {
          color: var(--ink-soft);
          font-size: 13px;
          line-height: 1.5;
        }

        .internships-page .listing-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          font-family: var(--font-mono), monospace;
          font-size: 11.5px;
          color: var(--ink-soft);
        }

        .internships-page .listing-meta span:last-child {
          color: var(--purple-700);
          font-weight: 600;
        }

        :focus-visible {
          outline: 3px solid var(--up);
          outline-offset: 2px;
          border-radius: 4px;
        }

        @media (max-width: 920px) {
          .internships-page .board-layout {
            grid-template-columns: 1fr;
          }

          .internships-page .panel {
            position: static;
          }

          .internships-page .board-grid,
          .internships-page .movers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .internships-page .index-strip {
            width: 100%;
            flex-wrap: wrap;
          }

          .internships-page .hero-grid {
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .internships-page .topbar {
            padding: 16px 20px;
          }

          .internships-page .brand-word {
            font-size: 13px;
          }

          .internships-page .live {
            display: none;
          }

          .internships-page .page-wrap {
            padding: 0 20px 70px;
          }

          .internships-page .board-grid,
          .internships-page .movers-grid {
            grid-template-columns: 1fr;
          }

          .internships-page .section-label {
            margin-top: 42px;
          }

          .internships-page .hero {
            padding-top: 32px;
          }

          .internships-page .marquee-item {
            padding: 0 14px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .internships-page .marquee-inner,
          .internships-page .live-dot,
          .internships-page .eyebrow-dot,
          .internships-page a,
          .internships-page button {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className={`internships-page ${fraunces.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
        <header className="topbar">
          <div className="brand" aria-label="That's So Econ home">
            <div className="brand-mark">↗</div>
            <div className="brand-word">
              THAT&apos;S SO ECON!
              <span>The Exchange</span>
            </div>
          </div>

          <div className="live" aria-live="polite">
            <span className="live-dot" aria-hidden="true" />
            Live · Updated this week
          </div>
        </header>

        <div className="marquee-track" aria-label="Market ticker">
          <div className="marquee-inner" dangerouslySetInnerHTML={{ __html: marqueeText }} />
        </div>

        <main className="page-wrap">
          <section className="hero" aria-labelledby="internships-hero-title">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Market open — Internship Exchange, Uzbekistan
            </p>

            <div className="hero-grid">
              <div>
                <h1 id="internships-hero-title" className="hero-title">
                  Track where <em>opportunity</em> is trading.
                </h1>
                <p className="hero-sub">Every region, every week — who&apos;s hiring, how fast it&apos;s moving, and where to apply.</p>
              </div>

              <div className="index-strip" aria-label="Exchange summary">
                <div className="index-cell">
                  <div className="index-label">Open roles</div>
                  <div className="index-value">
                    144 <span className="change-pill up">▲ 12</span>
                  </div>
                </div>
                <div className="index-cell">
                  <div className="index-label">Regions active</div>
                  <div className="index-value">
                    14/14 <span className="change-pill flat">—</span>
                  </div>
                </div>
                <div className="index-cell">
                  <div className="index-label">Partner orgs</div>
                  <div className="index-value">
                    38 <span className="change-pill up">▲ 3</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="section-label">
            <h2>Top movers this week</h2>
            <div className="section-rule" aria-hidden="true" />
          </div>
          <p className="section-hint">Regions with the biggest jump in open roles since last week.</p>

          <div className="movers-grid" aria-label="Top movers this week">
            {movers.map((region) => (
              <article className="mover-card" key={region.symbol}>
                <div className="mover-sym">{region.symbol} · {region.name.replace(' Region', '')}</div>
                <div className="mover-row">
                  <div className="mover-price">
                    {region.count}
                    <small>open roles</small>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: sparklineSvg(region.spark, '#E0A23D', 90, 34) }} />
                </div>
              </article>
            ))}
          </div>

          <div className="section-label">
            <h2>The full board</h2>
            <div className="section-rule" aria-hidden="true" />
          </div>
          <p className="section-hint">All 14 regions. Click one to open its order book.</p>

          <section className="board-layout" aria-label="Regional board and order book">
            <div className="board-grid" role="list" aria-label="Region board">
              {regions.map((region) => (
                <button
                  key={region.symbol}
                  type="button"
                  className={`ticker-card ${selectedRegion === region.name ? 'selected' : ''}`}
                  onClick={() => setSelectedRegion(region.name)}
                  aria-pressed={selectedRegion === region.name}
                >
                  <div className="ticker-sym">{region.symbol}</div>
                  <div className="ticker-name">{region.name.replace(' Region', '')}</div>
                  <div className="ticker-row">
                    <div className="ticker-count">{region.count}</div>
                    <div className={`change-badge ${toneClass(region.change)}`}>{formatChange(region.change)}</div>
                  </div>
                </button>
              ))}
            </div>

            <aside className="order-panel" aria-live="polite">
              <div className="panel-head">
                <div>
                  <p className="panel-kicker">{selectedRegionData.symbol} · Order book</p>
                  <h3 className="panel-name">{selectedRegionData.name.replace(' Region', '')}</h3>
                </div>
                <div dangerouslySetInnerHTML={{ __html: sparklineSvg(selectedRegionData.spark, '#E0A23D', 70, 30) }} />
              </div>

              <div className="panel-metric">
                <span className="panel-count">{selectedRegionData.count}</span>
                <span className={`panel-change ${toneClass(selectedRegionData.change)}`}>{formatChange(selectedRegionData.change)}</span>
              </div>

              <p className="panel-sub">open roles · vs. last week</p>

              <div className="order-book">
                {regionListings.length > 0 ? (
                  regionListings.map((listing) => (
                    <div className="order-row" key={`${listing.role}-${listing.org}`}>
                      <div className="order-role">{listing.role}</div>
                      <div className="order-org">{listing.org}</div>
                    </div>
                  ))
                ) : (
                  <div className="order-row">
                    <div className="order-role">New listings coming soon</div>
                    <div className="order-org">Check back for {selectedRegionData.name.replace(' Region', '')}</div>
                  </div>
                )}
              </div>

              <div className="panel-footer">
                <a href="#" className="panel-link">
                  See all {selectedRegionData.name.replace(' Region', '')} roles <span aria-hidden="true">→</span>
                </a>
              </div>
            </aside>
          </section>

          <div className="section-label">
            <h2>Today's openings</h2>
            <div className="section-rule" aria-hidden="true" />
          </div>

          <div className="filters" aria-label="Filter openings by category">
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`chip ${activeTag === option ? 'active' : ''}`}
                onClick={() => setActiveTag(option)}
                aria-pressed={activeTag === option}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="cards-grid" aria-live="polite">
            {visibleListings.map((listing) => (
              <article className="listing-card" key={`${listing.role}-${listing.org}`}>
                <span className="listing-tag">{listing.tag}</span>
                <h3 className="listing-role">{listing.role}</h3>
                <div className="listing-org">{listing.org}</div>
                <div className="listing-meta">
                  <span>{listing.region.replace(' Region', '')}</span>
                  <span>Apply →</span>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
