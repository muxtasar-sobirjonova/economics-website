const fs = require('fs');
const filePath = 'C:\\\\Users\\\\user\\\\.gemini\\\\antigravity-ide\\\\scratch\\\\economics_website\\\\app\\\\lessons\\\\[lessonId]\\\\concepts\\\\page.tsx';

let content = fs.readFileSync(filePath, 'utf-8');

const replacements = {
    // Leftover from previous
    '#A59EFF': '#7cd1c0', 
    'text-gray-900': 'text-[#2d2a3f]',
    'text-gray-600': 'text-[#4b4474]',
    'text-gray-500': 'text-[#4b4474]',
    'text-gray-400': 'text-[#a09eb0]', // lighter charcoal/purple
    'bg-gray-100': 'bg-[#eef0f7]',
    'border-gray-100': 'border-[#eef0f7]',
    'border-gray-200': 'border-[#eef0f7]',
};

for (const [oldVal, newVal] of Object.entries(replacements)) {
    content = content.split(oldVal).join(newVal);
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Updated more colors!");
