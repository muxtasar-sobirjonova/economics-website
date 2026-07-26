import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 38;
  const tag = "Week 6";

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>In 2007, BlackBerry devices were carried by the President of the United States, world leaders across the globe, and roughly half of America's corporate workforce. A decade later, the company's phone business was essentially gone. Nobody at the company failed to notice the market was changing. That's exactly what makes this case worth studying closely.</p>

<p><strong>Learning from failure</strong> means extracting an accurate, specific lesson from what actually went wrong — not simply acknowledging that failure happened, and not drawing an overly broad or comfortable lesson that avoids the real cause. Companies that survive repeated market shifts tend to be the ones that correctly diagnose <em>why</em> they failed, not just <em>that</em> they failed.</p>

<p>This is where <strong>diagnosis error</strong> becomes the more useful concept than "failure" itself. A company can clearly see the market changing — new competitors, new technology, new customer behavior — and still fail, because it <u>misidentifies which specific customer preference</u> is actually shifting. Seeing change and correctly diagnosing what's changing are two different skills, and the second one is much harder.</p>

<p>The uncomfortable implication is that failure teaches nothing automatically. The exact same failure can produce completely different lessons depending on how honestly a company examines its own specific mistake. A company that concludes "the market became unpredictable" learns almost nothing useful. A company that concludes <em>"we assumed our existing strength would remain decisive, and we never tested that assumption against a specific emerging alternative"</em> has actually learned something it can act on the next time a competitor's product looks, at first glance, like it isn't a real threat.</p>`;

  const conceptSummary = `Learning from failure means extracting an accurate, specific lesson about what actually went wrong, not just acknowledging that failure occurred. A "diagnosis error" happens when a company sees the market changing but misidentifies which specific customer preference is actually shifting — seeing change and correctly diagnosing it are different skills. The same failure can teach nothing or something valuable, depending entirely on how honestly the specific cause is examined afterward.`;

  const conceptTakeaways = [
    "Learning from failure means diagnosing the specific cause of what went wrong, not just acknowledging that failure happened.",
    "A \"diagnosis error\" occurs when a company sees the market changing but misidentifies which specific preference is shifting.",
    "Seeing change coming and correctly diagnosing what's actually changing are two separate, distinct skills.",
    "Failure doesn't automatically teach anything — the lesson depends entirely on how honestly the specific cause is examined.",
    "A vague lesson (\"the market became unpredictable\") is far less useful than a specific one an untested assumption produced."
  ];

  const articleTitle = "How the Phone Every World Leader Carried Lost Almost Everything in a Decade";
  
  const articleText = `<p><strong>How does a company whose phone the U.S. President carried lose nearly its entire market within about a decade?</strong></p>

<p>BlackBerry, made by Research In Motion, dominated smartphone and enterprise email use through the mid-2000s, widely adopted in corporate and government settings and valued specifically for its physical keyboard and enterprise-grade security and IT control. By the mid-2010s, that dominance had largely evaporated, and the company's phone business was a shadow of what it had been.</p>

<p><strong>What specifically did BlackBerry's leadership believe would keep the company on top, and why did that belief turn out to be wrong?</strong></p>

<p>Leadership reportedly believed the physical keyboard and enterprise security remained the durable core of the company's value proposition, and treated the iPhone's 2007 touchscreen-first, consumer-app-centric approach as an unproven consumer gadget rather than a genuine threat to BlackBerry's core enterprise market. That wasn't blindness — it was a <em>specific, testable assumption that went unchallenged for too long</em>.</p>

<p><strong>If BlackBerry clearly saw competitors changing the market, why didn't seeing the change save the company?</strong></p>

<p>This is the diagnosis-error point precisely. BlackBerry wasn't blind to the market shifting — its leadership was aware of the iPhone and its early traction. What failed was the <u>specific diagnosis of which preference was shifting</u>: the company assumed the keyboard and security would remain decisive, rather than recognizing that users increasingly wanted personal devices with rich third-party app ecosystems, even at some cost to the exact strengths BlackBerry had built its whole business around.</p>

<p><strong>What lesson should a company actually draw from watching a competitor's \"unproven\" product start succeeding?</strong></p>

<p>The useful lesson is specific: identify precisely which customer preference the new product represents, and test that assumption directly against your own most confident belief about your customers — rather than concluding that your existing strengths will simply remain decisive because they always have been. BlackBerry's leadership drew the second, more comfortable lesson, and it cost the company its dominant position.</p>

<p><strong>If you were a BlackBerry executive in 2008, watching the iPhone gain consumer traction while your enterprise customers still preferred physical keyboards, would you have stayed the course — or begun urgently testing whether consumer touchscreen preferences would eventually reach your core customers too?</strong></p>

<p>Staying the course protects a real, currently strong customer base that had been loyal for years. Testing the assumption directly requires admitting that your current strength might not be permanent — a <u>much harder organizational and emotional move</u>, especially while the existing business still looks completely healthy on every visible metric.</p>

<p><strong>So was BlackBerry's real bet about smartphone technology — or about which side of an expected-value calculation to stand on?</strong></p>

<p>The company's leadership generally understood the market was shifting. What failed was the specific diagnosis of <em>what</em> was actually shifting — exactly the distinction this lesson's concept is built around, and exactly why "we saw it coming" isn't the same thing as learning anything useful from a failure.</p>`;

  const articleSummary = `BlackBerry dominated smartphones and enterprise email through the mid-2000s, built around its physical keyboard and enterprise security. Leadership saw the iPhone's 2007 launch but diagnosed it as an unproven consumer gadget rather than a genuine threat, assuming its own core strengths would remain decisive. The company's decline illustrates a diagnosis error — correctly noticing the market was changing while misidentifying which specific customer preference was actually shifting.`;

  const articleTakeaways = [
    "BlackBerry dominated smartphone and enterprise email use through the mid-2000s, built around its physical keyboard and enterprise security.",
    "Leadership was aware of the iPhone's 2007 launch but treated it as an unproven consumer product, not a genuine threat.",
    "The company's core failure was assuming its existing strengths (keyboard, security) would remain decisive regardless of shifting preferences.",
    "The real shift was toward touchscreen devices and rich app ecosystems, a preference BlackBerry's leadership underestimated.",
    "The company's decline illustrates a diagnosis error — seeing change occur while misidentifying which specific preference was actually shifting."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Learning from Failure",
        conceptText,
        conceptSummary,
        conceptTakeaways,
        articleTitle,
        articleText,
        articleSummary,
        articleTakeaways,
        tag // Sync the tag to Week 6
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
        questionText: "What does \"learning from failure\" mean, as defined in this lesson?",
        options: [
          "Simply acknowledging that a failure occurred",
          "Extracting an accurate, specific lesson about what actually went wrong, rather than a vague or overly broad conclusion",
          "Avoiding any further analysis of a failure once it has happened",
          "Assuming all failures are caused by factors outside a company's control"
        ],
        correctAnswer: "Extracting an accurate, specific lesson about what actually went wrong, rather than a vague or overly broad conclusion",
        explanation: "this is the exact definition given. A, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "What is a \"diagnosis error,\" according to this lesson?",
        options: [
          "A medical mistake made by a company's healthcare provider",
          "A situation where a company sees the market changing but misidentifies which specific customer preference is actually shifting",
          "A legal error made during a company's incorporation process",
          "A technical bug in a company's product"
        ],
        correctAnswer: "A situation where a company sees the market changing but misidentifies which specific customer preference is actually shifting",
        explanation: "this is the exact definition given. A, C, and D are fabricated, unrelated claims."
      },
      {
        questionText: "According to this lesson, why is \"seeing change coming\" not the same as learning something useful from a failure?",
        options: [
          "Because seeing change and correctly diagnosing which specific preference is shifting are two separate, distinct skills",
          "Because companies that see change coming always succeed regardless of their response",
          "Because market changes are always impossible to detect in advance",
          "Because failure only teaches lessons to companies that ignore the market entirely"
        ],
        correctAnswer: "Because seeing change and correctly diagnosing which specific preference is shifting are two separate, distinct skills",
        explanation: "this is the lesson's central distinction, illustrated by BlackBerry. B, C, and D are fabricated or contradicted claims."
      },
      {
        questionText: "What specific assumption did BlackBerry's leadership hold that turned out to be wrong, according to this lesson?",
        options: [
          "That the physical keyboard and enterprise security would remain the decisive value proposition, regardless of the iPhone's touchscreen, app-centric approach",
          "That touchscreen phones would never be technically possible to manufacture",
          "That enterprise customers would never adopt any new technology under any circumstances",
          "That BlackBerry's own products contained no valuable features at all"
        ],
        correctAnswer: "That the physical keyboard and enterprise security would remain the decisive value proposition, regardless of the iPhone's touchscreen, app-centric approach",
        explanation: "this is the lesson's direct account of BlackBerry's core assumption. B, C, and D are fabricated or unsupported claims."
      },
      {
        questionText: "You're a BlackBerry executive in 2008, watching the iPhone gain consumer traction while your enterprise customers still prefer physical keyboards. Based on this lesson, what would testing your own assumption directly actually require?",
        options: [
          "Assuming your current customer base will remain loyal indefinitely with no further analysis",
          "Admitting that your current strength might not be permanent, and actively testing whether the preference shift reaching consumers could eventually reach your core customers too",
          "Ignoring the iPhone entirely since it targets a different customer segment",
          "Immediately abandoning your entire product line without any analysis"
        ],
        correctAnswer: "Admitting that your current strength might not be permanent, and actively testing whether the preference shift reaching consumers could eventually reach your core customers too",
        explanation: "this reflects the lesson's central argument about the harder, more useful diagnostic step. A, C, and D all contradict or oversimplify this reasoning."
      },
      {
        questionText: "You're an executive at a company whose core product is currently succeeding, and a competitor's new product looks clearly inferior on the dimensions your best customers currently value most. Based on this lesson, what should this observation prompt you to do?",
        options: [
          "Dismiss the competitor entirely, since inferior products on your key dimensions can never pose a real threat",
          "Specifically identify what customer preference the competitor's product might represent, and test whether that preference could eventually matter to your own customers",
          "Assume your current strengths will remain decisive indefinitely with no further investigation",
          "Copy the competitor's product exactly without any independent analysis"
        ],
        correctAnswer: "Specifically identify what customer preference the competitor's product might represent, and test whether that preference could eventually matter to your own customers",
        explanation: "this is a direct application of the lesson's diagnosis-error framework. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A company concludes, after a major failure, that \"the market became unpredictable and nothing could have been done.\" Based on this lesson, what is the problem with this conclusion?",
        options: [
          "It is a specific, actionable lesson that will prevent future failures",
          "It is a vague conclusion that avoids identifying the actual, specific cause of the failure, making it far less useful than a precise diagnosis",
          "It is the most accurate possible conclusion for any business failure",
          "It has no relationship to how companies should learn from failure"
        ],
        correctAnswer: "It is a vague conclusion that avoids identifying the actual, specific cause of the failure, making it far less useful than a precise diagnosis",
        explanation: "this is a direct application of the lesson's warning about vague versus specific lessons. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "Two companies experience similar market disruptions. Company A concludes broadly that \"disruption is unavoidable in this industry.\" Company B identifies the specific customer preference it failed to anticipate and tests that assumption before its next major decision. Based on this lesson, which company is more likely to avoid a similar failure in the future?",
        options: [
          "Company A, since accepting disruption as unavoidable is the most useful lesson",
          "Company B, since identifying and testing the specific misdiagnosed assumption is a far more actionable lesson than a vague acceptance of disruption",
          "Neither company can learn anything meaningful from failure",
          "Both companies have learned functionally identical lessons"
        ],
        correctAnswer: "Company B, since identifying and testing the specific misdiagnosed assumption is a far more actionable lesson than a vague acceptance of disruption",
        explanation: "this is a direct application of the lesson's central argument about specific versus vague diagnosis. A, C, and D all contradict this reasoning."
      },
      {
        questionText: "A company's leadership was fully aware of a competitor's new product and its early growth, yet still lost significant market share over the following years. Based on this lesson, what does this scenario most likely indicate?",
        options: [
          "That awareness of a competitor automatically prevents any future failure",
          "That the company likely misdiagnosed which specific customer preference the competitor's product represented, despite being aware of its existence",
          "That market awareness has no relationship to a company's eventual success or failure",
          "That the competitor's product must have been technically superior in every respect"
        ],
        correctAnswer: "That the company likely misdiagnosed which specific customer preference the competitor's product represented, despite being aware of its existence",
        explanation: "this is a direct application of the lesson's diagnosis-error concept, mirroring BlackBerry's exact situation. A, C, and D all contradict or misapply this reasoning."
      },
      {
        questionText: "A company's leadership assumes that its historical core strength will remain decisive indefinitely, without directly testing that assumption against an emerging competitor's different value proposition. Based on this lesson, what risk does this behavior create?",
        options: [
          "No risk at all, since historical strengths always remain decisive regardless of market changes",
          "The risk of a diagnosis error — correctly noticing a competitor exists while misidentifying whether the customer preference it represents will eventually matter",
          "A risk that only applies to the smartphone industry specifically",
          "A risk that can be eliminated entirely simply by acknowledging the competitor's existence"
        ],
        correctAnswer: "The risk of a diagnosis error — correctly noticing a competitor exists while misidentifying whether the customer preference it represents will eventually matter",
        explanation: "this is a direct application of the lesson's central warning, illustrated by BlackBerry's decline. A, C, and D all contradict or oversimplify this reasoning."
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
