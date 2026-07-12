const fs = require('fs');

// 1. Fix the API to return 3 items (Concept, Article, Quiz) by splitting the lesson
let apiCode = fs.readFileSync('app/api/agenda/today/route.ts', 'utf8');

apiCode = apiCode.replace(
  /const items = \[\];[\s\S]*?if \(quiz\) \{/,
  `const items = [];
    if (lesson) {
      items.push({
        id: \`lesson-concept-\${lesson.id}\`,
        itemType: 'LESSON',
        itemId: \`\${lesson.id}-concept\`,
        title: lesson.title,
        tag: 'CONCEPT',
        timeEstimate: 10,
        isCompleted: completedItemIds.includes(\`\${lesson.id}-concept\`)
      });
      items.push({
        id: \`lesson-article-\${lesson.id}\`,
        itemType: 'LESSON',
        itemId: \`\${lesson.id}-article\`,
        title: \`Reading: \${lesson.title}\`,
        tag: 'ARTICLE',
        timeEstimate: 20,
        isCompleted: completedItemIds.includes(\`\${lesson.id}-article\`)
      });
    }
    if (quiz) {`
);

fs.writeFileSync('app/api/agenda/today/route.ts', apiCode, 'utf8');


// 2. Fix the styling in TodayAgendaCard.tsx to be compact (not fat)
let cardCode = fs.readFileSync('components/TodayAgendaCard.tsx', 'utf8');

// The main row container: change py-[10px] to py-2 (8px), pr-3 pl-[10px] to pr-2 pl-2, gap-3 to gap-2
cardCode = cardCode.replace(/py-\[10px\] pr-3 pl-\[10px\]/g, 'py-2 pr-2 pl-2');
cardCode = cardCode.replace(/className="flex flex-col gap-3 flex-1"/g, 'className="flex flex-col gap-2 flex-1"');

// The left accent line: change h-[34px] to h-[28px]
cardCode = cardCode.replace(/className="w-\[4px\] h-\[34px\] rounded-full mr-4 shrink-0"/g, 'className="w-[4px] h-[28px] rounded-full mr-3 shrink-0"');

// The badge: change py-[6px] to py-1 (4px), mr-4 to mr-3
cardCode = cardCode.replace(/className="text-\[11px\] font-\[800\] px-3 py-\[6px\] rounded-\[8px\] mr-4 tracking-wide"/g, 'className="text-[11px] font-[800] px-3 py-1 rounded-[6px] mr-3 tracking-wide"');

// Title: mr-4 to mr-3
cardCode = cardCode.replace(/className="text-\[15px\] font-\[700\] flex-1 mr-4 leading-tight text-\[#111111\]"/g, 'className="text-[15px] font-[700] flex-1 mr-3 leading-tight text-[#111111]"');

// Pills wrapper: mr-4 to mr-3
cardCode = cardCode.replace(/className="flex items-center gap-2 mr-4 shrink-0"/g, 'className="flex items-center gap-2 mr-3 shrink-0"');

// Pills: py-[6px] to py-1
cardCode = cardCode.replace(/px-\[14px\] py-\[6px\]/g, 'px-[12px] py-1');

// Circle button: change w-[34px] h-[34px] to w-[28px] h-[28px]
cardCode = cardCode.replace(/className={\`w-\[34px\] h-\[34px\]/g, 'className={`w-[28px] h-[28px]');
// Check icon inside circle: size={18} to size={16}, stroke={3.5} to stroke={3}
cardCode = cardCode.replace(/<IconCheck size=\{18\} color="white" stroke=\{3\.5\} \/>/g, '<IconCheck size={16} color="white" stroke={3} />');

// Remove hardcoded timeText overrides to use API times
cardCode = cardCode.replace(/const timeText = \`~\$\{item\.timeEstimate \|\| 10\} min\`;/g, 'const timeText = `~${item.timeEstimate} min`;');

fs.writeFileSync('components/TodayAgendaCard.tsx', cardCode, 'utf8');

console.log('Done fixing fatness and backend items');
