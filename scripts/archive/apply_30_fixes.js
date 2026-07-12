const fs = require('fs');
let content = fs.readFileSync('C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/articles/read/page.tsx', 'utf-8');

// 1. STRAY TEXT & NEWLINES
// In the current file, we had lines with just `                \n\n      `
// Let's remove them directly.
content = content.replace(/\s*\\n\\n\s*/g, '');
// And single \n outside strings
content = content.replace(/>\s*\\n\s*</g, '><');

// 24. IMPORT ERASER
content = content.replace(
    /import \{ PanelRightClose, PanelRightOpen \} from "lucide-react";/,
    `import { PanelRightClose, PanelRightOpen, Eraser } from "lucide-react";`
);

// 18 & 22. PROGRESS BAR & SCROLL-TO-TOP STATE
// Add scrollY state inside ArticlesReadPage component
content = content.replace(
    /const \[marginOpen, setMarginOpen\] = useState\(true\);/,
    `const [marginOpen, setMarginOpen] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(progress * 100);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);`
);

// 17. BOOKMARK BUTTON (needs to be passed active state handling)
// Actually, BookmarkButton component handles its own state, but if we need to modify it:
// Let's check if BookmarkButton is already modified or if we need to pass something.
// Wait! The user says "Bookmark icon active state: When saved/clicked: - fill: #3D52A0 - color: #3D52A0 Toggle fill on/off on click."
// The BookmarkButton is an imported component. I will edit `components/BookmarkButton.tsx` in a separate step if necessary.

// Let's fix the things in `page.tsx`.

// 19. MAIN CONTENT BACKGROUND: #F8F9FC
content = content.replace(
    /<div className="content-page min-h-screen w-full flex flex-row flex-1 overflow-y-auto">/,
    `<div className="content-page min-h-screen w-full flex flex-row flex-1 overflow-y-auto bg-[#F8F9FC]">`
);

// 14. BACK BUTTON
const backButton = `<button onClick={() => router.push('/lessons/1/articles')} style={{ background: 'none', border: 'none', color: '#3D52A0', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
              ← Back to Articles
            </button>`;
// Insert backButton right after `<div className="w-full max-w-[1200px] mx-auto px-[48px] py-[40px] relative">`
content = content.replace(
    /<div className="w-full max-w-\[1200px\] mx-auto px-\[48px\] py-\[40px\] relative">/,
    `<div className="w-full max-w-[1200px] mx-auto px-[48px] py-[40px] relative">\n          ${backButton}`
);

// 11. ARTICLE TITLE & EYEBROW (21)
content = content.replace(
    /<h1\s+className=\{`\$\{playfair\.className\} text-\[42px\] font-\[900\] text-\[\#111827\] leading-\[1\.05\] uppercase tracking-\[-0\.02em\]`\}\s*>\s*DOMINO'S PIZZA &amp;[\s\S]*?<\/h1>/,
    `<div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#3D52A0', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>ARTICLE</div>
            <h1
              className={\`\${playfair.className} font-[900] text-[#111827] leading-[1.05] uppercase tracking-[-0.02em]\`}
              style={{ fontSize: marginOpen ? '38px' : '48px', transition: 'font-size 0.3s ease' }}
            >
              DOMINO'S PIZZA &amp;<br />
              ENTREPRENEURIAL ECONOMICS
            </h1>`
);

// 29. ESTIMATED READING TIME
content = content.replace(
    /<div className="text-\[\#111827\]\/70 font-sans font-\[600\] text-\[12px\] mt-\[16px\] tracking-\[0\.1em\] uppercase">[\s\S]*?<\/div>/,
    `<div className="text-[#111827]/70 font-sans font-[600] mt-[16px] tracking-[0.1em] uppercase" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
              ESTIMATED READING TIME (10-20 MIN) • DAY 01 — LESSON 1: WHAT IS ENTREPRENEURSHIP ECONOMICS?
            </div>`
);

// 15. LESSON 1 PILL
content = content.replace(
    /<div className="flex justify-between items-start mb-8 w-full pt-\[20px\]">/,
    `<div className="flex justify-between items-start mb-8 w-full pt-[20px] sticky top-[16px] z-50">`
);
content = content.replace(
    /<div className="inline-block border border-\[\#e77291\] bg-transparent text-\[\#e77291\] text-\[11px\] font-\[800\] tracking-\[0\.08em\] uppercase px-\[14px\] py-\[6px\] rounded-\[50px\]">/,
    `<div className="inline-block border border-[#e77291] bg-white text-[#e77291] text-[11px] font-[800] tracking-[0.08em] uppercase px-[14px] py-[6px] rounded-[50px] shadow-sm">`
);

// 12. ARTICLE COLUMNS GAP
content = content.replace(
    /<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-\[64px\] gap-y-\[64px\] items-start">/g,
    `<div className="grid grid-cols-1 lg:grid-cols-2 gap-y-[64px] items-start" style={{ gap: marginOpen ? '16px' : '32px', transition: 'gap 0.3s ease' }}>`
);

// 13. NEXT QUIZZES BUTTON
content = content.replace(
    /Next: Quizzes →/g,
    `Next: Quizzes →`
); // User said it was all caps but it looks like it's already "Next: Quizzes →" in my current code. Let me check the uppercase class.
// Ah, the button has `uppercase` class!
content = content.replace(
    /uppercase tracking-wider transition-all hover:bg-\[\#4F46E5\] shadow-md flex items-center/g,
    `tracking-wider transition-all hover:bg-[#4F46E5] shadow-md flex items-center`
);

// 2, 3, 4, 6, 7, 9, 10. PANEL & TOGGLE
const oldPanelRegex = /<div style=\{\{\s*position: 'fixed',\s*right: 0,\s*top: 0,\s*bottom: 0,\s*width: '300px',[\s\S]*?transform: marginOpen \? 'translateX\(0\)' : 'translateX\(100%\)',\s*transition: 'transform 0\.3s ease'\s*\}\}>[\s\S]*?\{\/\* TOGGLE BUTTON \*\/\}[\s\S]*?<\/div>[\s\S]*?\{marginOpen \? '▶' : '◀'\}[\s\S]*?<\/div>/;

const toggleButton = `
        {/* PROGRESS BAR */}
        <div style={{ position: 'fixed', top: 0, left: marginOpen ? '270px' : '270px', right: 0, height: '3px', background: '#EBEBEB', zIndex: 200 }}>
          <div style={{ background: '#3D52A0', height: '100%', width: \`\${scrollProgress}%\`, transition: 'width 0.1s ease' }} />
        </div>

        {/* SCROLL TO TOP */}
        <div 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          style={{
            position: 'fixed', bottom: '24px', left: '310px', width: '40px', height: '40px', borderRadius: '50%', background: '#3D52A0', color: '#fff', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer', opacity: scrollY > 400 ? 1 : 0, transition: 'opacity 0.3s ease', zIndex: 100, pointerEvents: scrollY > 400 ? 'auto' : 'none'
          }}
        >
          ↑
        </div>

        {/* TOGGLE BUTTON */}
        <div 
          onClick={() => setMarginOpen(!marginOpen)}
          style={{
            position: 'fixed',
            right: marginOpen ? '300px' : '0',
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
            fontSize: '12px',
            zIndex: 101,
            transition: 'right 0.3s ease'
          }}
        >
          {marginOpen ? '▶' : '◀'}
        </div>

        {/* FIXED TABBED PANEL */}
        <div style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '300px',
          background: '#ffffff',
          borderLeft: '1px solid #EBEBEB',
          borderTop: '1px solid #EBEBEB',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.06)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '80px',
          transform: marginOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease'
        }}>
`;

content = content.replace(oldPanelRegex, toggleButton);

// Update Save Note button style
content = content.replace(
    /<button style=\{\{\s*background: '#3D52A0',\s*color: '#fff',\s*borderRadius: '8px',\s*padding: '8px 16px',\s*fontSize: '12px',\s*fontWeight: 700,\s*width: '100%',\s*marginTop: 'auto'\s*\}\}>/g,
    `<button style={{ background: '#3D52A0', color: '#fff', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 700, width: 'calc(100% - 32px)', margin: '12px 16px', marginTop: 'auto' }}>`
);

// Update Add Note button style
content = content.replace(
    /<button onClick=\{addNote\} style=\{\{ fontSize: '12px', fontWeight: 600, color: '#3D52A0', background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', textAlign: 'left' \}\}>/g,
    `<button onClick={addNote} style={{ fontSize: '12px', fontWeight: 600, color: '#3D52A0', background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', textAlign: 'left', margin: '0 16px', padding: '0' }}>`
);

// Panel Tabs padding
content = content.replace(
    /<div style=\{\{\s*padding: '16px',\s*display: 'flex',\s*flexDirection: 'column',\s*height: '100%',\s*minHeight: '400px'\s*\}\}>/g,
    `<div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px' }}>`
);

// Update StickyNote Component (8, 16, 24, 25)
// Find the StickyNote component text and replace it with a string manipulated version
let stickyNoteComp = content.substring(content.indexOf('const StickyNote ='), content.indexOf('const hardcodedBlocks ='));

stickyNoteComp = stickyNoteComp.replace(
    /<div className="note-colors" style=\{\{ display: "flex", gap: "6px", marginBottom: "8px" \}\}>/,
    `<div className="note-colors" style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>`
);

stickyNoteComp = stickyNoteComp.replace(
    /width:"16px",height:"16px"/g,
    `width:"20px",height:"20px"`
);

// Add outline styles to the active color picker. We need to know which color is active. The note has `note.color`.
stickyNoteComp = stickyNoteComp.replace(
    /<div onClick=\{\(\) => updateNoteColor\(note\.id, '([^']+)'\)\}/g,
    `<div onClick={() => updateNoteColor(note.id, '$1')}`
);
stickyNoteComp = stickyNoteComp.replace(
    /border:"1px solid #ccc"/g,
    `border: "1px solid #ccc"`
);

stickyNoteComp = stickyNoteComp.replace(
    /<div onClick=\{\(\) => updateNoteColor\(note.id, '#FFF9C4'\)\} style=\{\{width:"20px",height:"20px",borderRadius:"50%",background:"#FFF9C4",border: "1px solid #ccc",cursor:"pointer"\}\}><\/div>/,
    `<div onClick={() => updateNoteColor(note.id, '#FFF9C4')} style={{width:"20px",height:"20px",borderRadius:"50%",background:"#FFF9C4",border: "1px solid #ccc",cursor:"pointer", outline: note.color === '#FFF9C4' ? '2px solid #3D52A0' : 'none', outlineOffset: '2px', transform: note.color === '#FFF9C4' ? 'scale(1.2)' : 'none' }}></div>`
);
stickyNoteComp = stickyNoteComp.replace(
    /<div onClick=\{\(\) => updateNoteColor\(note.id, '#FFD6D6'\)\} style=\{\{width:"20px",height:"20px",borderRadius:"50%",background:"#FFD6D6",border: "1px solid #ccc",cursor:"pointer"\}\}><\/div>/,
    `<div onClick={() => updateNoteColor(note.id, '#FFD6D6')} style={{width:"20px",height:"20px",borderRadius:"50%",background:"#FFD6D6",border: "1px solid #ccc",cursor:"pointer", outline: note.color === '#FFD6D6' ? '2px solid #3D52A0' : 'none', outlineOffset: '2px', transform: note.color === '#FFD6D6' ? 'scale(1.2)' : 'none' }}></div>`
);
stickyNoteComp = stickyNoteComp.replace(
    /<div onClick=\{\(\) => updateNoteColor\(note.id, '#D6E8FF'\)\} style=\{\{width:"20px",height:"20px",borderRadius:"50%",background:"#D6E8FF",border: "1px solid #ccc",cursor:"pointer"\}\}><\/div>/,
    `<div onClick={() => updateNoteColor(note.id, '#D6E8FF')} style={{width:"20px",height:"20px",borderRadius:"50%",background:"#D6E8FF",border: "1px solid #ccc",cursor:"pointer", outline: note.color === '#D6E8FF' ? '2px solid #3D52A0' : 'none', outlineOffset: '2px', transform: note.color === '#D6E8FF' ? 'scale(1.2)' : 'none' }}></div>`
);
stickyNoteComp = stickyNoteComp.replace(
    /<div onClick=\{\(\) => updateNoteColor\(note.id, '#D6F5E3'\)\} style=\{\{width:"20px",height:"20px",borderRadius:"50%",background:"#D6F5E3",border: "1px solid #ccc",cursor:"pointer"\}\}><\/div>/,
    `<div onClick={() => updateNoteColor(note.id, '#D6F5E3')} style={{width:"20px",height:"20px",borderRadius:"50%",background:"#D6F5E3",border: "1px solid #ccc",cursor:"pointer", outline: note.color === '#D6F5E3' ? '2px solid #3D52A0' : 'none', outlineOffset: '2px', transform: note.color === '#D6F5E3' ? 'scale(1.2)' : 'none' }}></div>`
);
stickyNoteComp = stickyNoteComp.replace(
    /<div onClick=\{\(\) => updateNoteColor\(note.id, '#E8D6FF'\)\} style=\{\{width:"20px",height:"20px",borderRadius:"50%",background:"#E8D6FF",border: "1px solid #ccc",cursor:"pointer"\}\}><\/div>/,
    `<div onClick={() => updateNoteColor(note.id, '#E8D6FF')} style={{width:"20px",height:"20px",borderRadius:"50%",background:"#E8D6FF",border: "1px solid #ccc",cursor:"pointer", outline: note.color === '#E8D6FF' ? '2px solid #3D52A0' : 'none', outlineOffset: '2px', transform: note.color === '#E8D6FF' ? 'scale(1.2)' : 'none' }}></div>`
);

// Eraser Icon instead of 'H'
stickyNoteComp = stickyNoteComp.replace(
    /style=\{\{width:"28px",height:"28px",border: highlight \? "1px solid #856404" : "1px solid #ddd",borderRadius:"4px",background: highlight \? "#FFE066" : "#fff",color:"#111111",fontWeight:900,cursor:"pointer",fontSize:"13px", display: "flex", alignItems: "center", justifyContent: "center"\}\}>H<\/button>/,
    `style={{width:"28px",height:"28px",border: highlight ? "1px solid #856404" : "1px solid #ddd",borderRadius:"4px",background: highlight ? "#FFE066" : "#fff",color:"#111111",fontWeight:900,cursor:"pointer",fontSize:"13px", display: "flex", alignItems: "center", justifyContent: "center"}}><Eraser size={16} /></button>`
);
// In case the above replace missed due to flex wrap, let's just replace the raw H button
stickyNoteComp = stickyNoteComp.replace(
    /style=\{\{width:"28px",height:"28px",border: highlight \? "1px solid #856404" : "1px solid #ddd",borderRadius:"4px",background: highlight \? "#FFE066" : "#fff",color:"#111111",fontWeight:900,cursor:"pointer",fontSize:"13px"\}\}>H<\/button>/,
    `style={{width:"28px",height:"28px",border: highlight ? "1px solid #856404" : "1px solid #ddd",borderRadius:"4px",background: highlight ? "#FFE066" : "#fff",color:"#111111",fontWeight:900,cursor:"pointer",fontSize:"13px", display: "flex", alignItems: "center", justifyContent: "center"}}><Eraser size={16} /></button>`
);


// Empty placeholder CSS inside StickyNote
// Handled by the global style block added later or the existing one?
// The global style block is: `        [contenteditable][data-placeholder]:empty:before { content: attr(data-placeholder); color: #888; font-style: italic; pointer-events: none; }`
// But wait, the user's empty is often empty string vs `<br>`.
// So let's make sure it's applied correctly. It's already there in page.tsx for default view, but we need it for isLesson1 too.
content = content.replace(
    /<div className="content-page min-h-screen w-full flex flex-row flex-1 overflow-y-auto bg-\[\#F8F9FC\]">/,
    `<div className="content-page min-h-screen w-full flex flex-row flex-1 overflow-y-auto bg-[#F8F9FC]">
      <style>{\`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #888;
          font-style: italic;
          pointer-events: none;
        }
      \`}</style>`
);

content = content.replace(content.substring(content.indexOf('const StickyNote ='), content.indexOf('const hardcodedBlocks =')), stickyNoteComp);

// 26. Article body text columns line-height: 1.9
content = content.replace(
    /<p\s*className="[^"]*text-\[\#111827\] text-\[17px\] leading-\[1\.8\] font-\[400\]"\s*>/g,
    `<p className="\${lora.className} text-[#111827] text-[17px] leading-[1.9] font-[400]">`
);

// 27. CASE FILE EVIDENCE labels identical
content = content.replace(
    /<span className="font-sans font-\[800\] italic uppercase text-\[13px\] tracking-widest text-\[\#111827\]">/g,
    `<span className="font-sans font-[700] uppercase text-[11px] tracking-[0.08em] text-[#555]">`
);

// 3. Right wrapper margin when open: 320px
content = content.replace(
    /marginRight: marginOpen \? '300px' : '0'/g,
    `marginRight: marginOpen ? '320px' : '0'`
);

// 28. Blockquote matching Concepts read page
// "Traditional economics explains why Domino's worked. Entrepreneurial economics is what Monaghan was doing while building it."
content = content.replace(
    /<div className="w-full my-\[80px\] text-center px-\[16px\] max-w-\[800px\] mx-auto">[\s\S]*?<div className="w-full h-\[1px\] bg-\[\#111827\]\/20 mt-\[32px\]" \/>\s*<\/div>/,
    `<div className="w-full my-[48px] px-[16px] max-w-[800px] mx-auto">
            <blockquote
              className={\`\${lora.className} italic text-[22px] leading-[1.6] text-[#444]\`}
              style={{ borderLeft: '3px solid #3D52A0', paddingLeft: '16px', margin: '24px 0' }}
            >
              "Traditional economics explains why Domino's worked.
              Entrepreneurial economics is what Monaghan was doing while
              building it."
            </blockquote>
          </div>`
);


fs.writeFileSync('C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/articles/read/page.tsx', content, 'utf-8');
console.log('30 FIXES APPLIED SUCCESSFULLY!');
