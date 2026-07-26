import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dayOrder = 9;

  console.log(`Starting update for Day ${dayOrder}...`);

  const conceptText = `<p>"It is a capital mistake to theorize before one has data." — Arthur Conan Doyle (Sherlock Holmes)</p>

<p>Meet Linda.</p>

<p>Linda is 31 years old, single, outspoken, and very bright. She majored in philosophy. As a student, she was deeply concerned with issues of discrimination and social justice, and she took part in anti-nuclear demonstrations.</p>

<p>Now — which is more likely?</p>

<p>A) Linda is a bank teller.<br>
B) Linda is a bank teller who is also active in the feminist movement.</p>

<p>Most people, given these two options, choose B.</p>

<p>Stop and think about that for a second. Option B is a <em>subset</em> of option A. Every feminist bank teller is also, by definition, a bank teller. Adding a detail can only make a description less probable, never more — yet most people, including trained statisticians, instinctively pick the more specific, better-fitting answer.</p>

<p>Psychologists <strong>Daniel Kahneman and Amos Tversky</strong> ran this exact experiment in 1983 and got the same result again and again. People don't calculate probability. They calculate resemblance. Linda "sounds like" a feminist, so a description that matches that impression feels more likely to be true, even when the math says the opposite.</p>

<p>They called this the <strong>representativeness heuristic</strong>: judging how likely something is by how closely it resembles a familiar pattern, rather than by the actual evidence or odds involved.</p>

<p>Notice what your own brain just did. It didn't check probability rules. It checked resemblance to a story — and lost.</p>`;

  const conceptSummary = `The representativeness heuristic is judging how likely something is by how closely it matches a familiar pattern, instead of by actual evidence or probability. Kahneman and Tversky's 1983 "Linda problem" showed that people will judge a more specific, better-fitting description as more probable than a general one, even when it's mathematically impossible for the specific case to be more likely.`;

  const conceptTakeaways = [
    "The representativeness heuristic, demonstrated by Kahneman and Tversky's 1983 \"Linda problem,\" is judging likelihood by resemblance to a pattern rather than by actual evidence.",
    "Adding a specific, \"fitting\" detail to a description can only make it less statistically probable, never more — yet it often feels more believable.",
    "People consistently choose the answer that matches a stereotype or story over the answer that is mathematically more likely.",
    "The heuristic operates even on trained statisticians and experts, not just untrained intuition.",
    "Resemblance to a pattern and evidence of truth are entirely different things, even though they feel identical in the moment of judgment."
  ];

  const articleTitle = "How Amazon Had to Change Its AI Hiring Tool Because of Bias (United States)";
  
  const articleText = `<p>In 2014, a team of engineers inside Amazon set out to build something that sounded almost too good to be true: a hiring algorithm that would remove human bias from recruiting entirely.</p>

<p>Feed it a résumé. Get back a score from one to five stars. No tired recruiter, no gut feeling, no unconscious favoritism. Just data.</p>

<p><strong>What did the engineers find, roughly a year later?</strong><br>
The opposite of what they'd built it for. The algorithm was consistently scoring female applicants lower than male applicants for the same technical roles. Not occasionally. Systematically.</p>

<p><strong>How does an "unbiased" algorithm learn to discriminate?</strong><br>
It studied the past. Engineers trained the model on roughly ten years of résumés submitted to Amazon — a decade in which the technology industry, and Amazon's own technical hires, had skewed heavily male. The algorithm wasn't told to find the most qualified candidate. It was told to find candidates who resembled the ones who'd been hired before. And the ones who'd been hired before were, disproportionately, men.</p>

<p><strong>What did that "resemblance" actually look like in practice?</strong><br>
It looked absurd once engineers dug into it. The model began downgrading résumés that included the word "women's" — as in "women's chess club captain" or a degree from a women's college. It wasn't reasoning about gender. It had simply learned, from pattern alone, that those words rarely appeared on the résumés of people who got hired in the past. Close enough to the old pattern, score high. Different from the old pattern, score low.</p>

<p><strong>If the data was real, why was trusting it a mistake?</strong><br>
Because a decade of who got hired is not the same thing as a decade of who was most qualified. It's shaped by who applied, who got noticed, who got promoted — and every historical bias baked into all three. The algorithm mistook "this is what past success looked like" for "this is what future success requires." The exact same leap the Linda question tempts you into making.</p>

<p><strong>Why didn't Amazon just delete the biased terms and keep using it?</strong><br>
Engineers tried. But they couldn't guarantee the model wouldn't find other, subtler stand-ins for the same pattern — a phrase, a school, a hobby quietly correlated with gender in the training data. Rather than ship a tool that had simply learned to discriminate more cleverly, Amazon scrapped the project in 2017.</p>

<p><strong>What's the real lesson sitting inside a failed algorithm at one of the world's largest companies?</strong><br>
That the representativeness heuristic isn't just something individual recruiters do by instinct. It can be written into code and run automatically, at a scale no single biased hiring manager could ever reach — scoring every résumé the same flawed way, thousands of times a day, before a single human even looks at one.</p>`;

  const articleSummary = `Amazon built a hiring AI in 2014 meant to remove human bias, but it learned to downgrade female applicants after training on a decade of male-skewed hiring data. The algorithm wasn't judging qualification — it was judging resemblance to past hires, the same mistake behind the Linda problem. Unable to guarantee the bias wouldn't resurface in subtler forms, Amazon scrapped the tool in 2017.`;

  const articleTakeaways = [
    "Amazon built an experimental hiring AI in 2014 designed to remove human bias, but found it systematically rated female applicants lower.",
    "The model was trained on roughly a decade of past résumés, learning to favor candidates who resembled historically male-skewed hiring patterns.",
    "The AI downgraded résumés containing words like \"women's\" purely because those terms were statistically rare among past hires, not due to any understanding of gender.",
    "Amazon scrapped the tool in 2017 after failing to guarantee it wouldn't find subtler proxies for the same bias.",
    "The case shows the representativeness heuristic can be built directly into automated systems, operating at a scale no individual recruiter's bias ever could."
  ];

  const lesson = await prisma.lesson.findFirst({ where: { dayOrder } });

  if (lesson) {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title: "Why We Judge People Too Quickly",
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
        questionText: "In the Linda problem, why is choosing \"bank teller and feminist\" over \"bank teller\" a logical error, regardless of how well the description fits Linda's personality?",
        options: [
          "Because feminists are statistically rare in the general population",
          "Because bank tellers are more common than feminists",
          "Because the conjunction of two conditions can never be more probable than either condition alone, yet the more specific option often feels more believable due to resemblance",
          "Because the question is intentionally worded to confuse the reader"
        ],
        correctAnswer: "Because the conjunction of two conditions can never be more probable than either condition alone, yet the more specific option often feels more believable due to resemblance",
        explanation: "Probability rules state that a single event (A) is always more likely than two events happening together (A AND B), no matter how \"representative\" the second detail seems."
      },
      {
        questionText: "Why couldn't Amazon's engineers fully fix the AI's bias simply by removing a list of gendered keywords from its scoring criteria?",
        options: [
          "Because the underlying pattern the model had learned could resurface through other correlated, less obvious proxies not on the removed list",
          "Because removing keywords was against company policy",
          "Because Amazon lacked the technical resources to edit the model at all",
          "Because the model was legally required to use the original keyword list"
        ],
        correctAnswer: "Because the underlying pattern the model had learned could resurface through other correlated, less obvious proxies not on the removed list",
        explanation: "The AI was looking for resemblance, and it would simply find other traits or words that inadvertently functioned as proxies for male applicants."
      },
      {
        questionText: "What is the core distinction the representativeness heuristic causes people (and algorithms) to blur?",
        options: [
          "The distinction between expensive and inexpensive outcomes",
          "The distinction between recent and old data exclusively",
          "The distinction between male and female candidates specifically, and nothing else",
          "The distinction between resemblance to a known pattern and actual statistical or factual likelihood"
        ],
        correctAnswer: "The distinction between resemblance to a known pattern and actual statistical or factual likelihood",
        explanation: "The heuristic substitutes a simple assessment of similarity (does this look right?) for a complex assessment of probability (is this actually likely?)."
      },
      {
        questionText: "If a hiring algorithm is trained purely on \"who succeeded in the past,\" under what condition would this training approach NOT risk reproducing a representativeness-heuristic-style error?",
        options: [
          "Never — training on past outcomes always introduces this risk regardless of the data",
          "Only if the historical pattern of who succeeded was itself an unbiased, representative reflection of who was actually most qualified — a condition that rarely holds when hiring history reflects past inequality",
          "Only if the algorithm is reviewed by a human once per year",
          "Only if the training data is at least ten years old"
        ],
        correctAnswer: "Only if the historical pattern of who succeeded was itself an unbiased, representative reflection of who was actually most qualified — a condition that rarely holds when hiring history reflects past inequality",
        explanation: "The algorithm learns to mimic past patterns exactly. If the past pattern itself was flawed or biased, the algorithm simply systematizes that flaw."
      },
      {
        questionText: "A university admissions office trains a predictive model on 30 years of past admitted-student data to help forecast which applicants will succeed academically. If, historically, admitted students disproportionately came from a narrow set of feeder high schools due to legacy preferences rather than measured ability, what is the most likely risk with this model?",
        options: [
          "The model will automatically correct for the historical admissions bias",
          "The model will treat every applicant identically regardless of school background",
          "The model has no risk of bias since it only uses academic data",
          "The model may learn to favor applicants who resemble the historical feeder-school pattern, mistaking that resemblance for a predictor of academic success"
        ],
        correctAnswer: "The model may learn to favor applicants who resemble the historical feeder-school pattern, mistaking that resemblance for a predictor of academic success",
        explanation: "Just like Amazon's AI, the model would interpret the frequent presence of feeder-school students in the \"success\" category as proof that the school itself caused success, missing the historical bias."
      },
      {
        questionText: "A venture capital associate is evaluating two founders: one who fits the \"confident, charismatic, Ivy League\" pattern of past unicorn founders the firm has funded, and one with a stronger execution track record but a completely different background and communication style. Based on the representativeness heuristic, what mistake is the associate most at risk of making, and what is the most direct way to avoid it?",
        options: [
          "Favoring the founder with the stronger track record automatically, since track record is immune to this bias",
          "Favoring the founder who fits the familiar pattern; avoid this by scoring both founders against standardized, predefined execution and market metrics before considering \"fit\"",
          "There is no risk here, since both founders are being considered by the same associate",
          "The mistake can only be avoided by rejecting both founders"
        ],
        correctAnswer: "Favoring the founder who fits the familiar pattern; avoid this by scoring both founders against standardized, predefined execution and market metrics before considering \"fit\"",
        explanation: "The associate is prone to picking the one who 'looks the part.' Pre-defining criteria based on actual evidence helps circumvent this shortcut."
      },
      {
        questionText: "A loan officer trained on decades of past default data notices that applicants who \"look like\" (in terms of surface traits correlated with past defaults) previous defaulters are being denied loans at a much higher rate than a careful statistical model would justify, given their actual individual credit profiles. What does this scenario best illustrate?",
        options: [
          "The applicants are being treated fairly since past default data is always objective",
          "Default rates are determined entirely by an applicant's surface traits",
          "The officer's judgment is substituting resemblance to a past pattern for the individual applicant's actual evidence of creditworthiness",
          "The loan officer has no access to the applicants' credit profiles"
        ],
        correctAnswer: "The officer's judgment is substituting resemblance to a past pattern for the individual applicant's actual evidence of creditworthiness",
        explanation: "The loan officer is relying on the representativeness heuristic, evaluating the \"story\" or pattern over the hard individual evidence."
      },
      {
        questionText: "A tech recruiter reviews two candidates for a \"founding engineer\" role: Candidate X previously worked at a well-known unicorn startup but has a thin project portfolio; Candidate Y worked at an unknown company but has an extensive, verifiable portfolio of shipped, high-impact projects. If the recruiter's decision is driven primarily by which candidate's résumé \"looks like\" a founding engineer's résumé typically looks, which candidate are they more likely to favor, and why?",
        options: [
          "Candidate X, because their résumé matches the familiar \"successful startup\" pattern more closely, even though Candidate Y has stronger direct evidence of relevant ability",
          "Candidate Y, because verifiable evidence always overrides resemblance to a pattern in human judgment",
          "Neither candidate, since resemblance has no bearing on hiring decisions",
          "Candidate Y, because unknown companies are statistically proven to produce better engineers"
        ],
        correctAnswer: "Candidate X, because their résumé matches the familiar \"successful startup\" pattern more closely, even though Candidate Y has stronger direct evidence of relevant ability",
        explanation: "Candidate X fits the stereotype of what a \"good\" engineer's resume looks like, triggering the heuristic and overshadowing actual qualifications."
      },
      {
        questionText: "A machine learning engineer wants to test whether their newly built resume-screening model relies on genuine qualification signals or on the representativeness heuristic baked in from training data. Which experiment would most directly reveal the underlying issue?",
        options: [
          "Running the model faster to see if results change",
          "Feeding the model resumes with qualifications held constant while varying only surface traits historically correlated with past hires (school prestige, name patterns, club memberships), and checking whether scores shift despite identical qualifications",
          "Comparing the total number of resumes the model can process per hour",
          "Asking the engineers who built the model whether they intended to introduce bias"
        ],
        correctAnswer: "Feeding the model resumes with qualifications held constant while varying only surface traits historically correlated with past hires (school prestige, name patterns, club memberships), and checking whether scores shift despite identical qualifications",
        explanation: "This directly tests whether the model is scoring based on true merit (which remains constant) or mere resemblance to historical surface traits."
      },
      {
        questionText: "Why is \"the algorithm was only reflecting real historical data\" not a sufficient defense against the criticism that Amazon's hiring tool was biased?",
        options: [
          "Because historical data is always fabricated and cannot be trusted for any purpose",
          "Because Amazon never actually used real historical data to train the model",
          "Because the defense would only be valid if the model had been trained on data from a different company",
          "Because \"real\" historical data can still encode the effects of past bias in who was hired, meaning a pattern can be statistically accurate about the past while still being a poor and unfair predictor of future qualification"
        ],
        correctAnswer: "Because \"real\" historical data can still encode the effects of past bias in who was hired, meaning a pattern can be statistically accurate about the past while still being a poor and unfair predictor of future qualification",
        explanation: "An algorithm replicating past data is also replicating any systematic biases contained within that data, mistaking historical inequality for objective merit."
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
