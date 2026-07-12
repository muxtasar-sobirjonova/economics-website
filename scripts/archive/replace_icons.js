const fs = require('fs');
const path = require('path');

const applyReplacements = (file, replacements) => {
  let content = fs.readFileSync(file, 'utf8');
  let orig = content;
  
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }

  if (content !== orig) {
    fs.writeFileSync(file, content);
    console.log("Updated", file);
  }
};

const conceptsFile = path.join(__dirname, 'app/lessons/[lessonId]/concepts/page.tsx');
applyReplacements(conceptsFile, [
  { search: /import \{(.*?)\} from "@tabler\/icons-react";/s, replace: 'import { $1 } from "@tabler/icons-react";\nimport { BookOpen } from "lucide-react";' },
  { search: /<IconBook size=\{48\} className="text-\[#3B82F6\]" stroke=\{1\.5\} \/>/, replace: '<BookOpen size={48} className="text-[#3B82F6]" strokeWidth={1.5} />' }
]);

const articlesFile = path.join(__dirname, 'app/lessons/[lessonId]/articles/page.tsx');
applyReplacements(articlesFile, [
  { search: /import \{(.*?)\} from "@tabler\/icons-react";/s, replace: 'import { $1 } from "@tabler/icons-react";\nimport { FileText } from "lucide-react";' },
  { search: /<IconFileText size=\{48\} className="text-\[#8B5CF6\]" stroke=\{1\.5\} \/>/, replace: '<FileText size={48} className="text-[#8B5CF6]" strokeWidth={1.5} />' }
]);

const quizzesFile = path.join(__dirname, 'app/lessons/[lessonId]/quizzes/page.tsx');
applyReplacements(quizzesFile, [
  { search: /import \{(.*?)\} from "@tabler\/icons-react";/s, replace: 'import { $1 } from "@tabler/icons-react";\nimport { BrainCircuit } from "lucide-react";' },
  { search: /<IconBrain size=\{48\} className="text-\[#22C55E\]" stroke=\{1\.5\} \/>/, replace: '<BrainCircuit size={48} className="text-[#22C55E]" strokeWidth={1.5} />' }
]);
