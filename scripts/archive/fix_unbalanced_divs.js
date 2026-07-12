const fs = require('fs');

let content = fs.readFileSync('app/(marketing)/page.tsx', 'utf-8');

const badBlock = `                <div>
                  <div className="font-bold text-[#1A1A3E] text-lg">The Team</div>
                  <div className="text-gray-600 text-sm">That's So Econ</div>
                </div>
              </div>
            </div>`;

content = content.replace(badBlock, '            </div>');

fs.writeFileSync('app/(marketing)/page.tsx', content, 'utf-8');
console.log("Fixed unbalanced divs.");
