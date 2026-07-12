const fs = require('fs');
let content = fs.readFileSync('C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/articles/read/page.tsx', 'utf-8');

// 1. Update wrappers
content = content.replace(
    /width:\s*'100%',\s*marginRight:\s*'300px'/g,
    "width: '100%', marginRight: marginOpen ? '300px' : '0', transition: 'margin-right 0.3s ease'"
);

// 2. Update panel style and inject toggle button
const panelEndRegex = /paddingTop:\s*'60px'\s*\}\}>/g;
const newPanelInjection = `paddingTop: '60px',
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
          </div>`;

content = content.replace(panelEndRegex, newPanelInjection);

fs.writeFileSync('C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/app/lessons/[lessonId]/articles/read/page.tsx', content, 'utf-8');
console.log('SAFELY APPLIED');
