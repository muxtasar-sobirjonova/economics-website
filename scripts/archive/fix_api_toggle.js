const fs = require('fs');

// 1. Fix TodayAgendaCard to use only the correct /api/agenda/complete endpoint
let cardCode = fs.readFileSync('components/TodayAgendaCard.tsx', 'utf8');

cardCode = cardCode.replace(
  /const endpoint = item\.itemType === "LESSON"[\s\S]*?body: JSON\.stringify\(\{ userId, agendaItemId: item\.id \}\),\s*\}\);/g,
  `
      await fetch("/api/agenda/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.itemId, itemType: item.itemType }),
      });
`
);

fs.writeFileSync('components/TodayAgendaCard.tsx', cardCode, 'utf8');

// 2. Fix the backend completion checker to expect 3 items (concept, article, quiz)
let apiCode = fs.readFileSync('app/api/agenda/complete/route.ts', 'utf8');

apiCode = apiCode.replace(
  /if \(lesson && quiz\) \{[\s\S]*?\} else if \(quiz\) \{[\s\S]*?\}/,
  `if (lesson && quiz) {
      if (completedItemIds.includes(\`\${lesson.id}-concept\`) && completedItemIds.includes(\`\${lesson.id}-article\`) && completedItemIds.includes(quiz.id)) {
        isDayComplete = true;
      }
    } else if (lesson) {
      if (completedItemIds.includes(\`\${lesson.id}-concept\`) && completedItemIds.includes(\`\${lesson.id}-article\`)) isDayComplete = true;
    } else if (quiz) {
      if (completedItemIds.includes(quiz.id)) isDayComplete = true;
    }`
);

fs.writeFileSync('app/api/agenda/complete/route.ts', apiCode, 'utf8');

console.log('Fixed completion toggling');
