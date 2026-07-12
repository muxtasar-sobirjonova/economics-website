const fs = require('fs');
const path = require('path');

const files = [
    'C:\\\\Users\\\\user\\\\.gemini\\\\antigravity-ide\\\\scratch\\\\economics_website\\\\app\\\\lessons\\\\[lessonId]\\\\articles\\\\page.tsx',
    'C:\\\\Users\\\\user\\\\.gemini\\\\antigravity-ide\\\\scratch\\\\economics_website\\\\app\\\\lessons\\\\[lessonId]\\\\quizzes\\\\page.tsx'
];

const replacements = {
    // Layout
    'bg-[#FFFDF9]': 'bg-[#f8f9fe]',
    'bg-[#2D2B55] rounded-3xl p-10 flex relative overflow-hidden mb-12 shadow-lg': 'bg-[#ffffff] border border-[#eef0f7] rounded-3xl p-10 flex relative overflow-hidden mb-12 shadow-sm',
    
    // Purple Accents
    'bg-[#6B5FE4]': 'bg-[#7c6fe4]',
    'text-[#6B5FE4]': 'text-[#7c6fe4]',
    'border-[#6B5FE4]': 'border-[#7c6fe4]',
    
    // Hover states
    'hover:bg-[#5a4fd1]': 'hover:bg-[#685cd6]',
    'hover:border-[#6B5FE4]': 'hover:border-[#7c6fe4]',
    'hover:text-[#6B5FE4]': 'hover:text-[#7c6fe4]',
    
    // Grays and Charcoal
    'text-[#1A1A3E]': 'text-[#2d2a3f]',
    'text-gray-900': 'text-[#2d2a3f]',
    'text-gray-600': 'text-[#4b4474]',
    'text-gray-500': 'text-[#4b4474]',
    'text-gray-400': 'text-[#a09eb0]',
    'bg-gray-100': 'bg-[#eef0f7]',
    'border-gray-100': 'border-[#eef0f7]',
    'border-gray-200': 'border-[#eef0f7]',
    
    // Old light purple to teal
    '#A59EFF': '#7cd1c0',
    'text-[#A59EFF]': 'text-[#7cd1c0]',
    
    // Completed state
    'bg-[#10B981]': 'bg-[#7cd1c0]',
    'text-[#10B981]': 'text-[#7cd1c0]',
    
    // Specific icon bg
    'bg-[#F8F7FF]': 'bg-[#F3F2FF]',
    'border-[#EAE8FF]': 'border-[#E0DDFF]',
    
    // Hero Banner text specific
    'text-white text-[24px] font-bold mb-1': 'text-[#2d2a3f] text-[24px] font-bold mb-1',
    'text-white text-[28px] font-bold mb-3': 'text-[#2d2a3f] text-[28px] font-bold mb-3',
    'text-white/80 text-[14px] leading-relaxed': 'text-[#4b4474] text-[14px] leading-relaxed',
    
    // Header specific
    'hover:text-[#2d2a3f]': 'hover:text-[#2d2a3f]', // Just in case
    'bg-[#4b4474] text-white rounded-full flex items-center justify-center': 'bg-[#4b4474] text-white rounded-full flex items-center justify-center', // avatar
    'bg-[#2D2B55] text-white rounded-full flex items-center justify-center': 'bg-[#4b4474] text-white rounded-full flex items-center justify-center',
};

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf-8');
        for (const [oldVal, newVal] of Object.entries(replacements)) {
            content = content.split(oldVal).join(newVal);
        }
        
        // Remove SVG decoration logic in hero banner since it doesn't work on white bg
        const svgStart = content.indexOf('<div className="absolute right-0 top-0 bottom-0');
        if(svgStart !== -1) {
            const svgEnd = content.indexOf('</svg>\n          </div>', svgStart) + 24;
            content = content.substring(0, svgStart) + content.substring(svgEnd);
        }
        
        // Also update avatar specifically
        content = content.replace('<div className="w-8 h-8 bg-[#2D2B55]', '<div className="w-8 h-8 bg-[#4b4474]');
        
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`File not found: ${file}`);
    }
});
