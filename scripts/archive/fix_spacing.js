const fs = require('fs');
const path = 'C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/quizzes/read/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `<button onClick={() => router.push('/lessons/' + activeLesson.lessonId + '/quizzes')} style={{ color: '#3D52A0', fontSize: '13px', fontWeight: 600, background: 'none', border: 'none', marginBottom: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, width: 'fit-content' }}>
              ← Back to Quizzes
            </button>
            <div className="relative pt-[20px] pb-[40px] flex flex-col">
              <div className="flex justify-start items-start mb-8 w-full">
                <div className="inline-block border border-[#dc2626] bg-transparent text-[#dc2626] text-[11px] font-[800] tracking-[0.08em] uppercase px-[14px] py-[6px] rounded-[50px]">
                  LESSON {activeLesson.lessonId}
                </div>
              </div>
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
                        background: isAnswered ? '#3D52A0' : '#EBEBEB',
                        boxShadow: 'none'
                      }} />
                    );
                  })}
                </div>
              </div>
              <div className="relative z-10">
                <h2 className="text-[#111827] text-[42px] font-[800] mb-4 leading-tight">
                  {activeLesson.title}
                </h2>
              </div>
              
              <div className="relative z-10 mt-4">`;

const replacementStr = `<div className="relative flex flex-col pb-[40px]">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <button onClick={() => router.push('/lessons/' + activeLesson.lessonId + '/quizzes')} style={{ color: '#3D52A0', fontSize: '13px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                  ← Back to Quizzes
                </button>
                <div className="inline-block border border-[#dc2626] bg-transparent text-[#dc2626] text-[11px] font-[800] tracking-[0.08em] uppercase px-[14px] py-[6px] rounded-[50px]">
                  LESSON {activeLesson.lessonId}
                </div>
              </div>

              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '13px', color: '#555555', marginBottom: '8px' }}>
                  Question {Math.min(answeredCount + 1, activeLesson.questions?.length || 10)} of {activeLesson.questions?.length || 10}
                </div>
                <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                  {Array.from({ length: activeLesson.questions?.length || 10 }).map((_, i) => {
                    const isAnswered = i < answeredCount;
                    return (
                      <div key={i} style={{ 
                        flex: 1, 
                        height: '4px', 
                        borderRadius: '2px', 
                        background: isAnswered ? '#3D52A0' : '#EBEBEB'
                      }} />
                    );
                  })}
                </div>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111111', marginTop: '8px', marginBottom: '12px' }}>
                {activeLesson.title}
              </h2>

              <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', color: '#111111', textTransform: 'uppercase', marginTop: '8px', marginBottom: '12px' }}>
                COMPREHENSION CHECK
              </div>
              
              <div className="relative z-10">`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(path, content, 'utf8');
console.log('Fixed spacing');
