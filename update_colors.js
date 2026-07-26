const fs = require('fs');
let content = fs.readFileSync('components/roadmap/RoadmapMap.tsx', 'utf8');

const chapters = [
  { bg: 'bg-[#EFEAF6]', btn: 'bg-[#8B5CF6] hover:bg-[#7C3AED]' },
  { bg: 'bg-[#DFEAF5]', btn: 'bg-[#3085E4] hover:bg-[#2271CD]' },
  { bg: 'bg-[#E6F3EC]', btn: 'bg-[#10B981] hover:bg-[#059669]' },
  { bg: 'bg-[#FBE9F0]', btn: 'bg-[#EC4899] hover:bg-[#DB2777]' },
  { bg: 'bg-[#FDF0E1]', btn: 'bg-[#F97316] hover:bg-[#EA580C]' },
  { bg: 'bg-[#E2F4F3]', btn: 'bg-[#14B8A6] hover:bg-[#0D9488]' },
  { bg: 'bg-[#EBEDFC]', btn: 'bg-[#6366F1] hover:bg-[#4F46E5]' },
  { bg: 'bg-[#FEF5D9]', btn: 'bg-[#F59E0B] hover:bg-[#D97706]' }
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
