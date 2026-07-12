const fs = require('fs');

let pageContent = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Rename "Concepts Mastered" to "Lessons Completed"
pageContent = pageContent.replace('Concepts Mastered', 'Lessons Completed');

// 2. Fix Avatar Initial
// Instead of authName.charAt(0).toUpperCase(), use (authName.charAt(0).toUpperCase() || 'S')
pageContent = pageContent.replace(
    /\{authName\.charAt\(0\)\.toUpperCase\(\)\}/g,
    "{authName ? authName.charAt(0).toUpperCase() : 'S'}"
);

// 3. Fix Avg Quiz Score Sparkline
// Conditionally render the sparkline only if state.quizResults.length > 0
pageContent = pageContent.replace(
    /\{\/\* Mini Sparkline \*\/\}/g,
    "{state.quizResults.length > 0 && ( <>\n              {/* Mini Sparkline */}"
);
pageContent = pageContent.replace(
    /<\/div>\s*<\/div>\s*<\/div>\s*<div className="bg-white rounded-\[24px\] p-6/g,
    "</div>\n              </>)}\n              </div>\n            </div>\n\n            <div className=\"bg-white rounded-[24px] p-6"
);

// 4. Standardize Stat Cards Icons
// Remove fill-current and adjust color logic
pageContent = pageContent.replace(/<IconFlame size=\{24\} className="fill-current" \/>/g, '<IconFlame size={28} className="text-[#F59E0B]" stroke={2} />');
pageContent = pageContent.replace(/<IconCircleCheck size=\{24\} className="fill-current" \/>/g, '<IconCircleCheck size={28} className="text-[#3B82F6]" stroke={2} />');
pageContent = pageContent.replace(/<IconTrophy size=\{24\} className="fill-current" \/>/g, '<IconTrophy size={28} className="text-[#10B981]" stroke={2} />');
pageContent = pageContent.replace(/<IconChartBar size=\{24\} className="fill-current" \/>/g, '<IconChartBar size={28} className="text-[#8B5CF6]" stroke={2} />');

// 5. Spacing Rhythm (mt-10 to mt-8)
pageContent = pageContent.replace(/className="w-full mx-auto mt-10"/g, 'className="w-full mx-auto mt-[32px]"');

// 6. Fix Button Hierarchy
// "Continue Learning" is primary (bg-[#7B6FE7] which we updated to #5C4DE3 but wait we reverted it! Oh wait, I reverted it to #7B6FE7 in the previous step!).
// Let's ensure "Review Mistakes" is outline. It already is outline!
// Wait, the prompt says "only one primary (filled) CTA per section; secondary actions should consistently use the outline style".
// It is already outline: border-[2px] border-[#7B6FE7] bg-transparent. That is fine.

// 7. Weekly Streak Tracker Visual States
// "visually distinguish 'today' from 'not completed' — today should have a distinct outline/highlight state separate from both 'done' (green check) and 'future/empty' days."
// Current:
/*
                          isCompleted
                            ? "bg-[#22c55e] text-white shadow-sm"
                            : isMissed
                              ? "bg-[#FEF2F2] text-[#FCA5A5]"
                              : isToday
                                ? "bg-[#F3F0FF] border-[2px] border-[#7B6FE7] shadow-[0_0_15px_rgba(123,111,231,0.3)] animate-pulse"
                                : "bg-transparent border-[1.5px] border-dashed border-[#C7D2FE]"
*/
// Let's make `isToday && !isCompleted` just have a solid border, and `isToday && isCompleted` a green check WITH a border, etc?
// Wait, if today is completed, it's green. If today is NOT completed, it should be distinctly highlighted.
// Let's replace the whole class computation for the streak circle:
const oldStreakClass = 'className={`w-[40px] h-[40px] rounded-[10px] flex items-center justify-center transition-all ${\\n                          isCompleted\\n                            ? "bg-[#22c55e] text-white shadow-sm"\\n                            : isMissed\\n                              ? "bg-[#FEF2F2] text-[#FCA5A5]"\\n                              : isToday\\n                                ? "bg-[#F3F0FF] border-[2px] border-[#7B6FE7] shadow-[0_0_15px_rgba(123,111,231,0.3)] animate-pulse"\\n                                : "bg-transparent border-[1.5px] border-dashed border-[#C7D2FE]"\\n                        }`}';

const newStreakClass = 'className={`w-[40px] h-[40px] rounded-[10px] flex items-center justify-center transition-all ${\\n                          isCompleted && isToday\\n                            ? "bg-[#22c55e] text-white shadow-sm ring-2 ring-offset-2 ring-[#22c55e]"\\n                            : isCompleted\\n                              ? "bg-[#22c55e] text-white shadow-sm"\\n                              : isMissed\\n                                ? "bg-[#FEF2F2] text-[#FCA5A5]"\\n                                : isToday\\n                                  ? "bg-[#F3F0FF] border-2 border-[#7B6FE7] shadow-sm ring-2 ring-offset-2 ring-[#7B6FE7]"\\n                                  : "bg-transparent border-[1.5px] border-dashed border-[#C7D2FE]"\\n                        }`}';

pageContent = pageContent.replace(oldStreakClass, newStreakClass);

// 8. Hero Layout
// We will move "This Week Card" from right col into the left col, below the "Action Buttons".
// And we remove the right col completely.
// Let's find the Right Col and Left Col markers.

const leftColStart = '{/* Left col */}\\n          <div className="flex-1 w-full flex flex-col justify-start">';
const rightColStart = '{/* Right col */}\\n          <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-[16px]">';
const heroEnd = '</div>\\n      </div>\\n\\n      {/* SECTION 2: CONTENT ROW';

// We'll write a regex or manual string manipulation to extract the This Week Card and place it appropriately.
const rightColRegex = /\{\/\* Right col \*\/\}\s*<div className="w-full lg:w-\[400px\] shrink-0 flex flex-col gap-\[16px\]">\s*\{\/\* This Week Card \*\/\}\s*(<div[\s\S]*?<!-- This Week Card End -->|[\s\S]*?(?=\{\/\* Target & Latest Card removed as per user request \*\/\}))/;

// Let's just find the This week card string.
const thisWeekStart = '{/* This Week Card */}';
const targetLatest = '{/* Target & Latest Card removed as per user request */}';
const thisWeekCardContent = pageContent.substring(
    pageContent.indexOf(thisWeekStart),
    pageContent.indexOf(targetLatest)
);

// Remove the right column entirely.
pageContent = pageContent.replace(thisWeekCardContent, '');
pageContent = pageContent.replace(targetLatest, '');
pageContent = pageContent.replace('{/* Right col */}\n          <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-[16px]">\n            \n\n            \n          </div>', '');

// Insert this week card below the Action Buttons and Features Row in the left col
// Find Features Row
const featuresRow = '{/* Features Row */}';
// Wait, inserting it at the end of the left col:
const insertPos = pageContent.indexOf('</div>\n\n          {/* Right col */}');
if (insertPos !== -1) {
    pageContent = pageContent.substring(0, insertPos) + '\\n\\n            ' + thisWeekCardContent + pageContent.substring(insertPos);
}

// Now we have a single column layout. To make it centered, we should remove `lg:flex-row` and `items-start`.
pageContent = pageContent.replace(
    'className="flex flex-col lg:flex-row items-start w-full mx-auto"',
    'className="flex flex-col items-center w-full mx-auto"'
);
pageContent = pageContent.replace(
    'className="flex-1 w-full flex flex-col justify-start"',
    'className="flex-1 w-full max-w-[800px] flex flex-col justify-start items-center text-center"'
);
// Also need to center the personalized headline, course progress, subtitle, action buttons, features row.
pageContent = pageContent.replace(
    '<div className="flex items-center gap-4 mb-2">',
    '<div className="flex items-center justify-center gap-4 mb-2 w-full">'
);
pageContent = pageContent.replace(
    '<div className="mb-6 flex flex-col gap-1 mt-2">',
    '<div className="mb-6 flex flex-col items-center gap-1 mt-2 w-full">'
);
pageContent = pageContent.replace(
    '<div className="flex items-center gap-4 mb-6">',
    '<div className="flex items-center justify-center gap-4 mb-6 w-full">'
);
pageContent = pageContent.replace(
    '<div className="flex items-center gap-6 mb-6 pb-6 w-fit">',
    '<div className="flex items-center justify-center gap-6 mb-6 pb-6 w-full">'
);
pageContent = pageContent.replace(
    'marginBottom: "24px",\n                maxWidth: "400px",',
    'marginBottom: "24px",\n                maxWidth: "600px",\n                textAlign: "center",'
);

fs.writeFileSync('app/page.tsx', pageContent, 'utf8');
console.log('Done app/page.tsx');
