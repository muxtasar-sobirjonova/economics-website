const fs = require('fs');
const filePath = 'C:\\\\Users\\\\user\\\\.gemini\\\\antigravity-ide\\\\scratch\\\\economics_website\\\\app\\\\lessons\\\\[lessonId]\\\\concepts\\\\page.tsx';

let content = fs.readFileSync(filePath, 'utf-8');

const replacements = {
    'bg-[#FFFDF9]': 'bg-[#F9F9FB]',
    'bg-[#2D2B55]': 'bg-[#4B4279]',
    'bg-[#6B5FE4]': 'bg-[#7C6EE6]',
    'text-[#6B5FE4]': 'text-[#7C6EE6]',
    'border-[#6B5FE4]': 'border-[#7C6EE6]',
    'hover:bg-[#5a4fd1]': 'hover:bg-[#6A5CD8]',
    'hover:border-[#6B5FE4]': 'hover:border-[#7C6EE6]',
    'hover:text-[#6B5FE4]': 'hover:text-[#7C6EE6]',
    'bg-[#F8F7FF]': 'bg-[#F3F2FF]',
    'border-[#EAE8FF]': 'border-[#E0DDFF]',
};

for (const [oldVal, newVal] of Object.entries(replacements)) {
    content = content.split(oldVal).join(newVal);
}

fs.writeFileSync(filePath, content, 'utf-8');
