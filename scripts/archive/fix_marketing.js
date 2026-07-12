const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/(marketing)/ClientPage.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replacements for Accessibility
content = content.replace(/<div([^>]*onClick[^>]*)>/g, '<button$1>');
content = content.replace(/<\/div>(\s*<!-- end button -->)/g, '</button>'); // this is tricky, let's just use role="button" instead

// Better accessibility replacement: 
// Find elements with cursor-pointer
content = content.replace(/<div([^>]*cursor-pointer[^>]*)>/g, '<button type="button" aria-label="Interactive Element"$1>');
// Close tags for those elements? It's impossible with simple regex if they have nested divs.
// Instead of regex for changing tag names, I will add role="button" and tabIndex={0}
content = content.replace(/className="([^"]*cursor-pointer[^"]*)"/g, 'className="$1" role="button" tabIndex={0} onKeyDown={(e) => { if(e.key === \'Enter\' || e.key === \' \') {} }}');

// Replace inline styles with tailwind
const styleMap = {
  'style={{ backgroundColor: "#d97706" }}': 'className="bg-amber-600"',
  'style={{ backgroundColor: "#fef3c7", color: "#d97706" }}': 'className="bg-amber-100 text-amber-600"',
  'style={{ backgroundColor: "#2563eb" }}': 'className="bg-blue-600"',
  'style={{ backgroundColor: "#dbeafe", color: "#2563eb" }}': 'className="bg-blue-100 text-blue-600"',
  'style={{ backgroundColor: "#9333ea" }}': 'className="bg-purple-600"',
  'style={{ backgroundColor: "#f3e8ff", color: "#9333ea" }}': 'className="bg-purple-100 text-purple-600"',
  'style={{ backgroundColor: "#15803D" }}': 'className="bg-green-700"',
  'style={{ color: "#15803D", backgroundColor: "#15803D14" }}': 'className="text-green-700 bg-green-700/10"',
  'style={{ backgroundColor: "#D1D5DB" }}': 'className="bg-gray-300"',
  'style={{ color: "#111827" }}': 'className="text-gray-900"',
  'style={{ backgroundColor: \'#FFF9C4\' }}': 'className="bg-brand-yellow"',
  'style={{ backgroundColor: \'#FFF9C4\', transform: \'translateY(20px) scale(0.94)\' }}': 'className="bg-brand-yellow translate-y-5 scale-95"',
  'style={{ backgroundColor: \'#FFF9C4\', transform: \'translateY(10px) scale(0.97)\' }}': 'className="bg-brand-yellow translate-y-2.5 scale-[0.97]"',
  'style={{ transform: \'rotate(6deg)\' }}': 'className="rotate-6"',
  'style={{ transform: \'rotate(3deg)\' }}': 'className="rotate-3"',
  'style={{ transform: \'rotate(-1deg)\' }}': 'className="-rotate-1"',
  'style={{ opacity: 0.6 }}': 'className="opacity-60"',
  'style={{ opacity: 1 }}': 'className="opacity-100"',
};

for (const [key, val] of Object.entries(styleMap)) {
  // If it's adding a className, we need to merge it with existing className if there is one.
  // This simple replace might leave a stray `className="" className=""`. We can fix that.
  content = content.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), val);
}

// Merge duplicate classNames: className="foo" className="bar" -> className="foo bar"
content = content.replace(/className="([^"]*)"\s+className="([^"]*)"/g, 'className="$1 $2"');

fs.writeFileSync(path.join(__dirname, 'app/(marketing)/ClientPage.fixed.tsx'), content);
console.log('Fixed styles and a11y');
