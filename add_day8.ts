import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 8;

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>"Nothing in life is to be feared; it is only to be understood." — Marie Curie</p>

<p>Imagine you wake up tomorrow to this headline: "Commercial Airplane Crashes Shortly After Takeoff." Every news channel plays the wreckage. Every feed fills with videos from terrified passengers. By lunch, your parents say, "We're driving instead."</p>

<p>Stop for a second. Would you choose the car too?</p>

<p>Most people would. And they'd feel completely rational doing it.</p>

<p>Now answer a harder question: how many people died in road accidents yesterday? You probably can't say. What about a plane crash — if one happened yesterday, would you already know?</p>

<p>Your brain doesn't remember events equally. It remembers stories.</p>

<p>Psychologists <strong>Daniel Kahneman and Amos Tversky</strong> spent years studying why intelligent people keep misjudging risk. In the early 1970s, they found that when people estimate how likely something is, they don't search their memory for statistics. They search for examples. If an example comes to mind easily, the brain assumes the event is common. If nothing comes to mind, the brain assumes it's rare. They named this shortcut the <strong>availability heuristic</strong>.</p>

<p>Notice what just happened to you. Your brain never asked, "What do the numbers say?" It asked, "What do I remember?" Those are two completely different questions, and only one of them is actually about risk.</p>

<p>Most days, this shortcut works fine — frequent events do tend to leave behind more memories. It fails exactly when a rare event becomes dramatic enough to dominate every screen for a week, while an ordinary danger keeps happening quietly, unfilmed, in the background.</p>`;

  const conceptSummary = `The availability heuristic is why we judge risk by what we remember, not by what actually happens most often. A dramatic, heavily replayed event — a plane crash, a shark attack — feels common because it's unforgettable. An ordinary risk, like a car crash, feels rare because it never makes the news. Memorable and probable are not the same thing.`;

  const conceptTakeaways = [
    "The availability heuristic, named by Kahneman and Tversky, means people judge risk by how easily an example comes to mind, not by actual odds.",
    "Your brain asks \"what do I remember?\" instead of \"what do the numbers say?\" — and those are different questions.",
    "Frequent events usually are easier to recall, which is why the shortcut works most of the time.",
    "The shortcut breaks the moment a rare event becomes dramatic enough to dominate the news for days.",
    "Ordinary risks that repeat quietly, without cameras, get systematically underestimated — not because they're rare, but because they're boring."
  ];

  const articleTitle = "Why Did So Many Americans Stop Flying After 9/11? (United States)";
  
  const articleText = `<p>It is September 11, 2001. A plane has just hit the first tower.</p>

<p>Within minutes, a second plane hits the other one.</p>

<p>By that afternoon, every television in America is playing the same footage, over and over. The collapsing towers. The smoke. The chaos on the ground.</p>

<p>Nearly 3,000 people are dead by the end of the day.</p>

<p><strong>Why did so many Americans stop flying in the months that followed?</strong><br>
Because for weeks, there was nowhere to look that didn't show the same wreckage. Newspapers ran it on the front page. Television replayed it every hour. Even people who had never set foot on a plane could picture the exact moment the towers fell. The attack became, without exaggeration, the most memorable event most Americans had ever lived through — and memory, not math, is what decided what happened next.</p>

<p><strong>Did flying actually become more dangerous?</strong><br>
The opposite. Cockpit doors were reinforced. Screening tightened. Security checkpoints that used to take five minutes started taking forty. By every measure that mattered, commercial aviation became safer in the years after 9/11 than it had ever been before.</p>

<p>And still, Americans chose the road.</p>

<p><strong>How many people actually switched from planes to cars?</strong><br>
Enough to show up in national travel statistics. Domestic flight bookings dropped sharply in the months after the attacks. Highway traffic on long routes — the kind people used to fly — went up instead.</p>

<p>It felt like the cautious decision. It wasn't.</p>

<p><strong>What did that "cautious" decision actually cost?</strong><br>
German risk researcher <strong>Gerd Gigerenzer</strong> ran the numbers years later. His estimate: roughly 1,500 additional Americans died in car accidents in the twelve months after 9/11, specifically because they chose to drive distances they would normally have flown.</p>

<p>Read that again.</p>

<p>The attack killed nearly 3,000 people. The fear it created killed half that number again — quietly, on ordinary highways, without a single headline.</p>

<p><strong>Why didn't anyone notice 1,500 extra deaths the way they noticed the attacks?</strong><br>
Because those deaths never happened all at once, in front of a camera. They were scattered across a year, spread across every state, each one looking like just another car accident — the kind that happens so often in America that none of them make the national news. No footage. No replay. No memory built.</p>

<p><strong>So what actually decided how an entire country traveled that year?</strong><br>
Not the odds. Not the statistics that said flying had never been safer. A single, unforgettable image did more to change behavior than every safety report combined.</p>

<p>Have you ever noticed how one shark attack can empty a beach for the rest of the summer? Or how one viral video of a car catching fire can make people afraid of every electric vehicle on the road?</p>

<p>Same shortcut. Same mistake.</p>

<p>Your brain was never built to calculate probabilities. It was built to remember stories. And the story it remembers best is rarely the risk you should actually be worried about.</p>`;

  const articleSummary = `After 9/11, repeated footage made a rare, tragic event feel like an everyday danger, even as flying became measurably safer. Many Americans responded by driving instead — and researcher Gerd Gigerenzer estimated roughly 1,500 extra road deaths followed in a single year. The lesson: an unforgettable story can outweigh an entire year of safety statistics.`;

  const articleTakeaways = [
    "On September 11, 2001, nearly 3,000 people died, and weeks of repeated media coverage made the attack the most memorable event most Americans had lived through.",
    "Airport security tightened dramatically afterward — reinforced cockpit doors, longer screening — making flying measurably safer, even as fear of it grew.",
    "Domestic flight bookings dropped while long-distance highway traffic rose in the months following the attacks.",
    "Researcher Gerd Gigerenzer estimated roughly 1,500 additional Americans died in car accidents the following year because they chose to drive instead of fly.",
    "Scattered, ordinary deaths never generate the media coverage that shapes memory, which is exactly why common risks get underestimated next to rare, dramatic ones."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Why One Story Can Change What We Fear",
        conceptText,
        conceptSummary,
        conceptTakeaways,
        articleTitle,
        articleText,
        articleSummary,
        articleTakeaways,
      }
    });
    console.log(`Updated lesson content for day \${dayOrder}`);
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
        questionText: "Which of the following best explains why the availability heuristic can override statistical reality even in people who already know the underlying numbers?",
        options: [
          "Statistics are always less accurate than lived experience",
          "People are incapable of learning statistics in general",
          "Emotional vividness affects the ease of recall directly, and recall — not memorized statistics — is what the brain consults first when estimating risk in the moment",
          "The heuristic only operates in people with no formal education"
        ],
        correctAnswer: "Emotional vividness affects the ease of recall directly, and recall — not memorized statistics — is what the brain consults first when estimating risk in the moment",
        explanation: "The brain instinctively uses \"ease of recall\" as a proxy for frequency, so vivid memories can outcompete dry statistics when making a quick judgment."
      },
      {
        questionText: "Why does the availability heuristic tend to fail specifically at the extremes — very rare, dramatic events and very common, undramatic ones — rather than in the middle range of ordinary risks?",
        options: [
          "Because rare events are always underestimated and frequent events are always overestimated",
          "Because a rare event that becomes highly memorable gets overestimated, while a frequent event that stays forgettable gets underestimated — the shortcut's error grows precisely where memorability and true frequency diverge most",
          "Because moderate risks are always measured more accurately by researchers",
          "Because the brain only applies the heuristic to transportation-related risks"
        ],
        correctAnswer: "Because a rare event that becomes highly memorable gets overestimated, while a frequent event that stays forgettable gets underestimated — the shortcut's error grows precisely where memorability and true frequency diverge most",
        explanation: "The heuristic equates \"memorable\" with \"frequent.\" When something rare is highly memorable (a shark attack) or something frequent is forgettable (car crashes), the mental shortcut breaks down."
      },
      {
        questionText: "If two events kill the same number of people per year, but one is reported on daily and the other almost never makes the news, what does the availability heuristic predict about public perception of each risk?",
        options: [
          "Public perception will match the actual statistics regardless of reporting frequency",
          "The unreported event will be judged as more likely, since it happens without warning",
          "Both risks will be judged as equally likely, since the actual death toll is identical",
          "The reported event will be judged as far more likely, even though the true frequency of both events is the same"
        ],
        correctAnswer: "The reported event will be judged as far more likely, even though the true frequency of both events is the same",
        explanation: "Frequent reporting makes the event much easier to recall, which the brain interprets as it being much more common."
      },
      {
        questionText: "A person insists they've \"done the math\" and still believes flying is riskier than driving, despite acknowledging the statistics say otherwise. What does this reveal about how the availability heuristic operates?",
        options: [
          "It reveals that vivid, memorable examples can override known statistics in the moment of decision, rather than simply filling a gap in someone's knowledge",
          "It reveals that the statistics themselves must be incorrect",
          "It reveals that the person is lying about knowing the statistics",
          "It reveals that the heuristic only affects people who haven't seen the statistics"
        ],
        correctAnswer: "It reveals that vivid, memorable examples can override known statistics in the moment of decision, rather than simply filling a gap in someone's knowledge",
        explanation: "The visceral fear produced by a vivid memory can be stronger than rational understanding of abstract probabilities."
      },
      {
        questionText: "A city experiences one widely covered, fatal bicycle accident, and cycling commute rates drop by 20% the following month, even though the city's cycling injury rate hasn't changed in five years. An analyst wants to determine whether this drop reflects a real, updated risk assessment or an availability-heuristic-driven overreaction. Which single piece of evidence would most directly distinguish between the two explanations?",
        options: [
          "The number of news segments produced about the accident",
          "The average age of commuters who stopped cycling",
          "Whether the city's actual cycling accident rate changed in the weeks before and after the covered incident, independent of media attention",
          "The total number of cycling deaths reported that year"
        ],
        correctAnswer: "Whether the city's actual cycling accident rate changed in the weeks before and after the covered incident, independent of media attention",
        explanation: "If the actual rate didn't change, but behavior did following media coverage, the drop in cycling is an availability-driven overreaction."
      },
      {
        questionText: "A pharmaceutical company must decide how to report a drug's side-effect data to the public: as \"1 in 10,000 patients experience this side effect\" or as a single detailed patient case study describing one person's severe reaction. Based on the availability heuristic, which format is more likely to cause the public to overestimate the actual risk, and why?",
        options: [
          "The statistic, because larger numbers always feel more dangerous than small ones",
          "Neither format will affect public risk perception in any way",
          "The statistic, since numbers are inherently more persuasive than stories",
          "The case study, since a single vivid, specific example is easier to recall than an abstract number, even though the case study represents the same underlying rate"
        ],
        correctAnswer: "The case study, since a single vivid, specific example is easier to recall than an abstract number, even though the case study represents the same underlying rate",
        explanation: "The detailed story creates a vivid memory, which the brain equates with high likelihood, far more than the dry statistic does."
      },
      {
        questionText: "An airline wants to counteract irrational drops in bookings after a rare, highly publicized crash, without denying that the crash happened. Based on how the availability heuristic works, which strategy is most likely to be effective?",
        options: [
          "Wait silently for public attention to move to a different news story",
          "Present comparative statistics (crash rate per million flights versus other transportation modes) in the same channels where the crash coverage appeared, competing directly with the vividness of the incident",
          "Avoid mentioning the crash at all in any public communication",
          "Offer discounted tickets with no additional information provided"
        ],
        correctAnswer: "Present comparative statistics (crash rate per million flights versus other transportation modes) in the same channels where the crash coverage appeared, competing directly with the vividness of the incident",
        explanation: "Providing comparative data can help anchor people back to reality, but relying only on waiting might let the heuristic dominate."
      },
      {
        questionText: "A stock market analyst notices that after a single, heavily covered corporate fraud case, investors across the board became far more distrustful of accounting practices at completely unrelated companies with no history of fraud. Which explanation is most consistent with the availability heuristic, rather than a rational reassessment of risk?",
        options: [
          "Auditors of unrelated companies changed their practices at the same time",
          "Investors gathered new financial data on the unrelated companies and found genuine irregularities",
          "The vivid fraud case became easy to recall, and that ease of recall was mistakenly generalized into a belief that fraud had become more common across the entire market, without new evidence about other specific companies",
          "Regulatory bodies issued new fraud statistics prompting the shift"
        ],
        correctAnswer: "The vivid fraud case became easy to recall, and that ease of recall was mistakenly generalized into a belief that fraud had become more common across the entire market, without new evidence about other specific companies",
        explanation: "The ease of remembering the massive fraud makes the idea of fraud in general highly \"available,\" causing people to overestimate its likelihood elsewhere."
      },
      {
        questionText: "A parent refuses to let their child swim in a controlled, lifeguard-supervised pool after seeing a viral video of a shark attack in the open ocean, even though the two environments carry entirely different risk profiles. What does this decision most clearly illustrate about how the availability heuristic can distort judgment?",
        options: [
          "The parent's decision has nothing to do with memory or media exposure",
          "The parent is applying a scientifically validated general water-safety rule",
          "The parent has correctly identified that all bodies of water carry identical risk",
          "The parent has transferred a specific, vivid memory of risk to a completely different, unrelated context, rather than the actual risk profile of that context"
        ],
        correctAnswer: "The parent has transferred a specific, vivid memory of risk to a completely different, unrelated context, rather than the actual risk profile of that context",
        explanation: "The emotional salience of the shark attack overrides rational analysis of where the attack occurred versus where the child is swimming."
      },
      {
        questionText: "Two countries experience the exact same number of deaths from a rare disease outbreak, but only one country's media covers it extensively for weeks. Six months later, researchers find that residents of the heavily covered country report significantly higher perceived risk of the disease than residents of the other country, despite identical actual death tolls. What does this finding most directly demonstrate?",
        options: [
          "The finding proves that media coverage always accurately reflects real risk levels",
          "Residents of the heavily covered country have access to better statistical information",
          "The disease must have been more severe in the heavily covered country",
          "Perceived risk can diverge sharply from actual risk based on media exposure and ease of recall, independent of the true underlying frequency of the event"
        ],
        correctAnswer: "Perceived risk can diverge sharply from actual risk based on media exposure and ease of recall, independent of the true underlying frequency of the event",
        explanation: "This perfectly illustrates that what is widely reported and easily recalled dictates perceived risk, entirely separated from statistical reality."
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
    console.log(`Updated quiz questions for day \${dayOrder}`);
  }
  console.log("Done.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
