const fs = require('fs');

let code = fs.readFileSync('components/TodayAgendaCard.tsx', 'utf8');

// 1. Change header text for completed count
code = code.replace(
  /<div\s+className={`text-\[13px\] font-bold px-3 py-1 rounded-full transition-colors \${[^}]+}`}\s*>\s*\{completedCount\} of \{totalCount\} completed\s*<\/div>/g,
  `<div className="text-[13px] font-[600] text-[#6B7280]">
          {completedCount} of {totalCount} completed
        </div>`
);

// 2. Add horizontal line and change gap
code = code.replace(
  /<\/div>\s*\{\/\* ── Items ── \*\/\}\s*<div className="flex flex-col flex-1">/g,
  `</div>
      <div className="h-[3px] bg-[#EEF2FF] rounded-full w-full mb-6 mt-[-16px]" />

      {/* ── Items ── */}
      <div className="flex flex-col flex-1 gap-4">`
);

// 3. Update the inner item loop completely
const newInner = `
            const isLesson = item.itemType === "LESSON";
            
            let theme;
            let timeText;
            let qtyText;
            
            const tag = item.tag ? item.tag.toUpperCase() : "";
            const title = item.title.toUpperCase();
            
            // Assign based on text or index to ensure we get Concept, Article, Quiz
            if (index === 0 || tag.includes("CONCEPT") || title.includes("CONCEPT")) {
              theme = { bg: "#fef3c7", text: "#d97706", label: "CONCEPT" };
              timeText = "~10 min";
              qtyText = "1 Concept";
            } else if (index === 1 || tag.includes("ARTICLE") || title.includes("READ") || title.includes("ARTICLE")) {
              theme = { bg: "#dbeafe", text: "#2563eb", label: "ARTICLE" };
              timeText = "~20 min";
              qtyText = "1 Article";
            } else {
              theme = { bg: "#f3e8ff", text: "#9333ea", label: "QUIZ" };
              timeText = "~20 min";
              qtyText = "10 Questions";
            }

            const accentColor = theme.text;
            const badgeBg = theme.bg;
            const badgeText = theme.text;
            const badgeLabel = theme.label;
            const isThisCompleting = completing === item.itemId;

            return (
              <div
                key={item.id}
                className="flex items-center py-2 px-3 border-[1.5px] border-[#F3F4F6] rounded-full group"
              >
                {/* Left accent */}
                <div
                  className="w-[4px] h-[32px] rounded-full mr-4 shrink-0 transition-opacity"
                  style={{
                    backgroundColor: accentColor,
                    opacity: item.isCompleted ? 0.35 : 1,
                  }}
                />

                {/* Badge */}
                <div 
                  className={\`text-[11px] font-[800] px-3 py-1 rounded-[6px] mr-4 tracking-wider transition-opacity \${item.isCompleted ? "opacity-50" : ""}\`}
                  style={{ backgroundColor: badgeBg, color: badgeText }}
                >
                  {badgeLabel}
                </div>

                {/* Title */}
                <div
                  className={\`text-[15px] font-bold flex-1 mr-4 transition-all leading-tight text-[#1A1A3E] \${item.isCompleted ? "opacity-50" : ""}\`}
                >
                  {item.title}
                </div>

                {/* Pills */}
                <div className={\`flex items-center gap-2 mr-6 shrink-0 transition-opacity \${item.isCompleted ? "opacity-50" : ""}\`}>
                  <div className="bg-[#F3F0FF] text-[#7B6FE7] font-semibold text-[12px] px-[12px] py-[4px] rounded-full">
                    {qtyText}
                  </div>
                  <div className="bg-[#F3F0FF] text-[#7B6FE7] font-semibold text-[12px] px-[12px] py-[4px] rounded-full">
                    {timeText}
                  </div>
                </div>

                {/* Completion circle */}
                <button
                  disabled={isThisCompleting}
                  onClick={() => handleToggleComplete(item)}
                  aria-label={
                    item.isCompleted ? "Mark incomplete" : "Mark complete"
                  }
                  className={\`w-[28px] h-[28px] rounded-full flex items-center justify-center shrink-0 transition-all duration-200 \${
                    isThisCompleting
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  } \${
                    item.isCompleted
                      ? "bg-[#7B6FE7] border-[#7B6FE7] shadow-[0_0_0_3px_rgba(123,111,231,0.18)] border-2"
                      : "border-[#E5E7EB] border-[1.5px] hover:border-[#7B6FE7] hover:bg-[#F3F0FF]"
                  }\`}
                >
                  {item.isCompleted && <IconCheck size={16} color="white" stroke={3} />}
                </button>
              </div>
            );
`;

code = code.replace(/const isLesson = item\.itemType === "LESSON";[\s\S]*?<\/button>\s*<\/div>\s*\);\s*}/, newInner.trim() + '\n          }');

fs.writeFileSync('components/TodayAgendaCard.tsx', code, 'utf8');
console.log('Done reformatting agenda');
