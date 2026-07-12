const fs = require('fs');

let content = fs.readFileSync('C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/articles/read/page.tsx', 'utf-8');

const newLayout = `        {/* FIXED RIGHT PANEL */}
        <div style={{
          width: marginOpen ? '30%' : '0',
          minWidth: marginOpen ? '300px' : '0',
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: '#ffffff',
          borderLeft: marginOpen ? '1px solid #EBEBEB' : 'none',
          boxShadow: marginOpen ? '-4px 0 12px rgba(0,0,0,0.06)' : 'none',
          zIndex: 100,
          overflowY: marginOpen ? 'auto' : 'hidden',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '60px',
          paddingRight: marginOpen ? '48px' : '0',
          transition: 'width 0.3s ease, min-width 0.3s ease'
        }}>
          {marginOpen && (
            <>
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
            </>
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

content = content.replace(
    "width: '100%', marginRight: '300px'",
    "width: marginOpen ? '70%' : '100%', paddingRight: marginOpen ? '0' : '48px', transition: 'width 0.3s ease, padding 0.3s ease'"
);

content = content.replace(
    "width: '100%', marginRight: '300px'",
    "width: marginOpen ? '70%' : '100%', paddingRight: marginOpen ? '0' : '48px', transition: 'width 0.3s ease, padding 0.3s ease'"
);

let parts = content.split('{/* FIXED RIGHT PANEL */}');
if(parts.length === 3) {
    let remainder1 = parts[1].substring(parts[1].lastIndexOf('</div>\\n      </div>\\n    );\\n  }'));
    if (!remainder1 || remainder1 === parts[1]) {
       remainder1 = parts[1].substring(parts[1].lastIndexOf('</div>\\n      </div>\\n    );'));
    }
    if (!remainder1 || remainder1 === parts[1]) {
       remainder1 = parts[1].substring(parts[1].lastIndexOf('</div>\\r\\n      </div>\\r\\n    );'));
    }
    parts[1] = '\\n' + newLayout + '\\n      ' + remainder1;
    
    let remainder2 = parts[2].substring(parts[2].lastIndexOf('</div>\\n    </div>\\n  );\\n}'));
    if (!remainder2 || remainder2 === parts[2]) {
       remainder2 = parts[2].substring(parts[2].lastIndexOf('</div>\\n    </div>\\n  );'));
    }
    if (!remainder2 || remainder2 === parts[2]) {
       remainder2 = parts[2].substring(parts[2].lastIndexOf('</div>\\r\\n    </div>\\r\\n  );'));
    }
    parts[2] = '\\n' + newLayout + '\\n    ' + remainder2;
    
    content = parts[0] + parts[1] + parts[2];
}

fs.writeFileSync('C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/articles/read/page.tsx', content, 'utf-8');
console.log("SUCCESS");
