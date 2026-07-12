const fs = require('fs');
const pagePath = 'C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/quizzes/read/page.tsx';
const sectionPath = 'C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/components/QuizSection.tsx';

let pageContent = fs.readFileSync(pagePath, 'utf8');
let sectionContent = fs.readFileSync(sectionPath, 'utf8');

// --- 1. QUIZZES page label ---
pageContent = pageContent.replace(
  /<div className="text-xl font-black tracking-tight text-\[\#111827\]">\s*QUIZZES\s*<\/div>/,
  `<div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', color: '#111111', textTransform: 'uppercase' }}>
          QUIZZES
        </div>`
);

// --- 2. Page Background ---
pageContent = pageContent.replace(
  /<div className="flex-1 overflow-y-auto p-\[32px\]">/,
  `<div className="flex-1 overflow-y-auto p-[32px] bg-[#F8F9FC]">`
);

// --- 3. Back Button ---
pageContent = pageContent.replace(
  /<div className="w-full max-w-\[850px\] mx-auto flex flex-col gap-6">/,
  `<div className="w-full max-w-[850px] mx-auto flex flex-col gap-6">
            <button onClick={() => router.push('/lessons/' + activeLesson.lessonId + '/quizzes')} style={{ color: '#3D52A0', fontSize: '13px', fontWeight: 600, background: 'none', border: 'none', marginBottom: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, width: 'fit-content' }}>
              ← Back to Quizzes
            </button>`
);

// --- 4. Lift Answered Count State & Progress Bar ---
if (!pageContent.includes('const [answeredCount')) {
  pageContent = pageContent.replace(
    /const \[loading, setLoading\] = useState\(true\);/,
    `const [loading, setLoading] = useState(true);\n  const [answeredCount, setAnsweredCount] = useState(0);`
  );
}

// Add progress bar right below the LESSON pill
const progressBarHTML = `
              <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                <div style={{ fontSize: '13px', color: '#555555', marginBottom: '8px' }}>
                  Question {Math.min(answeredCount + 1, activeLesson.questions?.length || 10)} of {activeLesson.questions?.length || 10}
                </div>
                <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                  {Array.from({ length: activeLesson.questions?.length || 10 }).map((_, i) => {
                    const isAnswered = i < answeredCount;
                    const isCurrent = i === answeredCount;
                    return (
                      <div key={i} style={{ 
                        flex: 1, 
                        height: '4px', 
                        borderRadius: '2px', 
                        background: isAnswered ? '#3D52A0' : (isCurrent ? '#3D52A0' : '#EBEBEB'),
                        boxShadow: isCurrent ? '0 0 4px rgba(61,82,160,0.5)' : 'none'
                      }} />
                    );
                  })}
                </div>
              </div>`;

pageContent = pageContent.replace(
  /LESSON \{activeLesson\.lessonId\}\s*<\/div>\s*<\/div>/,
  `LESSON {activeLesson.lessonId}
                </div>
              </div>` + progressBarHTML
);

// Pass onAnsweredChange to QuizSection
pageContent = pageContent.replace(
  /<QuizSection\s*quizId=\{activeLesson\.lessonId\}\s*questions=\{activeLesson\.questions\}\s*\/>/,
  `<QuizSection
                  quizId={activeLesson.lessonId}
                  questions={activeLesson.questions}
                  onAnsweredChange={(count) => setAnsweredCount(count)}
                />`
);

// Update mt-8 on QuizSection wrapper to mt-4 (16px spacing)
pageContent = pageContent.replace(
  /<div className="relative z-10 mt-8">\s*<QuizSection/,
  `<div className="relative z-10 mt-4">\n                <QuizSection`
);

// --- 5. "Next" button in page.tsx ---
pageContent = pageContent.replace(
  /className="bg-\[\#4F46E5\] hover:bg-\[\#4F46E5\] text-\[\#ffffff\] px-\[28px\] py-\[13px\] rounded-\[50px\] font-bold text-\[14px\] transition-all shadow-\[0_4px_12px_rgba\(34,197,94,0\.3\)\] active:scale-95 active:opacity-90"/,
  `style={{ background: '#3D52A0', color: '#ffffff', borderRadius: '8px', padding: '12px 28px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}`
);

fs.writeFileSync(pagePath, pageContent, 'utf8');

// ============================================
// QUIZ SECTION FIXES
// ============================================

// Add onAnsweredChange prop
sectionContent = sectionContent.replace(
  /quizId: number;\s*questions: Question\[\];\s*\}\) \{/,
  `quizId: number;\n  questions: Question[];\n  onAnsweredChange?: (count: number) => void;\n}) {`
);
sectionContent = sectionContent.replace(
  /quizId,\s*questions,\s*\}:/,
  `quizId,\n  questions,\n  onAnsweredChange,\n}:`
);

if (!sectionContent.includes('useEffect(() => { if (onAnsweredChange)')) {
  sectionContent = sectionContent.replace(
    /const handleSelect = \(questionId: string, answer: string\) => \{/,
    `useEffect(() => {\n    if (onAnsweredChange) onAnsweredChange(Object.keys(answers).length);\n  }, [answers, onAnsweredChange]);\n\n  const handleSelect = (questionId: string, answer: string) => {`
  );
}

// "Comprehension Check" Heading
sectionContent = sectionContent.replace(
  /<h2 className="text-2xl font-bold text-\[\#0096a5\] mb-6 tracking-tight">/,
  `<h2 style={{ color: '#1A1A2E', fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>`
);

// Question numbers and text
sectionContent = sectionContent.replace(
  /<p className="font-semibold text-\[\#0096a5\] mb-4">/g,
  `<p style={{ color: '#1A1A2E', fontWeight: 600, marginBottom: '16px' }}>`
);

// Answer Options
const newOptionRender = `
                let optionStyle = {
                  background: '#ffffff',
                  border: '1px solid #EBEBEB',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  width: '100%',
                  textAlign: 'left' as const
                };

                if (submitted) {
                  if (isSelected && isCorrect) {
                    optionStyle.border = "2px solid #22c55e";
                    optionStyle.background = "#f0fdf4";
                  } else if (isSelected && !isCorrect) {
                    optionStyle.border = "2px solid #ef4444";
                    optionStyle.background = "#fef2f2";
                  } else if (!isSelected && isCorrect) {
                    optionStyle.border = "2px solid #22c55e";
                    optionStyle.background = "#f0fdf4";
                  } else {
                    optionStyle.opacity = 0.5 as any;
                  }
                } else if (isSelected) {
                  optionStyle.background = '#EEF3FF';
                  optionStyle.border = '2px solid #3D52A0';
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(q._key, opt)}
                    disabled={submitted}
                    style={optionStyle}
                    onMouseEnter={(e) => {
                      if (!submitted && !isSelected) {
                        e.currentTarget.style.background = '#F0F4FF';
                        e.currentTarget.style.border = '1px solid #C7D7FF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!submitted && !isSelected) {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.border = '1px solid #EBEBEB';
                      }
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: isSelected ? '2px solid #3D52A0' : '2px solid #D1D5DB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: isSelected ? '#3D52A0' : 'transparent'
                    }}>
                      {isSelected && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff' }} />
                      )}
                    </div>
                    <span style={{ color: isSelected ? '#1A1A2E' : '#374151', fontSize: '14px', fontWeight: isSelected ? 600 : 400 }}>{opt}</span>
                  </button>
                );`;

sectionContent = sectionContent.replace(
  /let optionStyle = "border-gray-200 hover:border-indigo-300";[\s\S]*?return \([\s\S]*?<\/button>\s*\);/,
  newOptionRender
);

// Submit Answers button
sectionContent = sectionContent.replace(
  /className="mt-6 bg-\[\#4F46E5\] hover:bg-tide-mint text-\[\#ffffff\] w-full rounded-lg py-3 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 active:opacity-90"/,
  `style={{ background: '#3D52A0', color: '#ffffff', opacity: Object.keys(answers).length === 0 ? 0.5 : 1, fontWeight: 700, fontSize: '15px', borderRadius: '8px', padding: '14px 32px', width: '100%', border: 'none', cursor: Object.keys(answers).length === 0 ? 'not-allowed' : 'pointer' }}`
);

// Update margins for question cards (the parent div of questions)
// Wait, the question wrapper has className="bg-white rounded-xl border border-gray-200 p-6 mb-4". The user didn't explicitly ask to change this, only the background of the page. Let's keep the card as is.

fs.writeFileSync(sectionPath, sectionContent, 'utf8');

console.log('Quiz UI fixes applied successfully.');
