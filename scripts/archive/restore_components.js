const fs = require('fs');

const missingComponents = `const ScrollReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.3, ease: "easeOut", delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const BrowserChrome = () => (
  <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2 w-full shrink-0 h-6"></div>
);

const DashboardMockup = () => (
  <motion.div 
    initial={{ rotate: 2 }}
    whileHover={{ rotate: 0, y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
    className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden text-left flex flex-col h-auto max-h-[520px] w-full max-w-lg mx-auto relative z-10"
  >
    <BrowserChrome />
    <div className="p-[40px] flex-1 overflow-y-auto flex flex-col">
      {/* ── Header ── */}
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-[#111111] font-[800] text-[20px] tracking-tight leading-none">
          Today's Agenda
        </h2>
        <div className="text-[13px] font-[500] text-[#7B6FE7] bg-[#F3F0FF] px-3 py-1 rounded-full leading-none">
          ~25 min total
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4 flex flex-col gap-2 mt-2">
        <div className="flex justify-between text-[12px] font-bold text-[#6B7280]">
          <span>Progress</span>
          <span>1 of 3 done</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
           <motion.div 
             className="h-full bg-[#7B6FE7] rounded-full" 
             initial={{ width: 0 }}
             whileInView={{ width: "33.33%" }}
             transition={{ duration: 0.6, ease: "circOut" }}
           />
        </div>
      </div>

      {/* ── Items ── */}
      <div className="flex flex-col gap-3 flex-1">
        {/* Concept */}
        <div className="flex items-center py-2 pr-3 pl-3 border-[1.5px] border-[#F3F4F6] rounded-[16px] group bg-white transition-all hover:shadow-sm hover:border-gray-200" style={{ opacity: 0.6 }}>
          <div className="w-[4px] h-[24px] rounded-full mr-3 shrink-0 transition-colors group-hover:shadow-[0_0_8px_rgba(123,111,231,0.5)]" style={{ backgroundColor: "#d97706" }} />
          <div className="flex-1 flex items-center flex-wrap gap-2">
            <div className="text-[10px] font-[800] px-2 py-0.5 rounded-[6px] tracking-wider uppercase" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>CONCEPT</div>
            <div className="text-[14px] font-[600] leading-tight text-[#111111] line-clamp-1 max-w-[200px]">Value Creation</div>
            <div className="bg-[#F8F9FA] text-[#7B6FE7] font-[500] text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ml-auto">~5 min</div>
          </div>
          <button className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 transition-all duration-150 ml-3 cursor-pointer bg-[#15803D] border-[#15803D] border-[1.5px] shadow-[0_0_0_3px_rgba(21,128,61,0.15)]">
            <IconCheck size={20} className="text-white" stroke={3} />
          </button>
        </div>
        
        {/* Article */}
        <div className="flex items-center py-2 pr-3 pl-3 border-[1.5px] border-[#F3F4F6] rounded-[16px] group bg-white transition-all hover:shadow-sm hover:border-gray-200" style={{ opacity: 1 }}>
          <div className="w-[4px] h-[24px] rounded-full mr-3 shrink-0 transition-colors group-hover:shadow-[0_0_8px_rgba(123,111,231,0.5)]" style={{ backgroundColor: "#2563eb" }} />
          <div className="flex-1 flex items-center flex-wrap gap-2">
            <div className="text-[10px] font-[800] px-2 py-0.5 rounded-[6px] tracking-wider uppercase" style={{ backgroundColor: "#dbeafe", color: "#2563eb" }}>ARTICLE</div>
            <div className="text-[14px] font-[600] leading-tight text-[#111111] line-clamp-1 max-w-[200px]">AirBnB Case Study</div>
            <div className="bg-[#F8F9FA] text-[#7B6FE7] font-[500] text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ml-auto">~15 min</div>
          </div>
          <button className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 transition-all duration-150 ml-3 cursor-pointer border-[#E5E7EB] border-[1.5px] hover:border-[#5C4DE3] hover:bg-[#F3F0FF]"><IconLock size={16} className="text-gray-400" /></button>
        </div>
        
        {/* Quiz */}
        <div className="flex items-center py-2 pr-3 pl-3 border-[1.5px] border-[#F3F4F6] rounded-[16px] group bg-white transition-all hover:shadow-sm hover:border-gray-200" style={{ opacity: 1 }}>
          <div className="w-[4px] h-[24px] rounded-full mr-3 shrink-0 transition-colors group-hover:shadow-[0_0_8px_rgba(123,111,231,0.5)]" style={{ backgroundColor: "#9333ea" }} />
          <div className="flex-1 flex items-center flex-wrap gap-2">
            <div className="text-[10px] font-[800] px-2 py-0.5 rounded-[6px] tracking-wider uppercase" style={{ backgroundColor: "#f3e8ff", color: "#9333ea" }}>QUIZ</div>
            <div className="text-[14px] font-[600] leading-tight text-[#111111] line-clamp-1 max-w-[200px]">Market Dynamics</div>
            <div className="bg-[#F8F9FA] text-[#7B6FE7] font-[500] text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ml-auto">~5 min</div>
          </div>
          <button className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 transition-all duration-150 ml-3 cursor-pointer border-[#E5E7EB] border-[1.5px] hover:border-[#5C4DE3] hover:bg-[#F3F0FF]"><IconLock size={16} className="text-gray-400" /></button>
        </div>
      </div>
    </div>
  </motion.div>
);

const RoadmapMockup = () => (
  <div className="bg-[#F8F9FC] rounded-3xl border border-gray-200 shadow-xl relative w-full h-auto max-h-[520px] flex flex-col overflow-hidden text-left z-10 mx-auto group">
    <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2 w-full shrink-0 h-6"></div>
    <div className="flex-1 flex overflow-hidden">
      <div className="w-[60px] md:w-[80px] bg-[#362A5C] shrink-0 flex flex-col items-center py-6 border-r border-gray-200 z-20">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#7B6FE7] text-white font-bold text-lg flex items-center justify-center mb-8 shadow-sm"><IconBook size={20} /></div>
        <div className="w-full flex flex-col gap-4 px-3 opacity-60">
          <div className="w-full h-6 md:h-8 rounded-lg bg-white/10"></div>
          <div className="w-full h-6 md:h-8 rounded-lg bg-white/20 border-l-4 border-white"></div>
          <div className="w-full h-6 md:h-8 rounded-lg bg-white/10 mt-4"></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-white flex relative">
        <div className="flex-1 flex flex-col items-center pt-8 pb-12 relative px-4">
          <motion.div 
            whileHover={{ y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)", scale: 1.01 }} 
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full max-w-sm bg-purple-100 rounded-3xl p-6 text-left relative overflow-hidden mb-16 shadow-sm border border-purple-200 cursor-pointer"
          >
            <div className="text-[#362A5C] text-xs font-bold uppercase tracking-wider mb-2">Chapter 1</div>
            <h3 className="text-xl font-black text-[#1A1A3E] leading-tight mb-3">Foundations of<br/>Entrepreneurship Economics</h3>
            <p className="text-sm text-[#362A5C] leading-relaxed max-w-[85%]">Understand what entrepreneurship economics is, why entrepreneurs exist, and how businesses create, deliver, and capture value in the economy.</p>
            <button className="absolute top-6 right-6 bg-white text-[#7B6FE7] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:scale-105 transition-transform">Start &rarr;</button>
          </motion.div>
          <div className="relative w-full max-w-xs flex flex-col items-center mt-4">
            <div className="relative z-10 flex flex-col items-center -ml-16">
              <button className="bg-white text-[#7B6FE7] border border-gray-200 shadow-sm text-[10px] font-bold px-3 py-1 rounded-full mb-3 absolute -top-10 whitespace-nowrap">Start reading</button>
              <motion.div 
                whileHover={{ y: -2, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-20 h-20 rounded-full border border-dashed border-[#7B6FE7] flex items-center justify-center p-2 mb-2 bg-white cursor-pointer"
              >
                 <div className="w-full h-full rounded-full bg-[#7B6FE7] flex items-center justify-center shadow-lg shadow-[#7B6FE7]/30 text-white">
                   <IconCheck size={28} />
                 </div>
              </motion.div>
              <div className="text-xs font-bold text-[#1A1A3E] text-center max-w-[120px]">What Is Entrepreneurship Economics?</div>
            </div>
            <svg className="absolute top-[80px] left-1/2 -ml-16 w-32 h-24 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 10 0 C 10 50, 90 50, 90 100" fill="none" stroke="#C4B5FD" strokeWidth="2" strokeDasharray="6,4" />
            </svg>
            <div className="relative z-10 flex flex-col items-center mt-8 ml-20">
              <div className="w-16 h-16 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center mb-2 shadow-sm">
                 <IconLock size={20} className="text-gray-400" />
              </div>
              <div className="text-xs font-bold text-gray-500 text-center max-w-[120px]">Why Do Entrepreneurs Exist?<br/><span className="text-[10px] font-normal text-gray-400 mt-1 block">Unlocks after Chapter 1</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ConceptsMockup = () => (
  <div className="bg-[#F8F9FC] rounded-3xl border border-gray-200 shadow-xl overflow-hidden text-left flex flex-col h-[400px] w-full shrink-0 relative">
    <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2 w-full shrink-0 h-6"></div>
    <div className="p-6 flex-1 overflow-y-auto space-y-4 bg-gray-50 flex items-center justify-center gap-6">
       {/* Card 1 */}
       <motion.div 
         className="block shrink-0" 
         style={{ width: "260px", minHeight: "220px" }}
         whileHover={{ y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
         transition={{ duration: 0.2, ease: "easeInOut" }}
       >
         <div className="relative w-full h-full min-h-[220px] p-6 rounded-[20px] cursor-pointer bg-white flex flex-col border-y border-r border-gray-100 border-l-[5px] transition-all duration-200 ease-out border-l-green-700 shadow-sm -translate-y-1">
           <div className="absolute inset-0 rounded-[20px] bg-white/60 z-20 pointer-events-none" />
           <div className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: "#15803D" }}>
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
           </div>
           <div className="relative z-10 flex flex-col h-full">
             <div className="flex items-start justify-between mb-4">
               <span className="text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-lg" style={{ color: "#15803D", backgroundColor: "#15803D14" }}>LESSON 1</span>
             </div>
             <div className="mb-4"><IconBulb size={24} className="text-gray-600" /></div>
             <h4 className="font-bold text-[15px] leading-tight mb-2 text-[#111827] line-clamp-2">Value Creation</h4>
             <div className="flex flex-col gap-1 mb-2">
               <div className="flex items-center gap-1.5 text-gray-500"><IconClock size={14} /><span className="text-[12px] font-medium">5-10 mins read</span></div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#D1D5DB" }} /><span className="text-[12px] text-gray-500 font-medium">Completed</span></div>
             </div>
             <div className="mt-auto flex items-center gap-2 pt-4 border-t border-gray-100">
               <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#15803D" }} />
               <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: "#111827" }}>COMPLETED</span>
             </div>
           </div>
         </div>
       </motion.div>
    </div>
  </div>
);

const ArticlesMockup = () => (
  <div className="bg-[#F8F9FC] rounded-3xl border border-gray-200 shadow-xl overflow-hidden text-left flex flex-col h-[400px] w-full shrink-0 relative">
    <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2 w-full shrink-0 h-6"></div>
    <div className="p-6 flex-1 flex items-center justify-center bg-gray-50 flex-nowrap overflow-x-auto snap-x px-6 gap-4">
       <motion.div 
         whileHover={{ y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
         className="w-[280px] group block bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col cursor-pointer shrink-0 snap-center"
       >
         <div className="mb-4">
           <span className="inline-block bg-[rgba(200,217,230,0.4)] text-[#4ebdd5] text-xs font-bold px-2 py-1 rounded-full">Network Effects</span>
         </div>
         <h2 className="font-semibold text-[#0096a5] text-lg leading-snug mb-2 group-hover:text-[#4ebdd5] transition-colors">How AirBnB Hacked Network Effects</h2>
         <p className="text-[#4ebdd5] text-sm mt-2 line-clamp-3 mb-6 flex-1">Understanding the critical mass required for a two-sided marketplace to become defensible.</p>
         <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
           <span className="text-[#4ebdd5] text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">Read more <span className="ml-1">→</span></span>
         </div>
       </motion.div>
       <motion.div 
         whileHover={{ y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
         className="w-[280px] group block bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col cursor-pointer shrink-0 snap-center"
       >
         <div className="mb-4">
           <span className="inline-block bg-purple-50 text-purple-600 text-xs font-bold px-2 py-1 rounded-full">Unit Economics</span>
         </div>
         <h2 className="font-semibold text-purple-700 text-lg leading-snug mb-2 group-hover:text-purple-500 transition-colors">Why Uber Still Bleeds Cash</h2>
         <p className="text-purple-500 text-sm mt-2 line-clamp-3 mb-6 flex-1">A deep dive into structural margins and why growth doesn't always equal profitability.</p>
         <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
           <span className="text-purple-600 text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">Read more <span className="ml-1">→</span></span>
         </div>
       </motion.div>
       <motion.div 
         whileHover={{ y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
         className="w-[280px] group block bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col cursor-pointer shrink-0 snap-center"
       >
         <div className="mb-4">
           <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">Monopoly</span>
         </div>
         <h2 className="font-semibold text-blue-700 text-lg leading-snug mb-2 group-hover:text-blue-500 transition-colors">Competition is for Losers</h2>
         <p className="text-blue-500 text-sm mt-2 line-clamp-3 mb-6 flex-1">Why capturing 100% of a small market is better than 1% of a large market.</p>
         <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
           <span className="text-blue-600 text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">Read more <span className="ml-1">→</span></span>
         </div>
       </motion.div>
    </div>
  </div>
);`;

let content = fs.readFileSync('app/(marketing)/page.tsx', 'utf-8');

// The file is corrupted between line 16 and 58. I will use string replace to replace the corrupted block.
const startMarker = `const ScrollReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (\\n  <motion.div \\n         whileHover={{ y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}`;
const startRegex = /const ScrollReveal[\s\S]*?<\/motion\.div>\s*<\/div>\s*<\/div>\s*\);/;

content = content.replace(startRegex, missingComponents);

fs.writeFileSync('app/(marketing)/page.tsx', content, 'utf-8');
console.log("Restored components successfully.");
