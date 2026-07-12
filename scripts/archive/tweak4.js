const fs = require('fs');

const filePath = 'C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/articles/read/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Revert container widths
content = content.replace(
    "width: '100%', marginRight: '300px'",
    "width: marginOpen ? '70%' : '100%', paddingRight: marginOpen ? '0' : '48px', transition: 'width 0.3s ease, padding 0.3s ease'"
);
content = content.replace(
    "width: '100%', marginRight: '300px'",
    "width: marginOpen ? '70%' : '100%', paddingRight: marginOpen ? '0' : '48px', transition: 'width 0.3s ease, padding 0.3s ease'"
);

// 2. Replace the Fixed Right Panel block with the Collapsible 70/30 Margin + Purple Tab
const newLayout = `        {/* RIGHT SIDEBAR (NOTES) */}
        <div style={{
          width: marginOpen ? '30%' : '0',
          minWidth: marginOpen ? '240px' : '0',
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: 'transparent',
          borderLeft: marginOpen ? '1px solid rgba(0,0,0,0.05)' : 'none',
          overflowY: marginOpen ? 'auto' : 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease, min-width 0.3s ease'
        }}>
          {marginOpen && (
            <div style={{ padding: '40px 64px 40px 24px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {notes.length === 0 || (notes.length === 1 && !notes[0].text) ? (
                <div style={{ textAlign: 'center', opacity: 0.6 }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4B4279" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  <div style={{ color: '#4B4279', fontWeight: 600, fontSize: '14px' }}>Add Note</div>
                </div>
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
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
                </div>
              )}

              {/* Floating Add Button */}
              <button onClick={addNote} style={{
                position: 'absolute',
                bottom: '40px',
                right: '64px',
                width: '40px',
                height: '40px',
                background: '#4B4279',
                color: '#fff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 4px 12px rgba(75, 66, 121, 0.3)'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* FIXED PURPLE TAB */}
        <div 
          onClick={() => setMarginOpen(!marginOpen)}
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            width: '48px',
            background: '#4B4279',
            zIndex: 110,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '60px',
            boxShadow: '-2px 0 8px rgba(0,0,0,0.1)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '24px' }}>
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          <div style={{
            color: '#ffffff',
            writingMode: 'vertical-lr',
            transform: 'rotate(180deg)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.2em'
          }}>
            NOTES
          </div>
        </div>`;

// Regex to find the FIXED RIGHT PANEL block
const regex = /\{\/\*\s*FIXED RIGHT PANEL\s*\*\/\}.*?<\/div>\s*<\/div>\s*<\/div>/gs;
// Because the panel has multiple nested divs, it's safer to just split and join by exact markers if possible.
// Wait, the block starts with {/* FIXED RIGHT PANEL */} and ends right before `</div>\n    );\n  }` in isLesson1, 
// and `</div>\n    </div>\n  );\n}` in default return.

// Let's use string manipulation instead of greedy regex.
let parts = content.split('{/* FIXED RIGHT PANEL */}');
if (parts.length === 3) {
  // First replacement (isLesson1)
  let endIdx1 = parts[1].indexOf('    );\n  }');
  if (endIdx1 !== -1) {
    let remainder = parts[1].substring(endIdx1);
    parts[1] = '\\n' + newLayout + '\\n      </div>\\n' + remainder;
  }
  
  // Second replacement (default return)
  let endIdx2 = parts[2].indexOf('    </div>\n  );\n}');
  if (endIdx2 !== -1) {
    let remainder2 = parts[2].substring(endIdx2);
    parts[2] = '\\n' + newLayout + '\\n      </div>\\n' + remainder2;
  }
  
  content = parts[0] + parts[1] + parts[2];
}

// Write the file
fs.writeFileSync(filePath, content, 'utf-8');
console.log("SUCCESS");
