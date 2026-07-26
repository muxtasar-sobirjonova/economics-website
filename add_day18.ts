import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 18;
  const tag = "Week 4"; // Or whichever week, we'll leave it as is or default

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>A pack of ground beef labeled "90% lean" sells briskly. The identical pack, labeled "10% fat," sits on the shelf. Nothing about the meat changed. Only the words did.</p>

<p>This is a <strong>framing effect</strong>: the finding, central to prospect theory, that logically equivalent information produces different decisions depending on how it's presented — as a gain or a loss, a success rate or a failure rate, an opt-in or an opt-out. Kahneman and Tversky demonstrated this formally with survival-rate experiments: doctors and patients reacted very differently to a treatment described as having a "90% survival rate" versus the mathematically identical "10% mortality rate," even though the underlying odds never moved.</p>

<p>Imagine a form that asks new employees "Check this box if you want to join the retirement plan" versus one that says "Check this box if you want to opt out of the retirement plan you've been automatically enrolled in." The available choice is identical in both cases. The default is not — and defaults, it turns out, are one of the most powerful frames of all.</p>

<p>Few examples make this clearer than what happens when an entire country decides how to phrase a single medical form: organ donation.</p>`;

  const conceptSummary = `Framing effects occur when logically identical information produces different decisions depending on how it's presented — as a gain versus a loss, or an opt-in versus an opt-out. The words "the treatment has a 90% survival rate" and "the treatment has a 10% mortality rate" describe the same odds but produce different reactions. Defaults are one of the most powerful frames, quietly shaping decisions people never consciously make.`;

  const conceptTakeaways = [
    "A framing effect occurs when logically equivalent information leads to different decisions based only on how it's presented.",
    "Describing a treatment's \"90% survival rate\" versus its \"10% mortality rate\" produces different reactions despite identical underlying odds.",
    "Default options (opt-in vs. opt-out) are among the most powerful frames, since many people never actively change a pre-set default.",
    "Framing doesn't change the facts of a decision — it changes which facts feel most salient to the decision-maker.",
    "Framing effects matter most in decisions that are complex, emotionally weighty, or rarely revisited once set."
  ];

  const articleTitle = "How Austria Increased Organ Donation Through Default Framing (Austria)";
  
  const articleText = `<p>In Austria, roughly 99% of citizens are registered organ donors. In neighboring Germany, the figure is closer to 12%. <strong>What explains a nearly 90-point gap between two culturally similar countries?</strong><br>
Not culture, and not deeply held belief — a single line on a government form. Austria uses an opt-out system: every citizen is presumed to consent to organ donation unless they actively file paperwork to refuse. Germany uses an opt-in system: citizens are presumed not to be donors unless they actively register. The choice available to citizens in both countries is identical. Only the default differs.</p>

<p><strong>What exactly is a "presumed consent" or opt-out system, and how does Austria's form differ from Germany's?</strong><br>
Under Austria's law, silence is treated as agreement — a person who does nothing at all is legally a registered donor. Under Germany's opt-in system, silence is treated as refusal — a person who does nothing at all is legally not a donor. Filling out a form to change your status takes roughly the same few minutes in either country. What changes is which choice requires effort and which one requires none.</p>

<p><strong>Why did researchers Eric Johnson and Daniel Goldstein treat this as a natural experiment in framing rather than a cultural difference?</strong><br>
In a widely cited 2003 study, Johnson and Goldstein compared organ donation consent rates across multiple European countries and found the gap between opt-in and opt-out nations was consistent and enormous, regardless of the countries' broader cultural or religious similarities. Countries as culturally close as Austria and Germany, or Sweden and Denmark, showed the same pattern: opt-out countries clustered near 99% registration, opt-in countries clustered far lower, sometimes in the low double digits.</p>

<p><strong>If most people in both countries actually hold similar personal views on organ donation, why does the registered rate differ so drastically?</strong><br>
Because most people never fill out the form at all, in either country — and the default simply decides what happens to everyone who doesn't. Filling out a form requires overcoming inertia, uncertainty about how to file it, and the simple tendency to leave a rarely revisited decision alone. An opt-out system quietly converts that inertia into consent. An opt-in system converts the same inertia into refusal.</p>

<p><strong>Does the opt-out default mean Austrians are forced to donate against their will?</strong><br>
No — anyone who genuinely objects can file a refusal, and Austria's system explicitly preserves that right. What the opt-out default removes isn't choice; it's the requirement that someone take deliberate action to end up as a registered donor. For the large share of people who are indifferent or mildly in favor but would never get around to filling out a voluntary form, the default effectively makes the decision for them.</p>

<p><strong>What does the organ donation comparison suggest about how governments should design any consequential default choice?</strong><br>
That the default isn't a neutral, invisible starting point — it's one of the most powerful levers a policymaker has, often more powerful than persuasion, advertising, or public information campaigns. Framing a choice as "opt out of X" instead of "opt into X" doesn't just nudge behavior at the margins. In the case of organ donation, it can be the single biggest factor separating a country with near-universal registration from one where the vast majority never register at all.</p>`;

  const articleSummary = `Austria's opt-out organ donation system results in roughly 99% registration, while opt-in Germany sits near 12%, despite similar cultural attitudes toward donation. Researchers Johnson and Goldstein found this pattern held consistently across European countries in a 2003 study, showing the gap comes from default framing, not belief. Because most people never actively fill out a form either way, whichever option requires no action becomes the outcome for the large majority.`;

  const articleTakeaways = [
    "Austria's opt-out organ donation system results in roughly 99% registered donors, versus roughly 12% in opt-in Germany.",
    "Researchers Eric Johnson and Daniel Goldstein documented this pattern across multiple European countries in a widely cited 2003 study.",
    "The available choice is identical in opt-in and opt-out systems; only the default — what happens if a person does nothing — differs.",
    "Most people never actively fill out a donor form either way, meaning the default effectively decides the outcome for the majority.",
    "Defaults are one of the most powerful policy tools available, often shaping outcomes more than persuasion or advertising campaigns."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "How the Same Choice Can Feel Completely Different",
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
        questionText: "What is a framing effect?",
        options: [
          "A change in the actual facts of a decision",
          "A change in decisions caused purely by how logically equivalent information is presented",
          "A legal requirement to disclose all information equally",
          "A bias that only affects medical decisions"
        ],
        correctAnswer: "A change in decisions caused purely by how logically equivalent information is presented",
        explanation: "Framing effects describe how the presentation of choices (like \"10% fat\" vs \"90% lean\") influences decisions even when the underlying facts are identical."
      },
      {
        questionText: "Why do opt-out organ donation systems produce dramatically higher registration rates than opt-in systems, even when underlying attitudes toward donation are similar?",
        options: [
          "Because opt-out systems make donation legally mandatory",
          "Because most people never actively change a pre-set default, so whichever option requires no action becomes the outcome for most people",
          "Because opt-out countries have higher rates of accidents",
          "Because opt-in forms are physically longer"
        ],
        correctAnswer: "Because most people never actively change a pre-set default, so whichever option requires no action becomes the outcome for most people",
        explanation: "Defaults are incredibly powerful frames because they harness human inertia. The option that requires zero effort \"wins\" for the majority."
      },
      {
        questionText: "What did Johnson and Goldstein's 2003 comparative study across European countries suggest about the organ donation gap?",
        options: [
          "The gap was caused entirely by religious differences between countries",
          "The gap was consistent and driven by default framing (opt-in vs. opt-out), not by underlying cultural differences",
          "There was no meaningful gap between opt-in and opt-out countries",
          "Opt-in countries always had higher donation rates"
        ],
        correctAnswer: "The gap was consistent and driven by default framing (opt-in vs. opt-out), not by underlying cultural differences",
        explanation: "Countries with similar cultures (like Germany and Austria) had vastly different rates, showing the effect was driven almost entirely by the default frame."
      },
      {
        questionText: "Why does describing a medical treatment as having a \"90% survival rate\" produce a different reaction than describing it as having a \"10% mortality rate,\" even though both describe identical odds?",
        options: [
          "Because the two phrases actually describe different statistical outcomes",
          "Because framing changes which aspect of the identical information feels most salient, even without changing the underlying facts",
          "Because patients cannot understand percentages above 50%",
          "Because doctors are legally required to prefer one phrasing"
        ],
        correctAnswer: "Because framing changes which aspect of the identical information feels most salient, even without changing the underlying facts",
        explanation: "The \"survival\" frame highlights a gain, while the \"mortality\" frame highlights a loss, triggering different emotional responses to the same data."
      },
      {
        questionText: "A city wants to increase enrollment in a free preventive health screening program that currently requires residents to actively sign up. Based on framing effects and default design, what change is most likely to increase enrollment without changing the actual program?",
        options: [
          "Advertise the program more loudly using the exact same opt-in form",
          "Switch to an opt-out model where residents are automatically enrolled unless they actively withdraw",
          "Increase the paperwork required to sign up, to filter for serious applicants",
          "Offer a cash reward only to those who fill out the opt-in form"
        ],
        correctAnswer: "Switch to an opt-out model where residents are automatically enrolled unless they actively withdraw",
        explanation: "Switching the default to an opt-out model capitalizes on inertia and is generally far more effective than mere persuasion or advertising."
      },
      {
        questionText: "You're a retirement plan administrator and want more employees to save for retirement without changing the plan's actual terms or their ability to opt out. Based on this lesson, what should you change?",
        options: [
          "The size of the employer's matching contribution",
          "The default enrollment status — automatically enrolling employees unless they actively opt out, rather than requiring active opt-in",
          "The name of the retirement plan",
          "The number of investment options offered"
        ],
        correctAnswer: "The default enrollment status — automatically enrolling employees unless they actively opt out, rather than requiring active opt-in",
        explanation: "Automatic enrollment leverages the power of defaults to dramatically increase participation without forcing anyone to stay in."
      },
      {
        questionText: "A hospital reports that \"80% of patients who take this medication experience no side effects.\" A second hospital reports the identical fact as \"20% of patients experience side effects.\" If patient uptake differs between the two hospitals, what does this most likely demonstrate?",
        options: [
          "The medications are actually different at each hospital",
          "A framing effect — logically identical information is producing different patient decisions based on presentation alone",
          "One hospital's patients are more medically literate",
          "The reported statistics must contain a calculation error"
        ],
        correctAnswer: "A framing effect — logically identical information is producing different patient decisions based on presentation alone",
        explanation: "Presenting the same probability in terms of success versus failure is a classic example of a framing effect altering behavior."
      },
      {
        questionText: "A country with an opt-in organ donation system wants to increase registration without legally forcing anyone to become a donor. Based on the Austria/Germany comparison, which single change would likely have the largest impact?",
        options: [
          "Running a national advertising campaign encouraging people to sign up",
          "Switching the system's default from opt-in to opt-out, while still preserving the right to refuse",
          "Increasing the number of donation centers",
          "Requiring doctors to personally ask every patient about donation preferences"
        ],
        correctAnswer: "Switching the system's default from opt-in to opt-out, while still preserving the right to refuse",
        explanation: "Opt-out defaults have proven vastly more effective at increasing registration rates than public information campaigns."
      },
      {
        questionText: "If a subscription service wants to reduce cancellations without restricting anyone's actual right to cancel, which strategy best reflects the lesson on framing and defaults?",
        options: [
          "Making the cancellation process itself extremely difficult and time-consuming",
          "Framing renewal as the default (automatic continuation) while still making the option to cancel clear and easy to find, since most users won't actively act against a default either way",
          "Charging a penalty fee for cancellation",
          "Requiring a phone call to sign up but allowing cancellation only by mail"
        ],
        correctAnswer: "Framing renewal as the default (automatic continuation) while still making the option to cancel clear and easy to find, since most users won't actively act against a default either way",
        explanation: "Making renewal the default takes advantage of the fact that people are less likely to take action to change an existing state."
      },
      {
        questionText: "A voter registration reform changes from \"citizens must apply to register\" to \"citizens are automatically registered unless they opt out,\" while keeping all other requirements identical. Based on the concept in this lesson, what is the most likely outcome?",
        options: [
          "No change in registration rates, since the requirements are identical",
          "A significant increase in registration rates, since most citizens who are indifferent or mildly willing will not actively opt out, mirroring the organ donation pattern",
          "A significant decrease in registration rates",
          "The reform will only affect registration rates in rural areas"
        ],
        correctAnswer: "A significant increase in registration rates, since most citizens who are indifferent or mildly willing will not actively opt out, mirroring the organ donation pattern",
        explanation: "Automatic voter registration is an opt-out default, and just like organ donation, it captures those who would have failed to act due to inertia."
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
