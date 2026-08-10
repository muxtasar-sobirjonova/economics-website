import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateQuizAnswerAction, markQuizDoneAction } from "@/app/actions/quiz";
import type { Mistake } from "@/types";

export interface QuizQuestionLike {
  _key?: string;
  id?: string;
  questionText?: string;
  question?: string;
  options: string[];
}

interface Particle {
  id: number;
  color: string;
  tx: string;
  ty: string;
}

export interface QuizStateOptions {
  lessonId: number;
  displayQuestions: QuizQuestionLike[];
}

export function useQuiz({ lessonId, displayQuestions }: QuizStateOptions) {
  const router = useRouter();
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(displayQuestions.length).fill(null));
  const [validatedCorrectAnswers, setValidatedCorrectAnswers] = useState<(number | null)[]>(new Array(displayQuestions.length).fill(null));
  const [answers, setAnswers] = useState<number[]>(new Array(displayQuestions.length).fill(-1));
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [mistakesList, setMistakesList] = useState<Mistake[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Animation States
  const [animState, setAnimState] = useState<'idle'|'exiting'|'entering'>('idle');
  const [showFlash, setShowFlash] = useState(false);
  const [showShake, setShowShake] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load state from local storage on mount
  useEffect(() => {
    const key = `quiz-state-${lessonId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.displayQuestionsLength === displayQuestions.length) {
          setCurrentQuestionIndex(parsed.currentQuestionIndex);
          setSelectedAnswers(parsed.selectedAnswers);
          setValidatedCorrectAnswers(parsed.validatedCorrectAnswers);
          setAnswers(parsed.answers);
          setScore(parsed.score);
          setMistakesList(parsed.mistakesList || []);
          setIsFinished(parsed.isFinished || false);
        }
      } catch (e) {
        console.error("Failed to parse quiz state", e);
      }
    }
    setIsHydrated(true);
  }, [lessonId, displayQuestions.length]);

  // Save state to local storage on change
  useEffect(() => {
    if (!isHydrated) return;
    const key = `quiz-state-${lessonId}`;
    
    if (isFinished) {
      localStorage.removeItem(key);
      return;
    }

    const stateToSave = {
      displayQuestionsLength: displayQuestions.length,
      currentQuestionIndex,
      selectedAnswers,
      validatedCorrectAnswers,
      answers,
      score,
      mistakesList,
      isFinished
    };
    localStorage.setItem(key, JSON.stringify(stateToSave));
  }, [
    isHydrated,
    isFinished,
    lessonId,
    displayQuestions.length,
    currentQuestionIndex,
    selectedAnswers,
    validatedCorrectAnswers,
    answers,
    score,
    mistakesList
  ]);

  const currentQuestion = displayQuestions[currentQuestionIndex];
  const currentSelected = selectedAnswers[currentQuestionIndex];
  const currentValidated = validatedCorrectAnswers[currentQuestionIndex];
  const hasAnsweredCurrent = currentValidated !== null;

  const handleSelectAnswer = (optionIndex: number) => {
    if (hasAnsweredCurrent) return;
    const newSelected = [...selectedAnswers];
    newSelected[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newSelected);
  };

  const handleSubmitAnswer = async () => {
    if (hasAnsweredCurrent || currentSelected === null || isSubmitting) return;
    setIsSubmitting(true);
    const optionIndex = currentSelected;

    try {
      const res = await validateQuizAnswerAction(lessonId, currentQuestionIndex, optionIndex);
      if (!res.success) {
        throw new Error(res.error || "Failed to validate quiz answer");
      }
      const isCorrect = res.data.isCorrect;
      
      const newValidated = [...validatedCorrectAnswers];
      newValidated[currentQuestionIndex] = res.data.correctOptionIndex ?? null;
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
            userAnswer: currentQuestion.options[optionIndex],
            questionText: currentQuestion.questionText || currentQuestion.question || "Question text not provided"
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
    } finally {
      setIsSubmitting(false);
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

  const [saveError, setSaveError] = useState<string | null>(null);

  const handleFinishQuiz = useCallback(async () => {
    setIsFinished(true);
    setSaveError(null);
    try {
      const res = await markQuizDoneAction((100 + lessonId).toString(), score, mistakesList);
      if (!res.success) {
        console.error("Failed to mark quiz done:", res.error);
        setSaveError(res.error || "Your result could not be saved.");
        return;
      }
      // Pull fresh XP / agenda / roadmap state into the router cache.
      router.refresh();
    } catch (e) {
      console.error("Failed to mark quiz done:", e);
      setSaveError("Your result could not be saved.");
    }
  }, [lessonId, score, mistakesList, router]);

  const handleReviewMistakes = useCallback(() => {
    setIsFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers(new Array(displayQuestions.length).fill(-1));
    setSelectedAnswers(new Array(displayQuestions.length).fill(null));
    setValidatedCorrectAnswers(new Array(displayQuestions.length).fill(null));
    setMistakesList([]);
    localStorage.removeItem(`quiz-state-${lessonId}`);
  }, [displayQuestions.length, lessonId]);

  return {
    isHydrated,
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
    handleSubmitAnswer,
    handleNextQuestion,
    handlePrevQuestion,
    handleFinishQuiz,
    handleReviewMistakes,
    isSubmitting,
    saveError,
    totalQuestions: displayQuestions.length
  };
}
