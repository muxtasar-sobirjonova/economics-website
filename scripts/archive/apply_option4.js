const fs = require('fs');

const pagePath = 'C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/quizzes/read/page.tsx';
const sectionPath = 'C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/components/QuizSection.tsx';

let pageContent = fs.readFileSync(pagePath, 'utf8');
let sectionContent = fs.readFileSync(sectionPath, 'utf8');

// --- 1. Modify QuizSection.tsx ---

// Question Card Container
sectionContent = sectionContent.replace(
  /className="bg-white rounded-xl border border-gray-200 p-6 mb-4"/g,
  `style={{ background: 'linear-gradient(135deg, #EEF3FF, #F8F9FC)', borderRadius: '16px', padding: '24px', marginBottom: '16px', border: '1px solid #C7D7FF' }}`
);

// Question Header (Pill + Difficulty) and Question Text
sectionContent = sectionContent.replace(
  /<p style=\{\{ color: '#1A1A2E', fontWeight: 600, marginBottom: '16px' \}\}>\s*\{retryMode \? "Review" : idx \+ 1\}\. \{q\.questionText\}\s*<\/p>/g,
  `<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ background: '#3D52A0', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.06em' }}>
              QUESTION {idx + 1} OF 10
            </div>
            <div style={{ fontSize: '10px', color: '#888', fontWeight: 600 }}>
              ⚡ Medium
            </div>
          </div>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#111111', lineHeight: '1.6', marginBottom: '18px' }}>
            {q.questionText}
          </p>`
);

// Answer Option Styling
sectionContent = sectionContent.replace(
  /let optionStyle: React\.CSSProperties = \{[\s\S]*?textAlign: 'left'\s*\};/g,
  `let optionStyle: React.CSSProperties = {
                  background: '#ffffff',
                  border: '1px solid #E0E7FF',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  width: '100%',
                  textAlign: 'left'
                };`
);

// Update Selected State in optionStyle
sectionContent = sectionContent.replace(
  /\} else if \(isSelected\) \{\s*optionStyle\.background = '#EEF3FF';\s*optionStyle\.border = '2px solid #3D52A0';\s*\}/g,
  `} else if (isSelected) {
                  optionStyle.background = '#3D52A0';
                  optionStyle.borderColor = '#3D52A0';
                  optionStyle.color = '#ffffff';
                  optionStyle.fontWeight = 600;
                  optionStyle.transform = 'translateX(0)';
                }`
);

// Update Hover State logic inside option button
sectionContent = sectionContent.replace(
  /onMouseEnter=\{\(e\) => \{\s*if \(\!submitted && \!isSelected\) \{\s*e\.currentTarget\.style\.background = '#F0F4FF';\s*e\.currentTarget\.style\.border = '1px solid #C7D7FF';\s*\}\s*\}\}/g,
  `onMouseEnter={(e) => {
                      if (!submitted && !isSelected) {
                        e.currentTarget.style.borderColor = '#3D52A0';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(61,82,160,0.12)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }
                    }}`
);
sectionContent = sectionContent.replace(
  /onMouseLeave=\{\(e\) => \{\s*if \(\!submitted && \!isSelected\) \{\s*e\.currentTarget\.style\.background = '#ffffff';\s*e\.currentTarget\.style\.border = '1px solid #EBEBEB';\s*\}\s*\}\}/g,
  `onMouseLeave={(e) => {
                      if (!submitted && !isSelected) {
                        e.currentTarget.style.borderColor = '#E0E7FF';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }
                    }}`
);

// Option Layout (remove circle radio, add arrow)
sectionContent = sectionContent.replace(
  /<div style=\{\{\s*width: '20px',[\s\S]*?<\/div>[\s\S]*?<span style=\{\{ color: isSelected \? '#1A1A2E' : '#374151', fontSize: '14px', fontWeight: isSelected \? 600 : 400 \}\}>\{opt\}<\/span>/g,
  `<span style={{ color: isSelected ? '#ffffff' : '#1A1A2E', fontSize: '14px', fontWeight: isSelected ? 600 : 400 }}>{opt}</span>
                    <span style={{ color: isSelected ? 'rgba(255,255,255,0.5)' : '#C7D7FF', fontSize: '16px' }}>→</span>`
);

fs.writeFileSync(sectionPath, sectionContent, 'utf8');

// --- 2. Modify page.tsx ---

if (!pageContent.includes('import { StickyNote }')) {
  pageContent = pageContent.replace(
    /import Link from "next\/link";/,
    `import Link from "next/link";\nimport { StickyNote } from "lucide-react";`
  );
}

if (!pageContent.includes('const [marginOpen')) {
  pageContent = pageContent.replace(
    /const \[answeredCount, setAnsweredCount\] = useState\(0\);/,
    `const [answeredCount, setAnsweredCount] = useState(0);
  const [marginOpen, setMarginOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<'takeaways' | 'notes'>('takeaways');
  const [notes, setNotes] = useState([{ id: 1, color: '#fef3c7', content: '' }]);`
  );
}

// Update flex-1 container to shrink
pageContent = pageContent.replace(
  /<div className="flex-1 overflow-y-auto p-\[32px\] bg-\[\#F8F9FC\]">/,
  `<div className="flex-1 overflow-y-auto p-[32px] bg-[#F8F9FC]" style={{ marginRight: marginOpen ? '260px' : '0', transition: 'margin-right 0.3s ease' }}>`
);

// Append the fixed notes panel to the end of the JSX tree
const fixedPanelStr = `

      {/* FIXED TABBED PANEL */}
      <div style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '260px',
        background: '#ffffff',
        borderLeft: '1px solid #EBEBEB',
        boxShadow: '-4px 0 12px rgba(0,0,0,0.06)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '80px',
        transform: marginOpen ? 'translateX(0)' : 'translateX(260px)',
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
            height: '80px',
            background: '#3D52A0',
            borderRadius: '8px 0 0 8px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            transition: 'all 0.3s ease'
          }}
        >
          {marginOpen ? (
            <div style={{ fontSize: '14px' }}>✕</div>
          ) : (
            <>
              <StickyNote size={12} strokeWidth={2.5} />
              <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', marginTop: '6px' }}>
                NOTES
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #EBEBEB' }}>
          <div 
            onClick={() => setActivePanel('takeaways')}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '12px 0',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              color: activePanel === 'takeaways' ? '#3D52A0' : '#888',
              borderBottom: activePanel === 'takeaways' ? '2px solid #3D52A0' : '2px solid transparent'
            }}
          >
            💡 Takeaways
          </div>
          <div 
            onClick={() => setActivePanel('notes')}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '12px 0',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              color: activePanel === 'notes' ? '#3D52A0' : '#888',
              borderBottom: activePanel === 'notes' ? '2px solid #3D52A0' : '2px solid transparent'
            }}
          >
            🗒️ My Notes
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {activePanel === 'takeaways' && (
            <div style={{ background: '#EEF3FF', border: '1px solid #C7D7FF', borderRadius: '8px', padding: '16px', margin: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#3D52A0', marginBottom: '12px' }}>
                KEY TAKEAWAYS
              </div>
              <ul style={{ listStyleType: 'disc', paddingLeft: '16px', fontSize: '13px', color: '#1A1A2E', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.5 }}>
                <li>Speed of delivery beats product quality</li>
                <li>Resource allocation is the core skill</li>
                <li>Customers define value, not producers</li>
                <li>Constraints reveal competitive advantages</li>
                <li>Entrepreneurship is economics in action</li>
              </ul>
            </div>
          )}

          {activePanel === 'notes' && (
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
              {notes.map((note) => (
                <div key={note.id} style={{ background: note.color, borderRadius: '8px', padding: '12px', marginBottom: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {['#fef3c7', '#dcfce7', '#e0e7ff', '#fce7f3'].map(c => (
                        <div key={c} onClick={() => setNotes(notes.map(n => n.id === note.id ? { ...n, color: c } : n))} style={{ width: '16px', height: '16px', borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', outline: note.color === c ? '2px solid #3D52A0' : 'none', outlineOffset: '1px' }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    {['B', 'I', 'U', 'S', 'H'].map(cmd => (
                      <button key={cmd} style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: cmd === 'B' ? 700 : 'normal', fontStyle: cmd === 'I' ? 'italic' : 'normal', textDecoration: cmd === 'U' ? 'underline' : cmd === 'S' ? 'line-through' : 'none', cursor: 'pointer', padding: '2px 4px' }}>{cmd}</button>
                    ))}
                  </div>
                  <div
                    contentEditable
                    data-placeholder="Start typing your note here..."
                    style={{ minHeight: '100px', fontSize: '13px', lineHeight: 1.5, outline: 'none', color: '#1A1A2E' }}
                  />
                </div>
              ))}
              <button onClick={() => setNotes([...notes, { id: Date.now(), color: '#fef3c7', content: '' }])} style={{ background: 'none', border: '1px dashed #C7D7FF', color: '#3D52A0', borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginBottom: '16px' }}>
                + Add Note
              </button>
              <button style={{ background: '#3D52A0', color: '#fff', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 700, width: 'calc(100% - 32px)', margin: '12px 16px', marginTop: 'auto' }}>
                Save Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );`;

pageContent = pageContent.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}\s*$/,
  `        </div>
        </div>
      </div>` + fixedPanelStr + `\n}`
);

fs.writeFileSync(pagePath, pageContent, 'utf8');
console.log('Option 4 applied');
