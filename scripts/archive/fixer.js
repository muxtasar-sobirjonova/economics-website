const fs = require('fs');

let content = fs.readFileSync('C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/articles/read/page.tsx', 'utf-8');

// 1. Clean up any literal "\n" strings that might be lurking.
content = content.replace(/\\n/g, '');

// 2. We need to replace everything starting from the first `{/* FIXED RIGHT PANEL */}` or `{/* RIGHT SIDEBAR (NOTES) */}` until the end of the `isLesson1` return wrapper.
// And do the same for the default return.
// Since the file might be messy, let's use a more robust regex to find the end of the `isLesson1` block.

const newPanel = `        {/* FIXED TABBED PANEL */}
        <div style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '300px',
          background: '#ffffff',
          borderLeft: '1px solid #EBEBEB',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.06)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '60px',
          transform: marginOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease'
        }}>
          {/* TOGGLE BUTTON */}
          <div 
            onClick={() => setMarginOpen(!marginOpen)}
            style={{
              position: 'absolute',
              left: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '60px',
              background: '#3D52A0',
              borderRadius: '8px 0 0 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '12px'
            }}
          >
            {marginOpen ? '▶' : '◀'}
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', width: '100%', borderBottom: '1px solid #EBEBEB' }}>
            <div 
              onClick={() => setActivePanel('takeaways')}
              style={{ flex: 1, textAlign: 'center', padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: activePanel === 'takeaways' ? '#3D52A0' : '#888', borderBottom: activePanel === 'takeaways' ? '2px solid #3D52A0' : '2px solid transparent' }}
            >
              💡 Takeaways
            </div>
            <div 
              onClick={() => setActivePanel('notes')}
              style={{ flex: 1, textAlign: 'center', padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: activePanel === 'notes' ? '#3D52A0' : '#888', borderBottom: activePanel === 'notes' ? '2px solid #3D52A0' : '2px solid transparent' }}
            >
              🗒️ My Notes
            </div>
          </div>

          {/* TAB CONTENT */}
          <div style={{ padding: '24px 16px', flex: 1, overflowY: 'auto' }}>
            {activePanel === 'takeaways' && (
              <div style={{ background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#3D52A0', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Takeaways</div>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ fontSize: '13px', color: '#333', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#3D52A0', marginTop: '2px' }}>•</span> Everything is an assumption until tested by the market.
                  </li>
                  <li style={{ fontSize: '13px', color: '#333', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#3D52A0', marginTop: '2px' }}>•</span> Find the cheapest, fastest way to test your biggest assumption.
                  </li>
                  <li style={{ fontSize: '13px', color: '#333', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#3D52A0', marginTop: '2px' }}>•</span> Watch what people do, not what they say.
                  </li>
                  <li style={{ fontSize: '13px', color: '#333', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#3D52A0', marginTop: '2px' }}>•</span> Constraints (lack of time/money) force creative solutions.
                  </li>
                  <li style={{ fontSize: '13px', color: '#333', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#3D52A0', marginTop: '2px' }}>•</span> Action produces information. Inaction produces nothing.
                  </li>
                </ul>
              </div>
            )}
            
            {activePanel === 'notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {notes.map(note => (
                  <StickyNote 
                    key={note.id} 
                    note={note} 
                    updateNoteColor={updateNoteColor} 
                    deleteNote={deleteNote} 
                    updateNoteText={updateNoteText} 
                    canDelete={notes.length > 1}
                  />
                ))}
                <button onClick={addNote} style={{
                  width: '100%', padding: '12px', background: 'transparent', border: '1px dashed #ccc', borderRadius: '6px', color: '#666', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px'
                }}>
                  + Add Note
                </button>
              </div>
            )}
          </div>
        </div>`;

// Regex replacement for wrapper width logic:
// Replace any `width: marginOpen ? '70%' : '100%', paddingRight: marginOpen ? '0' : '48px', transition: 'width 0.3s ease, padding 0.3s ease'`
// with `width: '100%', marginRight: marginOpen ? '300px' : '0', transition: 'margin-right 0.3s ease'`
content = content.replace(/width:\s*marginOpen \? '70%' : '100%',\s*paddingRight:[^,]+,\s*transition:[^\}]+/g, "width: '100%', marginRight: marginOpen ? '300px' : '0', transition: 'margin-right 0.3s ease'");
content = content.replace(/width:\s*'100%',\s*marginRight:\s*'300px'/g, "width: '100%', marginRight: marginOpen ? '300px' : '0', transition: 'margin-right 0.3s ease'");

// Now, let's carve out the entire right panel blocks.
// In isLesson1, the main content ends with:
//         <div className="mt-[64px] flex justify-end w-full border-t border-sky-blue pt-[32px]">
//             <Link href={`/lessons/${lessonId}/quizzes`}>...
//             </Link>
//         </div>
//       </div>
//       {/* RIGHT SIDEBAR (NOTES) */} ... </div> </div> ); }

let isLesson1Start = content.indexOf('if (isLesson1) {');
let isLesson1QuizzesLink = content.indexOf('Next: Quizzes \u2192', isLesson1Start);
let isLesson1ContentEnd = content.indexOf('</Link>', isLesson1QuizzesLink) + 7;
let afterLinkDiv1 = content.indexOf('</div>', isLesson1ContentEnd) + 6; // closes flex flex-end
let afterLinkDiv2 = content.indexOf('</div>', afterLinkDiv1) + 6; // closes main content width wrapper

let defaultReturnStart = content.indexOf('return (', afterLinkDiv2);
let isLesson1End = content.lastIndexOf('}', defaultReturnStart); // the } of if(isLesson1) { ... }

// Overwrite the portion between afterLinkDiv2 and isLesson1End
let isLesson1Replacement = '\n' + newPanel + '\n      </div>\n    );\n  ';
content = content.substring(0, afterLinkDiv2) + isLesson1Replacement + content.substring(isLesson1End);

// Do the same for the default return block
let defaultQuizzesLink = content.indexOf('Next: Quizzes \u2192', defaultReturnStart);
let defaultContentEnd = content.indexOf('</Link>', defaultQuizzesLink) + 7;
let afterLinkDiv3 = content.indexOf('</div>', defaultContentEnd) + 6; // closes flex flex-end
let afterLinkDiv4 = content.indexOf('</div>', afterLinkDiv3) + 6; // closes p-[32px] overflow-y-auto wrapper

let defaultEnd = content.lastIndexOf('}'); // end of file usually, or close to it
let defaultReplacement = '\n' + newPanel + '\n      </div>\n    );\n}';

// Ensure we don't mess up the very end of the file. The last characters should be the `);\n}` of the default return.
// Let's find the very last `</div>` before the final `);\n}`
let finalClose = content.lastIndexOf(');');
content = content.substring(0, afterLinkDiv4) + '\n' + newPanel + '\n      </div>\n    ' + content.substring(finalClose);

fs.writeFileSync('C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/articles/read/page.tsx', content, 'utf-8');
console.log('SUCCESS');
