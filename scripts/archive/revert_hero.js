const fs = require('fs');

let content = fs.readFileSync('app/page.tsx', 'utf8');

const old_hero = `      {/* SECTION 1: HERO DASHBOARD */}
      <div
        className="flex flex-col justify-center"
        style={{ padding: "16px 48px 16px 80px" }}
      >
        <div
          className="flex flex-col items-center w-full mx-auto"
          style={{ gap: "48px", maxWidth: "1200px" }}
        >
          {/* Left col */}
          <div className="flex-1 w-full max-w-[800px] flex flex-col justify-start items-center text-center">
            {/* Personalized Headline Section */}
            <div className="flex items-center justify-center gap-4 mb-2 w-full">
              <div className="w-12 h-12 rounded-full bg-[#7B6FE7] flex items-center justify-center text-white font-[500] text-xl border-[3px] border-white shadow-sm">
                {authName ? authName.charAt(0).toUpperCase() : 'S'}
              </div>
              <h1
                className="text-[#1A1A3E] tracking-tight"
                style={{
                  fontSize: "48px",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: "-1px",
                }}
              >
                {headingText}
              </h1>
            </div>

            {/* Course Progress */}
            <div className="mb-6 flex flex-col items-center gap-1 mt-2 w-full">
              <div className="flex items-center gap-2">
                <span className="text-[#6B7280] text-sm font-medium">You're <span className="font-[500] text-[#7B6FE7]">{courseProgressPercent}%</span> through the course</span>
              </div>
              <div className="w-full max-w-sm h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#7B6FE7] rounded-full transition-all duration-1000" style={{ width: \`\${courseProgressPercent}%\` }}></div>
              </div>
            </div>

            {/* Subtitle */}
            <p
              className="text-[#1A1A3E]"
              style={{
                fontSize: "18px",
                lineHeight: 1.5,
                marginBottom: "24px",
                maxWidth: "600px",
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              Your Personal Entrepreneurship Economics Teacher.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 mb-6 w-full">
              <Link href="/roadmap">
                <button
                  className="bg-[#7B6FE7] text-[#ffffff] font-[500] text-[14px] tracking-wide py-[12px] px-[28px] rounded-[14px] hover:opacity-90 hover:scale-[1.02] transition-all flex items-center gap-2 shadow-[0_4px_14px_rgba(123,111,231,0.25)]"
                >
                  Continue Learning
                </button>
              </Link>
              <a href="#review-mistakes">
                <button
                  className="bg-transparent text-[#7B6FE7] font-[500] text-[14px] tracking-wide py-[12px] px-[28px] rounded-[14px] hover:bg-[#F3F0FF] transition-all flex items-center gap-2 border-[2px] border-[#7B6FE7]"
                >
                  Review Mistakes
                </button>
              </a>
            </div>

            {/* Features Row */}
            <div className="flex items-center justify-center gap-6 mb-6 pb-6 w-full">
              <div className="flex items-center gap-2 text-[#1A1A3E] text-[13px] font-bold">
                <Lightbulb size={16} color="#EAB308" /> Concepts
              </div>
              <div className="flex items-center gap-2 text-[#1A1A3E] text-[13px] font-bold">
                <BookOpen size={16} color="#3B82F6" /> Articles
              </div>
              <div className="flex items-center gap-2 text-[#1A1A3E] text-[13px] font-bold">
                <Brain size={16} color="#8B5CF6" /> Quizzes
              </div>
            </div>
          \\n\\n            {/* This Week Card */}
            <div`;

const new_hero = `      {/* SECTION 1: HERO DASHBOARD */}
      <div
        className="flex flex-col justify-center"
        style={{ padding: "40px 48px 40px 48px" }}
      >
        <div
          className="flex flex-col lg:flex-row items-center justify-between w-full mx-auto"
          style={{ gap: "48px", maxWidth: "1200px" }}
        >
          {/* Left col */}
          <div className="flex-1 w-full max-w-[600px] flex flex-col justify-start items-start text-left">
            <h1
              className="text-[#1A1A3E] tracking-tight mb-4"
              style={{
                fontSize: "48px",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-1px",
              }}
            >
              Welcome back!
            </h1>

            <p
              className="text-[#1A1A3E]"
              style={{
                fontSize: "18px",
                lineHeight: 1.5,
                marginBottom: "32px",
                maxWidth: "400px",
                fontWeight: 500,
              }}
            >
              Your Personal Entrepreneurship Economics Teacher.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/roadmap">
                <button
                  className="bg-[#7B6FE7] text-[#ffffff] font-[500] text-[14px] tracking-wide py-[12px] px-[28px] rounded-[14px] hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(123,111,231,0.25)]"
                >
                  Continue Learning
                </button>
              </Link>
              <a href="#review-mistakes">
                <button
                  className="bg-[#7B6FE7] text-white font-[500] text-[14px] tracking-wide py-[12px] px-[28px] rounded-[14px] hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(123,111,231,0.25)]"
                >
                  Review Mistakes
                </button>
              </a>
            </div>

            {/* Features Row */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[#1A1A3E] text-[13px] font-bold">
                <Lightbulb size={16} color="#EAB308" /> Concepts
              </div>
              <div className="flex items-center gap-2 text-[#1A1A3E] text-[13px] font-bold">
                <BookOpen size={16} color="#3B82F6" /> Articles
              </div>
              <div className="flex items-center gap-2 text-[#1A1A3E] text-[13px] font-bold">
                <Brain size={16} color="#8B5CF6" /> Quizzes
              </div>
            </div>
          </div>

          {/* Right col: This Week Card */}
          <div className="w-full lg:w-[480px] shrink-0">
            <div`;

content = content.replace(old_hero, new_hero);
// Also fix closing divs for right col
content = content.replace('                </div>\n            </div>\n\n            </div>\n        </div>\n      </div>', '                </div>\n            </div>\n          </div>\n        </div>\n      </div>');

fs.writeFileSync('app/page.tsx', content, 'utf8');
