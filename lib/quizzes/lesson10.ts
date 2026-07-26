import { Question } from "../types";

export const LESSON_10_QUESTIONS: Question[] = [
  {

    _key: 'q1',

    type: 'multiple-choice',

    questionText: "What is Opportunity Cost?",
    options: [
      "The financial cost of starting a business",
      "The value of the next best alternative given up",
      "The cost of missed deadlines",
      "The price of goods sold"
    ],
    correctAnswer: "The value of the next best alternative given up",
    explanation: "Opportunity cost is the potential benefit you lose when you choose one alternative over another."
  },
  {

    _key: 'q2',

    type: 'multiple-choice',

    questionText: "If you quit a $100k/year job to start a company that makes $0 in year one, what is your primary opportunity cost?",
    options: [
      "$0",
      "$100,000",
      "The cost of your laptop",
      "Infinite"
    ],
    correctAnswer: "$100,000",
    explanation: "Your opportunity cost is the $100,000 salary you gave up to pursue the startup."
  },
  {

    _key: 'q3',

    type: 'multiple-choice',

    questionText: "Why is calculating opportunity cost difficult in reality?",
    options: [
      "Because calculators are too slow",
      "Because the value of alternative options is often uncertain",
      "Because businesses don't have alternatives",
      "Because money is not real"
    ],
    correctAnswer: "Because the value of alternative options is often uncertain",
    explanation: "It's hard to accurately predict the success of the paths you didn't take."
  },
  {

    _key: 'q4',

    type: 'multiple-choice',

    questionText: "How does opportunity cost apply to reading a book?",
    options: [
      "It is the price of the book",
      "It is the time you spent reading that could have been used elsewhere",
      "Books have no opportunity cost",
      "It is the cost of the electricity for your reading lamp"
    ],
    correctAnswer: "It is the time you spent reading that could have been used elsewhere",
    explanation: "Time is a resource. Spending an hour reading means you gave up an hour of working, sleeping, etc."
  },
  {

    _key: 'q5',

    type: 'multiple-choice',

    questionText: "When should an entrepreneur say 'no' to a new project?",
    options: [
      "Never say no to revenue",
      "When the opportunity cost is higher than the project's expected value",
      "Only when the project is illegal",
      "When the project takes more than a week"
    ],
    correctAnswer: "When the opportunity cost is higher than the project's expected value",
    explanation: "If an alternative use of resources yields a better return, you should reject the lesser project."
  }
];