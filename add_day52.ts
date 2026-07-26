import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 52;
  const tag = "Week 8";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>Several of the engineers who built Skype's earliest technology went on to fund, advise, or found a wave of other Estonian startups after the company's success. One nineteen-year-old founder used exactly that network to build a global ride-hailing company from a country most of the world had barely heard of as a tech hub.</p>

<p><strong>Access to capital</strong>, at the ecosystem level, isn't just about how much money exists in a region — it's about whether that money is held by people who understand the specific, local conditions of building a company there, and are willing to fund an unproven founder before there's much evidence to go on. <strong>Ecosystem density</strong> describes how concentrated experienced founders, operators, and investors are within a region relative to its size.</p>

<p>This is where a single earlier success can matter far more than its own outcome suggests. When a generation of employees from one successful company — Skype, in Estonia's case — stays locally engaged as founders, advisors, and angel investors rather than leaving the region entirely, their <em>experience and capital recycle directly into the next generation</em> of local startups. Local investors who've personally lived through building and scaling a technology company from that exact country understand its specific regulatory, market, and talent conditions far better than a distant international investor unfamiliar with the local context — making them more willing, and often better positioned, to fund an early, unproven founder.</p>

<p>This is a different, narrower mechanism than the broader idea of an "innovation ecosystem" covered elsewhere in this unit. It isn't about universities or general infrastructure. It's specifically about whether the people who succeeded once stick around to <u>fund and mentor the people trying to succeed next</u> — a factor that depends on individual choices as much as on any policy, and one no government can simply legislate into existence.</p>`;

  const conceptSummary = `Access to capital at the ecosystem level depends on whether local investors understand the specific conditions of building a company in that region, not just on how much money exists. Ecosystem density describes how concentrated experienced founders and investors are relative to a region's size. A single earlier success recycles capital and mentorship into the next generation only if its people stay locally engaged rather than leaving — a factor policy alone can't fully guarantee.`;

  const conceptTakeaways = [
    "Access to capital at the ecosystem level depends on whether local investors understand the specific regional conditions of building a company.",
    "Ecosystem density describes how concentrated experienced founders and investors are relative to a region's population size.",
    "A single earlier success can seed access to capital for an entire next generation of local founders.",
    "This depends on the earlier generation staying locally engaged as mentors and investors, rather than leaving the region.",
    "This capital-recycling effect depends on individual choices as much as on institutional policy."
  ];

  const articleTitle = "How One Teenager Used Estonia's Biggest Tech Exit to Build Its Next One";
  
  const articleText = `<p><strong>How does a nineteen-year-old in a small Baltic country raise the funding to build a company that would eventually compete with global ride-hailing giants?</strong></p>

<p>Bolt was founded in 2013 by Markus Villig, then still a teenager, in Estonia. By that point, the country's tech scene was already unusually dense, thanks to the earlier success of Skype — whose Estonian engineering team had, by then, produced a wave of experienced local operators and investors with real capital and real operating experience to share.</p>

<p><strong>What specifically is the \"Skype Mafia\" effect, and why does it matter here?</strong></p>

<p>Many early Skype engineers and employees, following the company's success and subsequent acquisitions, went on to found, advise, or invest in a new generation of Estonian startups. This effectively <em>recycled the capital and hard-won operating experience</em> from one major success directly into the next generation of local founders, rather than that experience and money leaving the country or sitting idle.</p>

<p><strong>Why does this matter more for access to capital specifically, rather than just general business advice?</strong></p>

<p>Because experienced local investors who've already lived through building and scaling a technology company from Estonia specifically <u>understand the country's unique regulatory environment</u>, talent pool, and market conditions. That understanding makes them more willing, and better positioned, to fund an early, unproven local founder than a distant international investor unfamiliar with those specific local conditions would be.</p>

<p><strong>If this density effect is this powerful, why don't more small countries deliberately try to create their own version of it after any earlier success?</strong></p>

<p>Because the effect depends on the earlier generation's key people actually <u>staying locally engaged</u> — as mentors, angels, advisors — rather than leaving the country or cashing out and disengaging entirely. That's a factor shaped by individual choices as much as by institutional conditions, and no policy can fully guarantee it will happen after any given success story.</p>

<p><strong>If you were an experienced local operator from an earlier successful startup, deciding whether to stay engaged mentoring and investing in your home country's next generation of founders, or move abroad to a larger, more established tech hub, what would this lesson suggest is at stake in that choice?</strong></p>

<p>Staying engaged locally directly seeds and strengthens the next generation's access to capital and experienced guidance, potentially producing the country's next major success story. Leaving removes exactly that density effect for the founders who remain — an outcome that depends entirely on <em>individual decisions like this one, made repeatedly</em> across an entire generation of successful operators.</p>

<p><strong>So was Bolt's early access to capital really about Estonia's overall economy — or about one earlier company's success translating directly into the next founder's opportunity?</strong></p>

<p>Estonia's small population alone wouldn't predict this outcome. The specific, concentrated recycling of one earlier company's talent and capital into the next generation of founders is what actually explains it.</p>`;

  const articleSummary = `Bolt was founded in 2013 by nineteen-year-old Markus Villig in Estonia, a country whose tech scene had already been shaped by the "Skype Mafia" effect — Skype's earlier success producing a generation of experienced local operators and investors who stayed engaged funding and mentoring new founders. This capital and experience recycling gave Bolt access to informed, locally-understanding capital that a distant international investor might not have provided as readily at such an early stage.`;

  const articleTakeaways = [
    "Bolt was founded in 2013 by Markus Villig, a teenager at the time, in Estonia.",
    "Estonia's tech ecosystem was already shaped by the \"Skype Mafia\" effect from an earlier major success.",
    "Many former Skype employees stayed locally engaged as founders, advisors, and investors after the company's success.",
    "Locally experienced investors understand a region's specific conditions better than distant, unfamiliar international investors.",
    "This capital-recycling effect depends on the earlier generation choosing to stay locally engaged, not on policy alone."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Access to Capital & Ecosystem Density",
        conceptText,
        conceptSummary,
        conceptTakeaways,
        articleTitle,
        articleText,
        articleSummary,
        articleTakeaways,
        tag // Sync the tag to Week 8
      }
    });
    console.log(`Updated lesson content for day ${dayOrder}`);
  }

  // Quizzes
  const quiz = await prisma.quiz.findFirst({ where: { dayOrder } });
  
  if (quiz) {
    // Delete existing questions
    await prisma.quizQuestion.deleteMany({
      where: { quizId: quiz.id }
    });

    const questions = [
      {
        questionText: "What does \"access to capital\" mean at the ecosystem level, per this lesson?",
        options: [
          "The total amount of money that exists anywhere in a country",
          "Whether local investors understand the specific regional conditions of building a company there and are willing to fund unproven founders",
          "A government program that distributes funding equally to all businesses",
          "The interest rate charged on business loans nationwide"
        ],
        correctAnswer: "Whether local investors understand the specific regional conditions of building a company there and are willing to fund unproven founders",
        explanation: "this is the lesson's exact framing. A, C, and D are fabricated or oversimplified claims."
      },
      {
        questionText: "What is \"ecosystem density,\" as defined in this lesson?",
        options: [
          "The total land area of a country's tech industry",
          "How concentrated experienced founders, operators, and investors are within a region relative to its size",
          "The number of laws regulating startups in a given country",
          "The total population of a country regardless of its economic activity"
        ],
        correctAnswer: "How concentrated experienced founders, operators, and investors are within a region relative to its size",
        explanation: "this is the exact definition given. A, C, and D are fabricated or unrelated claims."
      },
      {
        questionText: "What is the \"Skype Mafia\" effect, according to this lesson?",
        options: [
          "A criminal organization operating within the technology industry",
          "The phenomenon of former Skype employees staying locally engaged, founding, advising, and investing in a new generation of Estonian startups",
          "A government policy requiring former employees to invest in new companies",
          "A marketing term with no real economic significance"
        ],
        correctAnswer: "The phenomenon of former Skype employees staying locally engaged, founding, advising, and investing in a new generation of Estonian startups",
        explanation: "this is the lesson's exact description. A, C, and D are fabricated or dismissive claims."
      },
      {
        questionText: "According to this lesson, why do locally experienced investors matter more for early-stage founders than distant international investors?",
        options: [
          "Because local investors are always legally required to invest in local companies",
          "Because they understand the specific regulatory, market, and talent conditions of that region, making them more willing and better positioned to fund unproven local founders",
          "Because international investors are prohibited from funding foreign startups",
          "Because local investors always offer larger checks than international ones"
        ],
        correctAnswer: "Because they understand the specific regulatory, market, and talent conditions of that region, making them more willing and better positioned to fund unproven local founders",
        explanation: "this is the lesson's direct explanation. A, C, and D are fabricated or unsupported claims."
      },
      {
        questionText: "You're an experienced operator from an earlier successful local startup, deciding whether to stay engaged mentoring and investing in your home country's next generation of founders or move abroad. Based on this lesson, what is at stake in this specific choice?",
        options: [
          "Nothing — your individual decision has no bearing on the broader ecosystem",
          "Staying engaged directly seeds the next generation's access to capital and experienced guidance, while leaving removes exactly that density effect for founders who remain",
          "The decision only affects your own personal finances with no wider economic consequence",
          "Government policy will automatically replace your role regardless of your choice"
        ],
        correctAnswer: "Staying engaged directly seeds the next generation's access to capital and experienced guidance, while leaving removes exactly that density effect for founders who remain",
        explanation: "this reflects the lesson's central argument about individual choices shaping ecosystem density. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "You're a founder in a country that has never had a major successful local tech exit, considering how to access early-stage capital. Based on this lesson, what challenge are you likely to face that a founder in an ecosystem with a prior success wouldn't?",
        options: [
          "No meaningful difference — access to capital is identical regardless of prior local successes",
          "A likely lack of locally experienced investors who understand your specific regional conditions well enough to confidently fund an unproven idea",
          "A legal requirement preventing you from raising any capital at all",
          "An automatic disqualification from all international funding sources"
        ],
        correctAnswer: "A likely lack of locally experienced investors who understand your specific regional conditions well enough to confidently fund an unproven idea",
        explanation: "this reflects the lesson's core argument about the value of locally experienced capital. A, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "A country experiences one major tech company's successful exit. Many of that company's early employees go on to found, advise, and invest in new local startups over the following decade. Based on this lesson, what effect would this most likely have on the country's overall access to capital for new founders?",
        options: [
          "No effect, since one company's success has no bearing on future access to capital",
          "An increase, since the recycled experience and capital from that success directly seeds funding and mentorship for the next generation of founders",
          "A decrease, since successful founders always leave the country immediately after an exit",
          "An effect limited exclusively to the original company's direct employees"
        ],
        correctAnswer: "An increase, since the recycled experience and capital from that success directly seeds funding and mentorship for the next generation of founders",
        explanation: "this is a direct application of the lesson's core \"capital recycling\" argument. A, C, and D contradict this reasoning."
      },
      {
        questionText: "Two regions each experience a major local tech success. In Region A, most of the successful company's early employees stay locally engaged as investors and mentors. In Region B, most of them relocate abroad and disengage from the local ecosystem. Based on this lesson, which region is more likely to see its next generation of founders benefit from stronger access to capital?",
        options: [
          "Region B, since relocating abroad always increases access to capital for a home region",
          "Region A, since the earlier generation staying locally engaged is what allows their experience and capital to recycle into new local startups",
          "Neither region's outcome is affected by whether the earlier generation stays or leaves",
          "Both regions will see identical outcomes regardless of where the earlier generation ends up"
        ],
        correctAnswer: "Region A, since the earlier generation staying locally engaged is what allows their experience and capital to recycle into new local startups",
        explanation: "this is a direct application of the lesson's central argument, mirroring the Skype-to-Bolt example. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "An international investor unfamiliar with a specific country's regulatory and market conditions is comparing an investment opportunity there to a local investor with direct experience building a company in that same country. Based on this lesson, which investor is more likely to confidently fund an early, unproven local founder, and why?",
        options: [
          "The international investor, since larger, more established funds always outperform local ones",
          "The local investor, since their direct experience with the region's specific conditions makes them better positioned to evaluate and fund an unproven early-stage founder",
          "Neither investor's local knowledge has any bearing on their willingness to fund early-stage founders",
          "Both investors are equally likely to invest regardless of their familiarity with local conditions"
        ],
        correctAnswer: "The local investor, since their direct experience with the region's specific conditions makes them better positioned to evaluate and fund an unproven early-stage founder",
        explanation: "this is a direct application of the lesson's core reasoning about locally informed capital. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A small country produces its first major tech success, and government officials wonder whether they can guarantee a repeat of this outcome through policy alone. Based on this lesson, what should they understand about this expectation?",
        options: [
          "Policy alone can fully guarantee the same outcome will repeat, regardless of individual choices",
          "The recycling effect depends significantly on individual choices — whether the earlier generation's people choose to stay locally engaged — which no single policy can fully guarantee",
          "Government policy has no relationship whatsoever to ecosystem density or access to capital",
          "A repeat outcome is impossible under any circumstances after a single success"
        ],
        correctAnswer: "The recycling effect depends significantly on individual choices — whether the earlier generation's people choose to stay locally engaged — which no single policy can fully guarantee",
        explanation: "this reflects the lesson's honest acknowledgment of the limits of policy in this specific mechanism. A, C, and D all contradict or overstate this reasoning."
      }
    ];

    for (let i = 0; i < questions.length; i++) {
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          questionText: questions[i].questionText,
          options: questions[i].options,
          correctAnswer: questions[i].correctAnswer,
          explanation: questions[i].explanation,
          order: i + 1,
        }
      });
    }
    console.log(`Updated quiz questions for day ${dayOrder}`);
  }
  console.log("Done.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
