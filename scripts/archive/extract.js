const fs = require('fs');
const readline = require('readline');
async function extract() {
  const fileStream = fs.createReadStream('C:\\\\Users\\\\user\\\\.gemini\\\\antigravity-ide\\\\brain\\\\c90688a9-0964-45df-bb11-e9509e780b4b\\\\.system_generated\\\\logs\\\\transcript.jsonl');
  const rl = readline.createInterface({ input: fileStream });
  let fullFile = '';
  for await (const line of rl) {
    try {
      const data = JSON.parse(line);
      if (data.tool_calls) {
         for (const call of data.tool_calls) {
            if (call.name === 'write_to_file' && call.args.TargetFile && call.args.TargetFile.includes('page.tsx')) {
               fullFile = call.args.CodeContent;
            }
            if (call.name === 'replace_file_content' && call.args.TargetFile && call.args.TargetFile.includes('page.tsx')) {
               fullFile = fullFile.replace(call.args.TargetContent, call.args.ReplacementContent);
            }
            if (call.name === 'multi_replace_file_content' && call.args.TargetFile && call.args.TargetFile.includes('page.tsx')) {
               let chunks;
               try {
                   chunks = typeof call.args.ReplacementChunks === 'string' ? JSON.parse(call.args.ReplacementChunks) : call.args.ReplacementChunks;
               } catch(e) {}
               if (chunks) {
                   for (const chunk of chunks) {
                      fullFile = fullFile.replace(chunk.TargetContent, chunk.ReplacementContent);
                   }
               }
            }
         }
      }
      if (data.step_index >= 560) {
         break;
      }
    } catch(e) {}
  }
  // The fullFile is a proper string now because it comes from parsing JSON in memory and we just write it.
  fs.writeFileSync('C:\\\\Users\\\\user\\\\.gemini\\\\antigravity-ide\\\\scratch\\\\economics_website\\\\app\\\\page.tsx', fullFile);
}
extract();
