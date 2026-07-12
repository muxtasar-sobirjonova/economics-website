import re
import sys

def compact_agenda():
    with open('components/TodayAgendaCard.tsx', 'r') as f:
        content = f.read()

    # Padding 40px -> 24px
    content = content.replace('padding: "40px"', 'padding: "24px"')
    
    # Tighten vertical gaps
    content = content.replace('className="mb-6 flex flex-col gap-2 mt-2"', 'className="mb-4 flex flex-col gap-2 mt-2"')
    
    # Skeleton padding/heights
    content = content.replace('py-3 border', 'py-2 border')
    content = content.replace('className="h-7 w-40 bg-gray-100 rounded-lg animate-pulse mb-6"', 'className="h-7 w-40 bg-gray-100 rounded-lg animate-pulse mb-4"')
    content = content.replace('min-w-[44px] min-h-[44px]', 'w-7 h-7') # for skeleton circle

    # Replace the whole item rendering block to make it dense horizontal
    old_block_start = '            return (\n              <div\n                key={item.id}'
    old_block_end = '              </div>\n            );\n          })\n        ) : ('
    
    if old_block_start in content and old_block_end in content:
        start_idx = content.find(old_block_start)
        end_idx = content.find(old_block_end) + len('              </div>\n            );')
        
        new_block = """            return (
              <div
                key={item.id}
                className="flex items-center py-2 pr-3 pl-3 border-[1.5px] border-[#F3F4F6] rounded-[16px] group bg-white transition-all hover:shadow-sm hover:border-gray-200"
                style={{ opacity: item.isCompleted ? 0.6 : 1 }}
              >
                {/* Left accent */}
                <div
                  className="w-[4px] h-[24px] rounded-full mr-3 shrink-0 transition-colors group-hover:shadow-[0_0_8px_rgba(123,111,231,0.5)]"
                  style={{ backgroundColor: accentColor }}
                />

                <div className="flex-1 flex items-center flex-wrap gap-2">
                  {/* Badge */}
                  <div 
                    className="text-[10px] font-[800] px-2 py-0.5 rounded-[6px] tracking-wider uppercase"
                    style={{ backgroundColor: badgeBg, color: badgeText }}
                  >
                    {badgeLabel}
                  </div>

                  {/* Title */}
                  <div className="text-[14px] font-[600] leading-tight text-[#111111] line-clamp-1 max-w-[200px]">
                    {item.title}
                  </div>
                  
                  {/* Time Pill */}
                  <div className="bg-[#F8F9FA] text-[#7B6FE7] font-[500] text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ml-auto">
                    {timeText}
                  </div>
                </div>

                {/* Completion circle */}
                <button
                  disabled={isThisCompleting}
                  onClick={() => handleToggleComplete(item)}
                  aria-label={item.isCompleted ? "Mark incomplete" : "Mark complete"}
                  className={`w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ml-3 ${
                    isThisCompleting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  } ${
                    item.isCompleted
                      ? "bg-[#5C4DE3] border-[#5C4DE3] border-[1.5px] shadow-[0_0_0_3px_rgba(92,77,227,0.15)]"
                      : index === firstIncompleteIndex
                        ? "border-[#5C4DE3] border-[2px] shadow-[0_0_8px_rgba(92,77,227,0.2)] bg-[#F3F0FF]"
                        : "border-[#E5E7EB] border-[1.5px] hover:border-[#5C4DE3] hover:bg-[#F3F0FF]"
                  }`}
                >
                  {item.isCompleted && <IconCheck size={16} color="white" stroke={3} />}
                  {!item.isCompleted && index === firstIncompleteIndex && (
                     <div className="w-2.5 h-2.5 bg-[#5C4DE3] rounded-full animate-pulse" />
                  )}
                </button>
              </div>
            );"""
        
        content = content[:start_idx] + new_block + content[end_idx:]

    # Remove 🎉 from All caught up in Agenda card and make it compact
    content = content.replace('<div className="text-[52px] mb-4">🎉</div>', '')
    content = content.replace('py-12 text-center flex-1 min-h-[220px]', 'py-4 text-center flex-1')

    with open('components/TodayAgendaCard.tsx', 'w') as f:
        f.write(content)

def compact_mistakes():
    with open('components/ReviewMistakesCard.tsx', 'r') as f:
        content = f.read()

    # Padding 40px -> 24px
    content = content.replace('padding: "40px"', 'padding: "24px"')

    # All caught up state -> compact banner
    old_caught_up = """  if (count === 0) {
    return (
      <div
        id="review-mistakes"
        className="bg-white flex flex-col"
        style={{
          borderRadius: "24px",
          padding: "40px",
          flex: "1",
          border: "none",
          boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex flex-col items-center text-center justify-center flex-1 h-full py-8">
          <div className="flex items-center justify-center text-[52px] mb-5">🎉</div>
          <h3 className="text-[#1A1A3E] font-[800] text-[22px] tracking-tight mb-2">
            {justReviewedAll ? "All done!" : "No Mistakes to Review"}
          </h3>
          <p className="text-[#6B7280] text-[15px] leading-relaxed max-w-[250px]">
            {justReviewedAll
              ? "Great work reviewing all your mistakes. Keep it up!"
              : "You have zero unreviewed mistakes."}
          </p>
        </div>
      </div>
    );
  }"""
    
    new_caught_up = """  if (count === 0) {
    return (
      <div
        id="review-mistakes"
        className="bg-[#F8F9FA] flex items-center justify-center border-[1.5px] border-[#E5E7EB]"
        style={{
          borderRadius: "16px",
          padding: "16px",
          flex: "1",
        }}
      >
        <div className="flex flex-col items-center text-center">
          <h3 className="text-[#1A1A3E] font-[700] text-[16px] tracking-tight">
            {justReviewedAll ? "All done! 🎉" : "No Mistakes to Review"}
          </h3>
          <p className="text-[#6B7280] text-[13px] leading-relaxed">
            {justReviewedAll
              ? "Great work reviewing all your mistakes."
              : "You're all caught up for today."}
          </p>
        </div>
      </div>
    );
  }"""
    
    content = content.replace(old_caught_up, new_caught_up)

    with open('components/ReviewMistakesCard.tsx', 'w') as f:
        f.write(content)

def compact_page():
    with open('app/page.tsx', 'r') as f:
        content = f.read()
    
    # Change padding from `padding: "24px 48px 48px 48px"` to `padding: "16px 48px 16px 48px"`
    content = content.replace('padding: "24px 48px 48px 48px"', 'padding: "16px 48px 16px 48px"')
    
    with open('app/page.tsx', 'w') as f:
        f.write(content)

if __name__ == '__main__':
    compact_agenda()
    compact_mistakes()
    compact_page()
    print("Done")
