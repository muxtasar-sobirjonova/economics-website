const fs = require('fs');

const filePath = 'C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/articles/read/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Revert container widths
content = content.replace(
    "width: marginOpen ? '75%' : '100%', transition: 'width 0.3s ease'",
    "width: '100%', marginRight: '300px'"
);
content = content.replace(
    "width: marginOpen ? '75%' : '100%', transition: 'width 0.3s ease'",
    "width: '100%', marginRight: '300px'"
);

// 2. Replace the Margin Column blocks with Fixed Panel
const fixedPanel = `        {/* FIXED RIGHT PANEL */}
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
          paddingTop: '60px'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #EBEBEB' }}>
            <div 
              onClick={() => setActivePanel('takeaways')}
              style={{
                flex: 1, textAlign: 'center', padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                color: activePanel === 'takeaways' ? '#3D52A0' : '#888',
                borderBottom: activePanel === 'takeaways' ? '2px solid #3D52A0' : '2px solid transparent'
              }}
            >
              💡 Takeaways
            </div>
            <div 
              onClick={() => setActivePanel('notes')}
              style={{
                flex: 1, textAlign: 'center', padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                color: activePanel === 'notes' ? '#3D52A0' : '#888',
                borderBottom: activePanel === 'notes' ? '2px solid #3D52A0' : '2px solid transparent'
              }}
            >
              🗒️ My Notes
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {activePanel === 'takeaways' && (
              <div style={{ padding: '16px' }}>
                <div style={{ background: '#EEF3FF', border: '1px solid #C7D7FF', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#3D52A0', textTransform: 'uppercase', marginBottom: '10px' }}>
                    KEY TAKEAWAYS
                  </div>
                  <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                    {[
                      "Domino's won by solving speed not quality",
                      "Resource allocation = entrepreneurial success",
                      "Customers value outcomes not effort",
                      "Spotting unmet needs is an economic skill",
                      "Constraints force creative decisions"
                    ].map((text, i) => (
                      <li key={i} style={{ fontSize: '13px', color: '#1A1A2E', lineHeight: 1.8, marginBottom: '8px', display: 'flex', alignItems: 'flex-start' }}>
                        <span style={{ color: '#3D52A0', marginRight: '8px', flexShrink: 0 }}>•</span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activePanel === 'notes' && (
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px' }}>
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

                <button onClick={addNote} style={{ fontSize: '12px', fontWeight: 600, color: '#3D52A0', background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', textAlign: 'left' }}>
                  + Add Note
                </button>

                <button style={{ background: '#3D52A0', color: '#fff', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 700, width: '100%', marginTop: 'auto' }}>
                  Save Note
                </button>
              </div>
            )}
          </div>
        </div>`;

// Regex to find MARGIN COLUMN block
// It starts with {/* MARGIN COLUMN */} and ends with the floating tab's `)}`
const regex = /\{\/\*\s*MARGIN COLUMN\s*\*\/\}.*?\{\!marginOpen\s*&&\s*\([\s\S]*?NOTES \&amp; TAKEAWAYS[\s\S]*?<\/div>\s*\)\}/gs;
content = content.replace(regex, fixedPanel);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("SUCCESS");
