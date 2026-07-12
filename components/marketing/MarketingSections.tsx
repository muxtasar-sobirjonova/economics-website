import { IconTrophy, IconTarget, IconChartLine, IconFlame, IconBulb } from '@tabler/icons-react';
import { ScrollReveal } from './ScrollReveal';
import { RoadmapMockup } from './RoadmapMockup';
import { ConceptsMockup } from './ConceptsMockup';
import { ArticlesMockup } from './ArticlesMockup';
import { FlashcardMockup } from './FlashcardMockup';
import { Eyebrow } from './Eyebrow';
import { SectionHeading } from './SectionHeading';
import { FeatureCard } from './FeatureCard';
import { FaqAccordion } from './FaqAccordion';

export const MarketingSections = () => (
  <>
    <section id="roadmap" className="py-20 md:py-24 bg-gray-50 border-y border-gray-100 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <ScrollReveal delay={0.2} className="order-2 md:order-1 flex justify-center w-full">
             <RoadmapMockup />
          </ScrollReveal>
          <ScrollReveal delay={0} className="order-1 md:order-2 text-left">
            <Eyebrow>Your Personal Study Plan</Eyebrow>
            <SectionHeading>Stop guessing. Start learning.</SectionHeading>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Every day, we build a personalized agenda for you—so you know exactly where to pick up.
            </p>
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex gap-4 transition-shadow hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-500 flex items-center justify-center shrink-0">
                <IconTrophy size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">Earn XP & Climb Leagues</h4>
                <p className="text-gray-600 leading-relaxed text-sm">Earn XP, climb the leaderboards, and unlock advanced concepts as you progress.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <section id="concepts" className="py-20 md:py-24 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <ScrollReveal delay={0} className="text-left">
            <Eyebrow>Core Concepts</Eyebrow>
            <SectionHeading>Build a Robust Mental Model.</SectionHeading>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Master the economic fundamentals that drive modern startups. We distill complex theories into actionable, bite-sized lessons.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2} className="flex justify-center w-full">
            <ConceptsMockup />
          </ScrollReveal>
        </div>
      </div>
    </section>

    <section id="articles" className="py-20 md:py-24 bg-gray-50 border-y border-gray-100 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <ScrollReveal delay={0.2} className="order-2 md:order-1 flex justify-center w-full">
            <ArticlesMockup />
          </ScrollReveal>
          <ScrollReveal delay={0} className="order-1 md:order-2 text-left">
            <Eyebrow>Case Study Driven</Eyebrow>
            <SectionHeading>Applied Case Studies.</SectionHeading>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Move beyond dry textbooks. Analyze how legendary startups won markets using these core economic principles.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <section id="quizzes" className="py-20 md:py-24 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <ScrollReveal delay={0} className="text-left">
            <Eyebrow>Active Recall & Assessment</Eyebrow>
            <SectionHeading>Mastery through Assessment.</SectionHeading>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Get instant feedback and target your weak spots with our dedicated <strong>Mistake Review</strong>.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2} className="text-left">
            <div className="flex items-start gap-5 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm w-full cursor-pointer">
               <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                 <IconBulb size={28} />
               </div>
               <div>
                 <h4 className="font-bold text-slate-900 text-lg mb-2">Targeted Mistake Review</h4>
                 <p className="text-gray-600 leading-relaxed">Unlike standard quizzes, we isolate your knowledge gaps to help you focus on what matters.</p>
               </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <section id="my-notes" className="py-20 md:py-24 bg-gray-50 border-y border-gray-100 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <ScrollReveal delay={0.2} className="order-2 md:order-1 flex justify-center w-full">
            <FlashcardMockup />
          </ScrollReveal>
          <ScrollReveal delay={0} className="order-1 md:order-2 text-left">
            <Eyebrow>Spaced Repetition Notes</Eyebrow>
            <SectionHeading>Highlight it. Save it. Never forget it.</SectionHeading>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Turn any concept or article into a note with one click, then review your notes like flashcards — organized by the day you learned them.
            </p>
          </ScrollReveal>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-32">
          <ScrollReveal delay={0} className="text-left">
             <Eyebrow>Active Recall</Eyebrow>
             <SectionHeading>Review with Intent.</SectionHeading>
             <p className="text-xl text-gray-600 leading-relaxed">
               Our integrated spaced-repetition system ensures long-term retention of every concept. Stop reading. Start remembering.
             </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2} className="flex justify-center w-full">
             <FlashcardMockup />
          </ScrollReveal>
        </div>
      </div>
    </section>

    <section className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal delay={0} className="mb-12 text-center max-w-3xl mx-auto">
          <Eyebrow>Our Approach</Eyebrow>
          <SectionHeading align="center">Why Choose That's So Econ?</SectionHeading>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScrollReveal delay={0.1}>
            <FeatureCard 
              icon={<IconTarget size={28} stroke={2} />} 
              title="Learn by doing, not memorizing" 
              description="Interactive modules designed for practical application in business building."
              colorClass="text-brand-primary" bgClass="bg-purple-50"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <FeatureCard 
              icon={<IconChartLine size={28} stroke={2} />} 
              title="Real case studies, not just theory" 
              description="See how fundamental economics drives success in actual startups and markets."
              colorClass="text-brand-primary" bgClass="bg-purple-50"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <FeatureCard 
              icon={<IconFlame size={28} stroke={2} />} 
              title="A study plan that adapts daily" 
              description="Your custom agenda is built for you every morning. Just log in and learn."
              colorClass="text-brand-primary" bgClass="bg-purple-50"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>

    <section className="py-20 md:py-24 bg-gray-50 border-y border-gray-100">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal delay={0} className="bg-white rounded-3xl p-10 md:p-14 border border-gray-200 shadow-sm relative">
          <div className="absolute -top-6 -left-6 text-gray-200">
            <svg width="80" height="80" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
          </div>
          <div className="relative z-10 text-left">
            <p className="text-xl md:text-2xl text-slate-900 font-medium leading-relaxed mb-8">
              "We built That's So Econ to bridge the gap between academic theory and real-world venture building. Traditional education is often disconnected from the speed of the startup world. We provide the fastest path to building a powerful mental model for business."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-200 flex shrink-0"></div>
              <div>
                <div className="font-bold text-slate-900">The Team</div>
                <div className="text-gray-600 text-sm">Founders</div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>

    <section className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
         <ScrollReveal delay={0} className="text-center mb-12 max-w-3xl mx-auto">
           <Eyebrow>Support</Eyebrow>
           <SectionHeading align="center">Frequently Asked Questions</SectionHeading>
           <p className="text-xl text-gray-600">Everything you need to know about the platform.</p>
         </ScrollReveal>
         <ScrollReveal delay={0.2} className="w-full">
           <FaqAccordion />
         </ScrollReveal>
      </div>
    </section>
  </>
);
