const fs = require('fs');
const path = require('path');
const baseDir = 'C:\\\\Users\\\\user\\\\.gemini\\\\antigravity-ide\\\\scratch\\\\economics_website';

const configs = [
  {
    file: 'app/lessons/[lessonId]/concepts/page.tsx',
    accent: '#6B5FE4'
  },
  {
    file: 'app/lessons/[lessonId]/examples/page.tsx',
    accent: '#0EA5E9'
  },
  {
    file: 'app/lessons/[lessonId]/articles/page.tsx',
    accent: '#F59E0B'
  },
  {
    file: 'app/lessons/[lessonId]/quizzes/page.tsx',
    accent: '#10B981'
  }
];

function processFile(relPath, replacer) {
  const f = path.join(baseDir, relPath);
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  content = replacer(content);
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated ' + f);
  }
}

for (let config of configs) {
  processFile(config.file, (content) => {
    // Page background
    content = content.replace(/bg-\[#FFF7E6\]/g, 'bg-[#F0EFFF]');
    content = content.replace(/bg-[#f4f7f6]/g, 'bg-[#F0EFFF]');
    
    // Hero Banner
    content = content.replace(/style={{ backgroundColor: "#846A72" }}/g, 'style={{ backgroundColor: "#2D2B55" }}');
    content = content.replace(/linear-gradient\(transparent, #846A72\)/g, 'linear-gradient(transparent, #2D2B55)');
    
    // Pill label
    content = content.replace(/backgroundColor: "rgba\(255,247,230,0\.15\)", color: "#FFF7E6"/g, 'backgroundColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)"');
    
    // Main heading
    content = content.replace(/text-\[#FFF7E6\] text-\[32px\]/g, 'text-[#FFFFFF] text-[32px]');
    
    // Body text
    content = content.replace(/text-\[rgba\(255,247,230,0\.75\)\]/g, 'text-[rgba(255,255,255,0.7)]');
    
    // Read more
    content = content.replace(/style={{ color: "rgba\(255,247,230,0\.7\)" }}/g, 'style={{ color: "rgba(255,255,255,0.5)" }}');
    
    // Card Container (remove old bg, add new styles)
    // Currently something like: style={{ backgroundColor: "#F7C8D3" }} or style={{ border: "0.5px solid #F7C8D3" }}
    content = content.replace(/style={{ backgroundColor: "#[A-Z0-9]+" }}/gi, '');
    content = content.replace(/style={{ border: "0\.5px solid #[A-Z0-9]+" }}/gi, '');
    // Replace rounded-[16px] with rounded-[12px] bg-[#FFFFFF] and border/shadow/left-border
    content = content.replace(/rounded-\[16px\]/g, 'rounded-[12px] bg-[#FFFFFF]');
    content = content.replace(/style={isActive \? \{ boxShadow: "0 0 0 2px #FFFFFF" \} : \{\}}/g, `style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: "4px solid ${config.accent}" }}`);
    
    // Title
    content = content.replace(/text-\[#[A-Z0-9]+\] mt-auto mb-4/gi, 'text-[#1A1A3E] mt-auto mb-4');
    
    // Meta text (lesson number)
    content = content.replace(/style={{ color: "rgba\(45,58,71,0\.6\)" }}/g, 'style={{ color: "rgba(26,26,62,0.5)" }}');
    content = content.replace(/style={{ color: "rgba\(255,255,255,0\.7\)" }}/g, 'style={{ color: "rgba(26,26,62,0.5)" }}');
    content = content.replace(/style={{ color: "#846A72" }}>\\n\s*(LESSON)/g, 'style={{ color: "rgba(26,26,62,0.5)" }}>\n                            $1'); // Handle Articles page
    
    // Star icon
    content = content.replace(/style={{ color: "rgba\(45,58,71,0\.3\)" }}/g, 'style={{ color: "rgba(26,26,62,0.25)" }}');
    content = content.replace(/style={{ color: "rgba\(255,255,255,0\.4\)" }}/g, 'style={{ color: "rgba(26,26,62,0.25)" }}');
    content = content.replace(/style={{ color: "#F7C8D3" }}/g, 'style={{ color: "rgba(26,26,62,0.25)" }}');
    
    // COMPLETED badge / text
    content = content.replace(/text-\[#[A-Z0-9]+\] tracking-wider uppercase/g, `text-[${config.accent}] tracking-wider uppercase`);
    // Completed dot
    content = content.replace(/bg-\[#[A-Z0-9]+\]"\s*\/>/g, `bg-[${config.accent}]" />`);
    
    // Section label
    content = content.replace(/style={{ color: "#846A72" }}>\\n/g, 'style={{ color: "#1A1A3E" }} className="font-medium">\n');

    return content;
  });
}
