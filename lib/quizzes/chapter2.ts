import { Question } from "../types";

export const CHAPTER_2_QUIZ_QUESTIONS: Question[] = [
  {

    _key: 'q1',

    type: 'multiple-choice',

    questionText: "The core problem of economics that entrepreneurs navigate is:",
    options: [
      "Inflation",
      "Scarcity",
      "Government Regulation",
      "Taxation"
    ],
    correctAnswer: "Scarcity",
    explanation: "Scarcity is the fundamental reality that resources are limited while desires are infinite."
  },
  {

    _key: 'q2',

    type: 'multiple-choice',

    questionText: "When an entrepreneur gives up a secure salary to build a high-risk startup, what economic concept is this?",
    options: [
      "Sunk Cost",
      "Opportunity Cost",
      "Market Failure",
      "Information Asymmetry"
    ],
    correctAnswer: "Opportunity Cost",
    explanation: "The salary given up is the opportunity cost of pursuing the startup."
  },
  {

    _key: 'q3',

    type: 'multiple-choice',

    questionText: "Which of these is the defining characteristic of a Sunk Cost?",
    options: [
      "It can be refunded if the project fails",
      "It cannot be recovered no matter what future action is taken",
      "It only applies to physical goods",
      "It is a tax deductible expense"
    ],
    correctAnswer: "It cannot be recovered no matter what future action is taken",
    explanation: "Sunk costs are gone forever and should mathematically have zero weight in future decisions."
  },
  {

    _key: 'q4',

    type: 'multiple-choice',

    questionText: "A founder realizes a marketing campaign is failing after spending $5k of a $10k budget. What is the rational choice?",
    options: [
      "Spend the remaining $5k to see it through",
      "Stop the campaign and save the remaining $5k for a better alternative",
      "Spend $15k to overpower the failure",
      "Refund the $5k"
    ],
    correctAnswer: "Stop the campaign and save the remaining $5k for a better alternative",
    explanation: "The $5k spent is a sunk cost. The rational move is to stop throwing good money after bad."
  },
  {

    _key: 'q5',

    type: 'multiple-choice',

    questionText: "How does capital scarcity benefit an early-stage startup?",
    options: [
      "It guarantees failure",
      "It forces disciplined prioritization, creativity, and prevents bloated spending",
      "It scares away competitors",
      "It makes the product build itself"
    ],
    correctAnswer: "It forces disciplined prioritization, creativity, and prevents bloated spending",
    explanation: "Constraints force focus. Having too much money often leads to building things nobody wants."
  }
];