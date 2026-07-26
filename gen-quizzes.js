const fs = require('fs');

const questions = [
  {
    _key: "q1",
    questionText: "[Theory] According to this lesson, what does entrepreneurship economics actually study?",
    type: "multiple-choice",
    options: [
      "How to write a business plan that guarantees investor funding",
      "How people decide where to allocate limited time and money when the future is unclear, and how early commitments shape what becomes possible later",
      "How to calculate a company's exact market value before launch",
      "How governments regulate new industries"
    ],
    correctAnswer: "How people decide where to allocate limited time and money when the future is unclear, and how early commitments shape what becomes possible later"
  },
  {
    _key: "q2",
    questionText: "[Theory] What does \"opportunity cost\" mean, as illustrated in this lesson?",
    type: "multiple-choice",
    options: [
      "The total cost of manufacturing a product",
      "Choosing one path with limited time and money means giving up the other paths that were available, some of which might have turned out better",
      "A fee charged by investors for early-stage funding",
      "The cost difference between two competitors' products"
    ],
    correctAnswer: "Choosing one path with limited time and money means giving up the other paths that were available, some of which might have turned out better"
  },
  {
    _key: "q3",
    questionText: "[Theory] Why does this lesson argue that many early entrepreneurial actions are \"not about executing a plan\" but \"about learning\"?",
    type: "multiple-choice",
    options: [
      "Because founders always know the right answer in advance and are just confirming it",
      "Because information is weak and early signals are incomplete, so small experiments (prototypes, demos, price changes) are used to reveal what's actually true",
      "Because execution is illegal without government approval",
      "Because learning and executing are identical activities with no real difference"
    ],
    correctAnswer: "Because information is weak and early signals are incomplete, so small experiments (prototypes, demos, price changes) are used to reveal what's actually true"
  },
  {
    _key: "q4",
    questionText: "[Theory] According to this lesson, why doesn't having more funding eliminate a founder's need to make trade-off decisions?",
    type: "multiple-choice",
    options: [
      "Because more funding always removes every constraint a founder faces",
      "Because more money creates more options, but it doesn't remove the need to choose between them — every choice still forecloses others",
      "Because funding has no relationship to a founder's decision-making at all",
      "Because founders with more funding are legally required to pursue every option simultaneously"
    ],
    correctAnswer: "Because more money creates more options, but it doesn't remove the need to choose between them — every choice still forecloses others"
  },
  {
    _key: "q5",
    questionText: "[Perspective/roleplay] You're one of NVIDIA's founders in 1993, deciding whether to keep making small, safe improvements to existing video chips or spend your limited cash and engineering time on an unproven parallel-computing chip design few people seem to want yet. Based on this lesson, what's the economically sound way to frame this decision?",
    type: "multiple-choice",
    options: [
      "Always choose the safe, incremental path, since preserving the present is always the correct move under uncertainty",
      "Weigh which path teaches you the most about a genuinely uncertain future against the real risk of burning through your limited runway before demand appears",
      "Flip a coin, since no economic reasoning can apply to a decision this uncertain",
      "Wait until a market research report definitively proves demand exists before committing any resources"
    ],
    correctAnswer: "Weigh which path teaches you the most about a genuinely uncertain future against the real risk of burning through your limited runway before demand appears"
  },
  {
    _key: "q6",
    questionText: "[Perspective/roleplay] You're a founder who notices a competitor with the exact same product idea is spending months building developer tools and demos, while you're focused entirely on chasing immediate sales. Based on this lesson, what does this difference suggest about your likely long-term position?",
    type: "multiple-choice",
    options: [
      "Nothing — identical starting ideas always produce identical outcomes regardless of what each team does next",
      "Your competitor may be solving a deeper \"chicken-and-egg\" adoption problem that compounds into a stronger position over time, while chasing only immediate sales may leave that same problem unsolved",
      "Chasing immediate sales always outperforms building developer tools in every situation",
      "The two strategies are economically identical and will produce the same result"
    ],
    correctAnswer: "Your competitor may be solving a deeper \"chicken-and-egg\" adoption problem that compounds into a stronger position over time, while chasing only immediate sales may leave that same problem unsolved"
  },
  {
    _key: "q7",
    questionText: "[Practical/logical] Two founding teams start with the same underlying product idea and similar initial resources. Years later, one has built a thriving business and the other has failed. Based on this lesson, what does this outcome most likely reflect?",
    type: "multiple-choice",
    options: [
      "Random chance with no underlying pattern",
      "A difference in the small, early decisions each team made about where to allocate limited time and money, which compounded over time into very different outcomes",
      "The failing team must have had a worse original idea",
      "Only the amount of funding each team raised determines the outcome"
    ],
    correctAnswer: "A difference in the small, early decisions each team made about where to allocate limited time and money, which compounded over time into very different outcomes"
  },
  {
    _key: "q8",
    questionText: "[Practical/logical] A founder delays committing any real resources to a new, uncertain market until every major unknown about customer demand has been fully resolved. Based on this lesson, what risk does this founder face?",
    type: "multiple-choice",
    options: [
      "No risk at all — waiting for full certainty is always the economically optimal strategy",
      "The risk that waiting is itself a costly decision, since the world keeps moving and partnerships, talent, or market position may be lost to a competitor who acted earlier",
      "A risk that only applies to companies in the technology industry",
      "A risk that can be eliminated simply by raising more funding"
    ],
    correctAnswer: "The risk that waiting is itself a costly decision, since the world keeps moving and partnerships, talent, or market position may be lost to a competitor who acted earlier"
  },
  {
    _key: "q9",
    questionText: "[Practical/logical] A founder makes a well-reasoned, carefully considered decision to launch a promising product, but the business still fails because a key software partner never came on board and the ecosystem around the product never fully developed. Based on this lesson, what does this outcome illustrate?",
    type: "multiple-choice",
    options: [
      "That good reasoning guarantees success, so this outcome could not actually happen",
      "That good reasoning improves the odds of success but doesn't guarantee it, since outcomes depend on many moving parts — like complementary partners — that must also align after the decision is made",
      "That the founder's original decision must have been irrational",
      "That failure always means the founder ignored basic economic principles"
    ],
    correctAnswer: "That good reasoning improves the odds of success but doesn't guarantee it, since outcomes depend on many moving parts — like complementary partners — that must also align after the decision is made"
  },
  {
    _key: "q10",
    questionText: "[Practical/logical] A hardware company spends significant early resources on prototypes, developer outreach, and pilot production runs, specifically to find out whether its new product concept will actually generate real demand, rather than immediately scaling up production. Based on this lesson, which concept does this behavior best illustrate?",
    type: "multiple-choice",
    options: [
      "Cost-plus pricing",
      "Using small experiments to reveal the biggest unknowns before committing further, scarce resources",
      "A network effect between two unrelated companies",
      "A government-imposed regulatory requirement"
    ],
    correctAnswer: "Using small experiments to reveal the biggest unknowns before committing further, scarce resources"
  }
];

const fileContent = `import { Question } from '../types';

export const LESSON_1_QUESTIONS: Question[] = ${JSON.stringify(questions, null, 2)};
`;

fs.writeFileSync('C:/Users/user/.gemini/antigravity-ide/scratch/economics_website/lib/quizzes/lesson1.ts', fileContent);
console.log('Done!');
