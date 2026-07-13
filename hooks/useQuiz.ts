import { useState, useCallback } from "react";
import { validateQuizAnswerAction, markQuizDoneAction } from "@/app/actions/quiz";

export interface QuizStateOptions {
  lessonId: number;
  displayQuestions: any[];
}

export function useQuiz({ lessonId, displayQuestions }: QuizStateOptions) {
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(displayQuestions.length).fill(null));
  const [validatedCorrectAnswers, setValidatedCorrectAnswers] = useState<(number | null)[]>(new Array(displayQuestions.length).fill(null));
  const [answers, setAnswers] = useState<number[]>(new Array(displayQuestions.length).fill(-1));
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [mistakesList, setMistakesList] = useState<{questionId: string, userAnswer: string}[]>([]);
  
  // Animation States
  const [animState, setAnimState] = useState<'idle'|'exiting'|'entering'>('idle');
  const [showFlash, setShowFlash] = useState(false);
  const [showShake, setShowShake] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);

  const currentQuestion = displayQuestions[currentQuestionIndex];
  const currentSelected = selectedAnswers[currentQuestionIndex];
  const currentValidated = validatedCorrectAnswers[currentQuestionIndex];
  const hasAnsweredCurrent = currentSelected !== null;

  const handleSelectAnswer = async (optionIndex: number) => {
    if (hasAnsweredCurrent) return;
    
    const newSelected = [...selectedAnswers];
    newSelected[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newSelected);

    try {
      const res = await validateQuizAnswerAction(lessonId, currentQuestionIndex, optionIndex);
      const isCorrect = res.isCorrect;
      
      const newValidated = [...validatedCorrectAnswers];
      newValidated[currentQuestionIndex] = res.correctOptionIndex ?? null;
      setValidatedCorrectAnswers(newValidated);
      
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = isCorrect ? 1 : 0;
      setAnswers(newAnswers);
      
      if (isCorrect) {
        setScore(s => s + 1);
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 400);
        
        const newParticles = [];
        const colors = ['#22C55E', '#3D52A0', '#FCD34D', '#F9A8D4'];
        for (let i = 0; i < 8; i++) {
          newParticles.push({
            id: Math.random(),
            color: colors[Math.floor(Math.random() * colors.length)],
            tx: `${(Math.random() - 0.5) * 160}px`,
            ty: `${(Math.random() - 0.5) * 160}px`
          });
        }
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 600);
      } else {
        setMistakesList(prev => [
          ...prev,
          {
            questionId: currentQuestion._key || currentQuestion.id,
            userAnswer: currentQuestion.options[optionIndex]
          }
        ]);
        setShowShake(true);
        setTimeout(() => setShowShake(false), 500);
      }
    } catch (e) {
      console.error(e);
      const revertedSelected = [...selectedAnswers];
      revertedSelected[currentQuestionIndex] = null;
      setSelectedAnswers(revertedSelected);
    }
  };

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex === displayQuestions.length - 1) return;
    setAnimState('exiting');
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnimState('entering');
      setTimeout(() => setAnimState('idle'), 500);
    }, 450);
  }, [currentQuestionIndex, displayQuestions.length]);

  const handlePrevQuestion = useCallback(() => {
    if (currentQuestionIndex === 0) return;
    setAnimState('exiting');
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev - 1);
      setAnimState('entering');
      setTimeout(() => setAnimState('idle'), 500);
    }, 450);
  }, [currentQuestionIndex]);

  const handleFinishQuiz = useCallback(() => {
    setIsFinished(true);
    markQuizDoneAction((100 + lessonId).toString(), score, mistakesList);
  }, [lessonId, score, mistakesList]);

  const handleReviewMistakes = useCallback(() => {
    setIsFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers(new Array(displayQuestions.length).fill(-1));
    setSelectedAnswers(new Array(displayQuestions.length).fill(null));
    setValidatedCorrectAnswers(new Array(displayQuestions.length).fill(null));
    setMistakesList([]);
  }, [displayQuestions.length]);

  return {
    currentQuestionIndex,
    currentQuestion,
    currentSelected,
    currentValidated,
    hasAnsweredCurrent,
    answers,
    score,
    isFinished,
    animState,
    showFlash,
    showShake,
    particles,
    handleSelectAnswer,
    handleNextQuestion,
    handlePrevQuestion,
    handleFinishQuiz,
    handleReviewMistakes
  };
}
