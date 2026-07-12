const fs = require('fs');

function softenShadows(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  let original = code;
  
  code = code.replace(
    /border: "1px solid #EBEBEB"/g,
    'border: "none"'
  );
  
  code = code.replace(
    /boxShadow: "0 1px 3px rgba\(0,0,0,0\.06\)"/g,
    'boxShadow: "0 8px 32px rgba(0,0,0,0.04)"'
  );
  
  if (code !== original) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

softenShadows('components/TodayAgendaCard.tsx');
softenShadows('components/ReviewMistakesCard.tsx');
