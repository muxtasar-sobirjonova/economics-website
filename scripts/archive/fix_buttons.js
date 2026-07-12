const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '.');
const foldersToCheck = ['app', 'components', 'lib'];

function walkAndReplace(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);
        if (stat.isDirectory()) {
            walkAndReplace(filepath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')) {
            let content = fs.readFileSync(filepath, 'utf8');
            let newContent = content;

            // Replace colors
            newContent = newContent.replace(/#7B6FE7/g, '#5C4DE3');
            newContent = newContent.replace(/#7b6fe7/g, '#5c4de3');

            // Replace font weight
            newContent = newContent.replace(/className="[^"]+"/g, (match) => {
                if (match.includes('bg-[#5C4DE3]') || match.includes('text-[#5C4DE3]')) {
                    match = match.replace(/font-\[500\]/g, 'font-bold');
                    match = match.replace(/font-\[600\]/g, 'font-bold');
                }
                return match;
            });

            if (content !== newContent) {
                fs.writeFileSync(filepath, newContent, 'utf8');
                console.log('Updated', filepath);
            }
        }
    }
}

for (const folder of foldersToCheck) {
    walkAndReplace(path.join(directory, folder));
}
