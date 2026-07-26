const fs = require('fs');
let content = fs.readFileSync('components/roadmap/RoadmapMap.tsx', 'utf8');

const chapters = [
  { bg: 'bg-gradient-to-b from-[#B8A4FF] to-[#F1EAFF]', btn: 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white' },
  { bg: 'bg-gradient-to-b from-[#6EC1FF] to-[#E8F3FF]', btn: 'bg-[#2589FE] hover:bg-[#1D6ED8] text-white' },
  { bg: 'bg-gradient-to-b from-[#5CE0A6] to-[#E3FCF2]', btn: 'bg-[#059669] hover:bg-[#047857] text-white' },
  { bg: 'bg-gradient-to-b from-[#FF98C1] to-[#FFEBF3]', btn: 'bg-[#DB2777] hover:bg-[#BE185D] text-white' },
  { bg: 'bg-gradient-to-b from-[#FFB86B] to-[#FFF4E8]', btn: 'bg-[#EA580C] hover:bg-[#C2410C] text-white' },
  { bg: 'bg-gradient-to-b from-[#5EEAD4] to-[#E6FFFA]', btn: 'bg-[#0D9488] hover:bg-[#0F766E] text-white' },
  { bg: 'bg-gradient-to-b from-[#94A3B8] to-[#F1F5F9]', btn: 'bg-[#475569] hover:bg-[#334155] text-white' },
  { bg: 'bg-gradient-to-b from-[#FCD34D] to-[#FFFBEB]', btn: 'bg-[#D97706] hover:bg-[#B45309] text-white' }
];

let chapterIndex = 0;
content = content.replace(/bgClass:\s*\"[^\"]+\",\s*btnClass:\s*\"[^\"]+\"/g, (match) => {
  if (chapterIndex < chapters.length) {
    const replacement = `bgClass: "${chapters[chapterIndex].bg}",\n    btnClass: "${chapters[chapterIndex].btn}"`;
    chapterIndex++;
    return replacement;
  }
  return match;
});

fs.writeFileSync('components/roadmap/RoadmapMap.tsx', content);
