const fs = require('fs');

const sectionPath = 'C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/components/QuizSection.tsx';
let content = fs.readFileSync(sectionPath, 'utf8');

// 1. Add eliminated state
if (!content.includes('const [eliminated')) {
  content = content.replace(
    /const \[answers, setAnswers\] = useState<Record<string, string>>\(\{\}\);/,
    `const [answers, setAnswers] = useState<Record<string, string>>({});
  const [eliminated, setEliminated] = useState<Record<string, string[]>>({});`
  );
}

// 2. Add handleEliminate method
if (!content.includes('const handleEliminate =')) {
  content = content.replace(
    /const handleSelect = \(questionId: string, answer: string\) => \{/,
    `const handleEliminate = (e: React.MouseEvent, questionId: string, answer: string) => {
    e.stopPropagation();
    if (submitted) return;
    setEliminated(prev => {
      const qs = prev[questionId] || [];
      if (qs.includes(answer)) {
        return { ...prev, [questionId]: qs.filter(a => a !== answer) };
      } else {
        return { ...prev, [questionId]: [...qs, answer] };
      }
    });
  };

  const handleSelect = (questionId: string, answer: string) => {`
  );
}

// 3. Update Option rendering to include eliminated styles and the "-" button
content = content.replace(
  /const isSelected = answers\[q\._key\] === opt;[\s\S]*?let optionStyle: React\.CSSProperties = \{/m,
  `const isSelected = answers[q._key] === opt;
                const isEliminated = eliminated[q._key]?.includes(opt);
                
                let optionStyle: React.CSSProperties = {`
);

// Add eliminated opacity inside optionStyle assignment
content = content.replace(
  /\} else if \(isSelected\) \{/g,
  `} else if (isEliminated) {
                  optionStyle.opacity = 0.4 as any;
                  optionStyle.textDecoration = 'line-through';
                } else if (isSelected) {`
);

// Add the eliminate button right before the arrow
content = content.replace(
  /<span style=\{\{ color: isSelected \? 'rgba\(255,255,255,0\.5\)' : '\#C7D7FF', fontSize: '16px' \}\}>→<\/span>/g,
  `<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {!isSelected && (
                        <span 
                          onClick={(e) => handleEliminate(e, q._key, opt)}
                          style={{ 
                            color: isEliminated ? '#ef4444' : '#C7D7FF', 
                            fontSize: '18px', 
                            fontWeight: 'bold',
                            padding: '0 4px',
                            cursor: 'pointer'
                          }}
                        >
                          -
                        </span>
                      )}
                      <span style={{ color: isSelected ? 'rgba(255,255,255,0.5)' : '#C7D7FF', fontSize: '16px' }}>→</span>
                    </div>`
);

fs.writeFileSync(sectionPath, content, 'utf8');
console.log('QuizSection updated');
