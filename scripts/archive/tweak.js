const fs = require('fs');

const filePath = 'C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/articles/read/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Content width 70% -> 75%
content = content.replace(
    "width: marginOpen ? '70%' : '100%'",
    "width: marginOpen ? '75%' : '100%'"
);
// replace again for the second instance
content = content.replace(
    "width: marginOpen ? '70%' : '100%'",
    "width: marginOpen ? '75%' : '100%'"
);

// Margin width 30% -> 25%
content = content.replaceAll(
    "width: marginOpen ? '30%' : '0'",
    "width: marginOpen ? '25%' : '0'"
);

// 2. Article title font size 48px -> 42px
content = content.replace(
    "text-[42px] md:text-[48px] font-[900]",
    "text-[42px] font-[900]"
);

// 3. Gap 16px to 28px, 4. max-width 420px
content = content.replace(
    'style={{ columnWidth: "520px", columnGap: "32px" }}',
    'style={{ columnWidth: "420px", columnGap: "28px" }}'
);
content = content.replace(
    '<p className="whitespace-pre-wrap break-inside-avoid-column">',
    '<p className="whitespace-pre-wrap break-inside-avoid-column" style={{ maxWidth: "420px" }}>'
);

// 5. Margin column gap & padding
content = content.replaceAll(
    "padding: marginOpen ? '24px 16px' : '0',\n          display: 'flex',\n          flexDirection: 'column',\n          gap: '16px',",
    "padding: marginOpen ? '20px 16px' : '0',\n          display: 'flex',\n          flexDirection: 'column',\n          gap: '10px',"
);

// 6. Takeaway cards padding & font size
content = content.replaceAll(
    "padding: '10px 12px', fontSize: '12px', color: '#1A1A2E'",
    "padding: '8px 10px', fontSize: '12px', color: '#1A1A2E'"
);

// 7. Margin-top 20px on MY NOTES
content = content.replaceAll(
    "<div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#3D52A0', textTransform: 'uppercase' }}>MY NOTES</div>",
    "<div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#3D52A0', textTransform: 'uppercase', marginTop: '20px' }}>MY NOTES</div>"
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("SUCCESS");
