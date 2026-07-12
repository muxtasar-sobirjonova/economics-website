const fs = require('fs');
const filePath = 'C:\\\\Users\\\\user\\\\.gemini\\\\antigravity-ide\\\\scratch\\\\economics_website\\\\app\\\\lessons\\\\[lessonId]\\\\concepts\\\\page.tsx';

let content = fs.readFileSync(filePath, 'utf-8');

const replacements = {
    // Backgrounds
    'bg-[#F9F9FB]': 'bg-[#f8f9fe]',
    'bg-[#FFFDF9]': 'bg-[#f8f9fe]',
    'bg-[#2D2B55]': 'bg-[#4b4474]',
    'bg-[#4B4279]': 'bg-[#4b4474]',
    
    // Primary Accents (Purple)
    'bg-[#7C6EE6]': 'bg-[#7c6fe4]',
    'bg-[#6B5FE4]': 'bg-[#7c6fe4]',
    'text-[#7C6EE6]': 'text-[#7c6fe4]',
    'text-[#6B5FE4]': 'text-[#7c6fe4]',
    'border-[#7C6EE6]': 'border-[#7c6fe4]',
    'border-[#6B5FE4]': 'border-[#7c6fe4]',
    
    // Primary Accents Hover
    'hover:bg-[#6A5CD8]': 'hover:bg-[#685cd6]',
    'hover:bg-[#5a4fd1]': 'hover:bg-[#685cd6]',
    'hover:border-[#7C6EE6]': 'hover:border-[#7c6fe4]',
    'hover:border-[#6B5FE4]': 'hover:border-[#7c6fe4]',
    'hover:text-[#7C6EE6]': 'hover:text-[#7c6fe4]',
    'hover:text-[#6B5FE4]': 'hover:text-[#7c6fe4]',
    
    // Text/Typography (Dark Charcoal)
    'text-[#1A1A3E]': 'text-[#2d2a3f]',
    'text-gray-900': 'text-[#2d2a3f]',
    
    // Action Green
    'bg-[#10B981]': 'bg-[#2ea87a]',
    'text-[#10B981]': 'text-[#2ea87a]',
};

for (const [oldVal, newVal] of Object.entries(replacements)) {
    content = content.split(oldVal).join(newVal);
}

fs.writeFileSync(filePath, content, 'utf-8');
