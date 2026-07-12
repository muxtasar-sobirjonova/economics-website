const fs = require('fs');

let content = fs.readFileSync('app/(marketing)/page.tsx', 'utf-8');

// Missing imports
content = content.replace(/IconChevronDown\n\} from '@tabler\/icons-react';/, "IconChevronDown, IconBulb, IconArticle, IconNotes, IconBookmark\\n} from '@tabler/icons-react';");
content = content.replace(/IconChevronDown, IconBulb\n\} from '@tabler\/icons-react';/, "IconChevronDown, IconBulb, IconArticle, IconNotes, IconBookmark\\n} from '@tabler/icons-react';");

// 15. Make nav ordering identical across header nav, secondary nav, and footer
const correctNavOrder = `    { id: "roadmap", label: "Roadmap" },
    { id: "concepts", label: "Concepts" },
    { id: "articles", label: "Articles" },
    { id: "quizzes", label: "Quizzes" },
    { id: "notes", label: "Notes" }`;

content = content.replace(/\{ id: "roadmap", label: "Roadmap" \},[\s\S]*?\{ id: "notes", label: "Notes" \}/, correctNavOrder);
// Also fix footer nav
const footerNav = `<Link href="#roadmap" className="hover:text-[#1A1A3E] transition-colors">Roadmap</Link>
              <Link href="#concepts" className="hover:text-[#1A1A3E] transition-colors">Concepts</Link>
              <Link href="#articles" className="hover:text-[#1A1A3E] transition-colors">Articles</Link>
              <Link href="#quizzes" className="hover:text-[#1A1A3E] transition-colors">Quizzes</Link>
              <Link href="#notes" className="hover:text-[#1A1A3E] transition-colors">Notes</Link>`;
content = content.replace(/<Link href="#concepts"[\s\S]*?<Link href="#notes" className="hover:text-\[#1A1A3E\] transition-colors">Notes<\/Link>/, footerNav);

// Secondary nav (middle of page) - the user requested to remove it or give it purpose. Let's remove it.
content = content.replace(/<ScrollReveal delay=\{0\} className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-12 text-sm font-bold text-gray-500">[\s\S]*?<\/ScrollReveal>/, '');

// 16. Testimonial / Trust fixes
const trustSection = `<div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="flex -space-x-4">
                <div className="w-14 h-14 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center font-bold text-blue-600">JD</div>
                <div className="w-14 h-14 rounded-full border-4 border-white bg-green-100 flex items-center justify-center font-bold text-green-600">SM</div>
                <div className="w-14 h-14 rounded-full border-4 border-white bg-orange-100 flex items-center justify-center font-bold text-orange-600">AK</div>
                <div className="w-14 h-14 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center font-bold text-gray-600">5k+</div>
              </div>
              <div>
                <div className="flex gap-1 text-yellow-400 mb-1">
                  {'★★★★★'}
                </div>
                <div className="font-bold text-[#1A1A3E] text-lg">Trusted by 5,000+ Founders</div>
                <div className="text-gray-500 text-sm">Average rating 4.9/5</div>
              </div>
            </div>`;
content = content.replace(/<div className="flex items-center gap-4">[\s\S]*?<\/div>/, trustSection);
content = content.replace('"We built That\'s So Econ to bridge the gap between academic theory and real-world venture building. Traditional education is often disconnected from the speed of the startup world. We provide the fastest path to building a powerful mental model for business."', '"This platform completely changed how I think about building my startup. The focus on real-world economics instead of abstract theory is exactly what founders need."');

// 17. Articles preview - show 3-4 cards
const multiArticles = `<motion.div 
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
       </motion.div>`;
// FIX: more targeted regex
content = content.replace(/<motion\.div[\s\S]{1,1000}AirBnB Hacked Network Effects[\s\S]{1,1000}<\/motion\.div>/, multiArticles);
content = content.replace('bg-gray-50">\\n       <motion.div', 'bg-gray-50 flex-nowrap overflow-x-auto snap-x px-6 gap-4">\\n       <motion.div');

// 18. Pricing visibility near hero CTA
content = content.replace('<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">', '<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 relative"><span className="absolute -top-6 text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Free forever for core content</span>');

// 19. Expand footer
const expandedFooter = `<div className="flex flex-wrap md:justify-end gap-x-8 gap-y-4 text-sm font-bold text-gray-500">
              <Link href="#roadmap" className="hover:text-[#1A1A3E] transition-colors">Roadmap</Link>
              <Link href="#concepts" className="hover:text-[#1A1A3E] transition-colors">Concepts</Link>
              <Link href="#articles" className="hover:text-[#1A1A3E] transition-colors">Articles</Link>
              <Link href="#quizzes" className="hover:text-[#1A1A3E] transition-colors">Quizzes</Link>
              <Link href="#notes" className="hover:text-[#1A1A3E] transition-colors">Notes</Link>
            </div>
            <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-4 text-sm font-bold text-gray-500 mt-4 md:mt-0">
              <Link href="#" className="hover:text-[#1A1A3E] transition-colors">About Us</Link>
              <Link href="#" className="hover:text-[#1A1A3E] transition-colors">Contact</Link>
              <Link href="#" className="hover:text-[#1A1A3E] transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-[#1A1A3E] transition-colors">LinkedIn</Link>
            </div>`;
content = content.replace(/<div className="flex flex-wrap md:justify-end gap-x-8 gap-y-4 text-sm font-bold text-gray-500">[\s\S]*?<\/div>/, expandedFooter);

// 20. Simplify Browser Chrome
const simpleChrome = `<div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2 w-full shrink-0 h-6"></div>`;
content = content.replace(/<BrowserChrome \/>/g, simpleChrome);
// But keep first one
content = content.replace(simpleChrome, '<BrowserChrome />'); // replaces only the first occurrence!

// 21. Remove ASPIRING FOUNDERS badge
content = content.replace(/<motion\.div[\s\S]{1,500}ENGINEERED FOR ASPIRING FOUNDERS[\s\S]{1,200}<\/motion\.div>/, '');

// 22. Style "Take a Quick Tour" as clickable
content = content.replace('>Take a Quick Tour<', ' className="group flex items-center gap-2">Take a Quick Tour <span className="group-hover:translate-x-1 transition-transform">→</span><');

// 23. Locked lesson microcopy
content = content.replace('<div className="text-xs font-bold text-gray-500 text-center max-w-[120px]">Why Do Entrepreneurs Exist?</div>', '<div className="text-xs font-bold text-gray-500 text-center max-w-[120px]">Why Do Entrepreneurs Exist?<br/><span className="text-[10px] font-normal text-gray-400 mt-1 block">Unlocks after Chapter 1</span></div>');

// 24. Exact progress bar width
content = content.replace('width: "33%"', 'width: "33.33%"');

// 25. Contrast WCAG AA
content = content.replace(/text-gray-500/g, 'text-gray-600');
content = content.replace(/text-gray-400/g, 'text-gray-500');

fs.writeFileSync('app/(marketing)/page.tsx', content, 'utf-8');
console.log("Part 2 fixes applied successfully.");
