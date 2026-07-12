const fs = require('fs');

let content = fs.readFileSync('components/TodayAgendaCard.tsx', 'utf8');

// 1. Skeleton Loading Fix
// Update useEffect to handle null userId and not hang forever.
const useEffectOld = `  useEffect(() => {
    if (userId) {
      fetchAgenda();
    }
  }, [userId, fetchAgenda]);`;
const useEffectNew = `  useEffect(() => {
    if (userId) {
      fetchAgenda();
    } else {
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [userId, fetchAgenda]);`;
content = content.replace(useEffectOld, useEffectNew);

// 2. Progress Bar Calculation
const progressOld = `  const items = agenda?.items || [];
  const completedCount = agenda?.completedCount ?? 0;
  const totalCount = agenda?.totalCount ?? 0;
  const totalAgendaMinutes = items.reduce((acc, item) => acc + (item.timeEstimate || 0), 0);
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;`;
const progressNew = `  const items = agenda?.items || [];
  const completedCount = items.filter(item => item.isCompleted).length;
  const totalCount = items.length;
  const totalAgendaMinutes = items.reduce((acc, item) => acc + (item.timeEstimate || 0), 0);
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const firstIncompleteIndex = items.findIndex((item) => !item.isCompleted);`;
content = content.replace(progressOld, progressNew);

// 3 & 4. Agenda Item States and Badge Styling
// Find the mapping logic
const mappingOldRegex = /if \(tag\.includes\("CONCEPT"\)[\s\S]*?const description = [^;]+;/;
// Let's replace the whole item mapping logic inside the map function.
const oldItemMapStart = '            let theme;';
const oldItemMapEnd = '              <div\n                key={item.id}';
// Instead of complex regex, let's just do targeted string replaces.

// Badges
content = content.replace(
    'className="text-[12px] font-[800] px-4 py-1.5 rounded-lg tracking-wide"',
    'className="text-[11px] font-[800] px-2.5 py-1 rounded-[6px] tracking-wider uppercase"'
);
content = content.replace(
    'className={`text-[11px] font-[700] px-2.5 py-1 rounded-md ${diffClass}`}',
    'className={`text-[11px] font-[800] px-2.5 py-1 rounded-[6px] tracking-wider uppercase ${diffClass}`}'
);

// Circles
const oldCircle = `<button
                  disabled={isThisCompleting}
                  onClick={() => handleToggleComplete(item)}
                  aria-label={item.isCompleted ? "Mark incomplete" : "Mark complete"}
                  className={\`min-w-[44px] min-h-[44px] mt-2 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ml-4 \${
                    isThisCompleting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  } \${
                    item.isCompleted
                      ? "bg-[#7B6FE7] border-[#7B6FE7] border-2 shadow-[0_0_0_4px_rgba(123,111,231,0.15)]"
                      : "border-[#E5E7EB] border-[2px] hover:border-[#7B6FE7] hover:bg-[#F3F0FF]"
                  }\`}
                >
                  {item.isCompleted && <IconCheck size={20} color="white" stroke={3} />}
                </button>`;

const newCircle = `<button
                  disabled={isThisCompleting}
                  onClick={() => handleToggleComplete(item)}
                  aria-label={item.isCompleted ? "Mark incomplete" : "Mark complete"}
                  className={\`min-w-[44px] min-h-[44px] mt-2 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ml-4 \${
                    isThisCompleting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  } \${
                    item.isCompleted
                      ? "bg-[#5C4DE3] border-[#5C4DE3] border-2 shadow-[0_0_0_4px_rgba(92,77,227,0.15)]"
                      : index === firstIncompleteIndex
                        ? "border-[#5C4DE3] border-[2.5px] shadow-[0_0_10px_rgba(92,77,227,0.2)] bg-[#F3F0FF]"
                        : "border-[#E5E7EB] border-[2px] hover:border-[#5C4DE3] hover:bg-[#F3F0FF]"
                  }\`}
                >
                  {item.isCompleted && <IconCheck size={20} color="white" stroke={3} />}
                  {!item.isCompleted && index === firstIncompleteIndex && (
                     <div className="w-3 h-3 bg-[#5C4DE3] rounded-full animate-pulse" />
                  )}
                </button>`;
content = content.replace(oldCircle, newCircle);

fs.writeFileSync('components/TodayAgendaCard.tsx', content, 'utf8');
console.log('Done TodayAgendaCard.tsx');
