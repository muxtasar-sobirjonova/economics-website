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

            // Replace font weight first while we still have #5C4DE3
            newContent = newContent.replace(/className="[^"]+"/g, (match) => {
                if (match.includes('bg-[#5C4DE3]') || match.includes('text-[#5C4DE3]') || match.includes('bg-[#5c4de3]') || match.includes('text-[#5c4de3]')) {
                    match = match.replace(/font-bold/g, 'font-[500]');
                }
                return match;
            });

            // Replace colors back
            newContent = newContent.replace(/#5C4DE3/g, '#7B6FE7');
            newContent = newContent.replace(/#5c4de3/g, '#7b6fe7');

            if (content !== newContent) {
                fs.writeFileSync(filepath, newContent, 'utf8');
                console.log('Restored', filepath);
            }
        }
    }
}

for (const folder of foldersToCheck) {
    walkAndReplace(path.join(directory, folder));
}
