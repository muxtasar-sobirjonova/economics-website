const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/(marketing)/ClientPage.fixed.tsx');
const content = fs.readFileSync(filePath, 'utf-8');

// Ensure components directory exists
const componentsDir = path.join(__dirname, 'components/marketing');
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

// Map of components to extract and their dependencies
const components = [
  {
    name: 'ScrollReveal',
    regex: /const ScrollReveal = [\s\S]*?\);\s*};?/
  },
  {
    name: 'BrowserChrome',
    regex: /const BrowserChrome = [\s\S]*?\);\s*};?/
  },
  {
    name: 'DashboardMockup',
    regex: /const DashboardMockup = [\s\S]*?\);\s*};?/
  },
  {
    name: 'RoadmapMockup',
    regex: /const RoadmapMockup = [\s\S]*?\);\s*};?/
  },
  {
    name: 'ConceptsMockup',
    regex: /const ConceptsMockup = [\s\S]*?\);\s*};?/
  },
  {
    name: 'ArticlesMockup',
    regex: /const ArticlesMockup = [\s\S]*?\);\s*};?/
  },
  {
    name: 'NotesMockup',
    regex: /const NotesMockup = [\s\S]*?\);\s*};?/
  },
  {
    name: 'FlashcardMockup',
    regex: /const FlashcardMockup = [\s\S]*?\);\s*};?/
  },
  {
    name: 'Eyebrow',
    regex: /const Eyebrow = [\s\S]*?\);\s*};?/
  },
  {
    name: 'SectionHeading',
    regex: /const SectionHeading = [\s\S]*?\);\s*};?/
  },
  {
    name: 'FeatureCard',
    regex: /const FeatureCard = [\s\S]*?\};\s*};?/
  }
];

// Fallback manual extraction
let lastIndex = 0;
// We can also extract the components by finding `const ComponentName =` and matching the outer block.
// Let's use a simpler approach: just read the file line by line.

const lines = content.split('\n');

function extractComponent(startSignature, name, hasFramer, hasReact, hasLucide, addBrowserChrome=false) {
  let inComponent = false;
  let componentLines = [];
  let bracketCount = 0;
  let parenCount = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!inComponent && line.startsWith(startSignature)) {
      inComponent = true;
    }
    if (inComponent) {
      componentLines.push(line);
      // count braces
      bracketCount += (line.match(/\{/g) || []).length;
      bracketCount -= (line.match(/\}/g) || []).length;
      parenCount += (line.match(/\(/g) || []).length;
      parenCount -= (line.match(/\)/g) || []).length;
      
      // heuristic for end of arrow function component
      if (bracketCount === 0 && parenCount === 0 && (line.includes(');') || line.trim() === '};' || line.trim() === ');' || line.trim() === ')')) {
        // Just in case it's on a new line
        break;
      }
    }
  }

  let code = componentLines.join('\n');
  if (!code) return null;

  // Add imports
  let imports = [];
  if (hasFramer || code.includes('motion')) {
    imports.push("import { motion, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion';");
    imports.push("'use client';\n");
  } else {
    // some static components might not need use client, but instructions say add it if animated
  }
  
  if (hasReact || code.includes('React.ReactNode')) {
    imports.push("import React from 'react';");
  }

  // extract icons
  const iconMatches = [...code.matchAll(/<Icon[A-Za-z0-9]+/g)].map(m => m[0].replace('<', ''));
  if (iconMatches.length > 0) {
    const uniqueIcons = [...new Set(iconMatches)];
    imports.push(`import { ${uniqueIcons.join(', ')} } from '@tabler/icons-react';`);
  }
  
  if (addBrowserChrome) {
    imports.push("import { BrowserChrome } from './BrowserChrome';");
  }

  const finalCode = `${imports.reverse().join('\n')}\n\nexport ${code}`;
  fs.writeFileSync(path.join(componentsDir, `${name}.tsx`), finalCode);
  return code;
}

extractComponent('const ScrollReveal =', 'ScrollReveal', true, true, false);
extractComponent('const BrowserChrome =', 'BrowserChrome', false, false, false);
extractComponent('const DashboardMockup =', 'DashboardMockup', true, false, true, true);
extractComponent('const RoadmapMockup =', 'RoadmapMockup', true, false, true, false);
extractComponent('const ConceptsMockup =', 'ConceptsMockup', true, false, true, false);
extractComponent('const ArticlesMockup =', 'ArticlesMockup', true, false, false, false);
extractComponent('const NotesMockup =', 'NotesMockup', false, false, false, true);
extractComponent('const FlashcardMockup =', 'FlashcardMockup', true, false, false, false);
extractComponent('const Eyebrow =', 'Eyebrow', false, true, false, false);
extractComponent('const SectionHeading =', 'SectionHeading', false, true, false, false);
extractComponent('const FeatureCard =', 'FeatureCard', true, true, true, false);

console.log('Components extracted.');
