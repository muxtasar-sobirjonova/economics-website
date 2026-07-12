import re

file_path = r'C:\Users\user\.gemini\antigravity-ide\scratch\economics_website\app\lessons\[lessonId]\articles\read\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Chunk 1: imports
content = content.replace(
    'import ReadingActions from "@/components/ReadingActions";',
    'import ReadingActions from "@/components/ReadingActions";\nimport { PanelRightClose, PanelRightOpen } from "lucide-react";'
)

# Chunk 2: drawerOpen to marginOpen
content = content.replace(
    'const [drawerOpen, setDrawerOpen] = useState(false);',
    'const [marginOpen, setMarginOpen] = useState(true);'
)

# Chunk 3: isLesson1 wrapper
content = content.replace(
    '<div className="content-page min-h-screen w-full flex-1 overflow-y-auto">\n        <div className="w-full max-w-[1200px] mx-auto px-[48px] py-[40px] relative">',
    '<div className="content-page min-h-screen w-full flex flex-row flex-1 overflow-y-auto">\n        <div style={{ width: marginOpen ? \'70%\' : \'100%\', transition: \'width 0.3s ease\' }}>\n          <div className="w-full max-w-[1200px] mx-auto px-[48px] py-[40px] relative">'
)

# Chunk 4: isLesson1 bottom drawer replacement
new_margin = '''        </div>
        </div>

        {/* MARGIN COLUMN */}
        <div style={{
          width: marginOpen ? '30%' : '0',
          minWidth: marginOpen ? '240px' : '0',
          height: '100vh',
          position: 'sticky',
          top: 0,
          borderLeft: marginOpen ? '1px solid #EBEBEB' : 'none',
          background: '#FAFBFF',
          overflowY: marginOpen ? 'auto' : 'hidden',
          padding: marginOpen ? '24px 16px' : '0',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          transition: 'width 0.3s ease, min-width 0.3s ease, padding 0.3s ease'
        }}>
          {marginOpen && (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setMarginOpen(false)} style={{ width: '28px', height: '28px', background: '#EEF3FF', border: '1px solid #C7D7FF', borderRadius: '6px', color: '#3D52A0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PanelRightClose size={16} />
                </button>
              </div>

              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#3D52A0', textTransform: 'uppercase' }}>KEY TAKEAWAYS</div>

              {[
                "Domino's won by solving speed not pizza quality",
                "Resource allocation defines entrepreneurial success",
                "Customers value outcomes not effort",
                "Spotting unmet needs is an economic skill",
                "Constraints force creative decision-making"
              ].map((text, i) => (
                <div key={i} style={{ background: '#EEF3FF', border: '1px solid #C7D7FF', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#1A1A2E', fontWeight: 600, borderLeft: '3px solid #3D52A0' }}>
                  {text}
                </div>
              ))}

              <div style={{ borderTop: '1px solid #EBEBEB', margin: '8px 0' }} />

              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#3D52A0', textTransform: 'uppercase' }}>MY NOTES</div>

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
            </>
          )}
        </div>

        {!marginOpen && (
          <div onClick={() => setMarginOpen(true)} style={{ position: 'fixed', right: 0, top: '50%', background: '#3D52A0', color: '#fff', padding: '8px 6px', borderRadius: '8px 0 0 8px', fontSize: '10px', writingMode: 'vertical-lr', cursor: 'pointer', zIndex: 100, letterSpacing: '1px' }}>
            NOTES &amp; TAKEAWAYS
          </div>
        )}'''

parts = content.split('{/* BOTTOM DRAWER */}', 2)

first_part = parts[0]
first_part = first_part.replace(
    '          <div className="mt-[64px] flex justify-end w-full border-t border-sky-blue pt-[32px]">\n            <Link href={`/lessons/${lessonId}/quizzes`}>\n              <button className="bg-[#4F46E5] text-[#ffffff] px-[32px] py-[16px] rounded-[8px] font-sans font-[700] text-[14px] uppercase tracking-wider transition-all hover:bg-[#4F46E5] shadow-md flex items-center gap-2 active:scale-95 active:opacity-90">\n                Next: Quizzes →\n              </button>\n            </Link>\n          </div>\n        </div>\n\n      ',
    '          <div className="mt-[64px] flex justify-end w-full border-t border-sky-blue pt-[32px]">\n            <Link href={`/lessons/${lessonId}/quizzes`}>\n              <button className="bg-[#4F46E5] text-[#ffffff] px-[32px] py-[16px] rounded-[8px] font-sans font-[700] text-[14px] uppercase tracking-wider transition-all hover:bg-[#4F46E5] shadow-md flex items-center gap-2 active:scale-95 active:opacity-90">\n                Next: Quizzes →\n              </button>\n            </Link>\n          </div>\n' + new_margin + '\n      '
)

end_drawer_idx = parts[1].find('    );\n  }')
if end_drawer_idx != -1:
    parts[1] = parts[1][end_drawer_idx:]

content = first_part + parts[1] + '{/* BOTTOM DRAWER */}' + parts[2]

# Chunk 5: Default return wrapper
content = content.replace(
    '<div className="flex flex-1 overflow-hidden p-[16px] gap-[20px]">\n        <div className="flex-1 overflow-y-auto p-[32px]">',
    '<div className="flex flex-1 overflow-hidden">\n        <div style={{ width: marginOpen ? \'70%\' : \'100%\', transition: \'width 0.3s ease\' }} className="overflow-y-auto p-[32px]">'
)

# Chunk 6: Default return bottom drawer replacement
target_str = '''              <div className="relative z-10 flex items-center justify-end mt-12">
                <Link href={`/lessons/${activeLesson.lessonId}/quizzes`}>
                  <button className="bg-[#4F46E5] text-[#ffffff] hover:bg-[#4F46E5] px-[28px] py-[13px] rounded-[50px] font-bold text-[14px] transition-all shadow-sm active:scale-95 active:opacity-90">
                    Next: Quizzes →
                  </button>
                </Link>
              </div>
            </div>

        </div>
      </div>
      </div>

      {/* BOTTOM DRAWER */}'''

replacement_str = '''              <div className="relative z-10 flex items-center justify-end mt-12">
                <Link href={`/lessons/${activeLesson.lessonId}/quizzes`}>
                  <button className="bg-[#4F46E5] text-[#ffffff] hover:bg-[#4F46E5] px-[28px] py-[13px] rounded-[50px] font-bold text-[14px] transition-all shadow-sm active:scale-95 active:opacity-90">
                    Next: Quizzes →
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>

''' + new_margin + '''
      </div>'''

content = content.replace(target_str, replacement_str)

start_idx = content.find(new_margin, content.find(new_margin) + 1)
drawer_start = content.find('<div style={{', start_idx + len(new_margin))
if drawer_start != -1:
    content = content[:drawer_start] + '  );\n}\n'

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")
