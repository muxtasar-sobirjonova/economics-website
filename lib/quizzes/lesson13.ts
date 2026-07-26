import { Question } from "../types";

export const LESSON_13_QUESTIONS: Question[] = [
  {

    _key: 'q1',

    type: 'multiple-choice',

    questionText: "What is a Sunk Cost?",
    options: [
      "Money spent on a submarine",
      "A cost that has already been incurred and cannot be recovered",
      "A future expense you plan to make",
      "The cost of hiring an employee"
    ],
    correctAnswer: "A cost that has already been incurred and cannot be recovered",
    explanation: "Sunk costs are past expenses that are permanently lost, regardless of what you do next."
  },
  {

    _key: 'q2',

    type: 'multiple-choice',

    questionText: "What is the 'Sunk Cost Fallacy'?",
    options: [
      "Ignoring past costs when making decisions",
      "Continuing a failing project because you have already invested heavily in it",
      "Selling a business too early",
      "Refusing to spend money on marketing"
    ],
    correctAnswer: "Continuing a failing project because you have already invested heavily in it",
    explanation: "The fallacy is letting unrecoverable past costs influence your future decision-making."
  },
  {

    _key: 'q3',

    type: 'multiple-choice',

    questionText: "If you spent $10,000 building a feature that nobody wants, what should you do?",
    options: [
      "Spend another $5,000 to market it so the $10,000 isn't 'wasted'",
      "Abandon the feature because the $10,000 is a sunk cost",
      "Force users to use it",
      "Sue the developers"
    ],
    correctAnswer: "Abandon the feature because the $10,000 is a sunk cost",
    explanation: "The $10k is gone. Spending more money on a failed premise is irrational."
  },
  {

    _key: 'q4',

    type: 'multiple-choice',

    questionText: "Why do entrepreneurs struggle with sunk costs?",
    options: [
      "Because accounting software is confusing",
      "Because human psychology hates admitting loss and failure",
      "Because investors force them to keep going",
      "Because there is always a chance of a miracle"
    ],
    correctAnswer: "Because human psychology hates admitting loss and failure",
    explanation: "It hurts the ego to admit that time and money were wasted, leading founders to stubbornly double down."
  },
  {

    _key: 'q5',

    type: 'multiple-choice',

    questionText: "Rational economic decisions should be based on:",
    options: [
      "How much you have already suffered",
      "Future costs and future benefits only",
      "The opinions of your competitors",
      "The initial budget of the project"
    ],
    correctAnswer: "Future costs and future benefits only",
    explanation: "Only the marginal (future) costs and expected future benefits matter when deciding the next step."
  }
];