import { Question } from "../types";

export const LESSON_11_QUESTIONS: Question[] = [
  {

    _key: 'q1',

    type: 'multiple-choice',

    questionText: "What does 'Capital Scarcity' mean for a startup?",
    options: [
      "The business is located far from a capital city",
      "The business has a limited amount of cash to operate and grow",
      "The business has too many investors",
      "The business cannot use capital letters in its branding"
    ],
    correctAnswer: "The business has a limited amount of cash to operate and grow",
    explanation: "Capital scarcity refers to the strict limitation of financial resources available to the company."
  },
  {

    _key: 'q2',

    type: 'multiple-choice',

    questionText: "What is 'Runway' in the context of capital scarcity?",
    options: [
      "The physical space needed for an office",
      "The amount of time a company has before it runs out of cash",
      "A fashion show for entrepreneurs",
      "The speed at which a product is built"
    ],
    correctAnswer: "The amount of time a company has before it runs out of cash",
    explanation: "Runway is calculated by dividing total cash by the monthly burn rate, showing how many months you can survive."
  },
  {

    _key: 'q3',

    type: 'multiple-choice',

    questionText: "Why is budgeting critical when capital is scarce?",
    options: [
      "Because accountants need work to do",
      "Because it prevents spending on non-essential items and extends runway",
      "Because investors like colorful spreadsheets",
      "Because it guarantees the product will be successful"
    ],
    correctAnswer: "Because it prevents spending on non-essential items and extends runway",
    explanation: "Budgeting forces prioritization, ensuring limited cash is spent only on things that generate value."
  },
  {

    _key: 'q4',

    type: 'multiple-choice',

    questionText: "Which is a common strategy to survive capital scarcity?",
    options: [
      "Hiring as many people as possible",
      "Bootstrapping and keeping fixed costs extremely low",
      "Renting the most expensive office space",
      "Spending heavily on unproven marketing channels"
    ],
    correctAnswer: "Bootstrapping and keeping fixed costs extremely low",
    explanation: "Keeping costs low (bootstrapping) is the primary defense mechanism against running out of cash."
  },
  {

    _key: 'q5',

    type: 'multiple-choice',

    questionText: "How does capital scarcity force creativity?",
    options: [
      "It doesn't; it prevents creativity",
      "It forces founders to find cheap, unconventional solutions to problems",
      "It makes founders hire expensive design agencies",
      "It allows founders to buy their way out of problems"
    ],
    correctAnswer: "It forces founders to find cheap, unconventional solutions to problems",
    explanation: "When you can't buy a solution, you must invent one. Constraints breed creative problem solving."
  }
];