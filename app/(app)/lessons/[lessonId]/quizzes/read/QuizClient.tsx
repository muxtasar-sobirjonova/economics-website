"use client";

import React from "react";
import Link from "next/link";
import { Check, X as XIcon, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "@/hooks/useQuiz";

const LETTERS = ["A", "B", "C", "D"];

import { QuizQuestion } from "@/types";

interface QuizClientProps {
  lessonId: number;
  questions: QuizQuestion[];
}

export default function QuizClient({ lessonId, questions }: QuizClientProps) {
  const displayQuestions = questions.slice(0, 10);

  const {
    isHydrated,
    currentQuestionIndex,
    currentQuestion,
    currentSelected,
    currentValidated,
    hasAnsweredCurrent,
    answers,
    score,
    isFinished,
    showShake,
    handleSelectAnswer,
    handleSubmitAnswer,
    handleNextQuestion,
    handlePrevQuestion,
    handleFinishQuiz,
    isSubmitting,
    saveError,
    totalQuestions,
  } = useQuiz({ lessonId, displayQuestions });

  if (displayQuestions.length === 0) {
    return (
      <div className="p-s7 text-center text-muted">No questions found for this quiz.</div>
    );
  }

  if (!isHydrated) {
    return (
      <div className="p-s8 flex justify-center items-center h-[50vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Same rule the server uses to decide whether the day counts as cleared.
  const passingScore = Math.max(1, Math.ceil(totalQuestions * 0.8));
  const passed = score >= passingScore;

  if (isFinished) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-s4 py-s7 relative overflow-hidden min-h-[70vh]">
        {passed && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            {Array.from({ length: 36 }).map((_, i) => (
              <span
                key={i}
                className="absolute top-0 w-2 h-2 rounded-sm animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ["var(--accent)", "var(--success)", "var(--reward)", "var(--article)"][i % 4],
                  ["--delay" as string]: `${Math.random()}s`,
                  ["--duration" as string]: `${1.6 + Math.random() * 1.4}s`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        <div className="text-label uppercase text-faint mb-s4">
          {passed ? "Day cleared" : "Not this time"}
        </div>

        <div className="font-mono text-display text-ink tabular leading-none animate-popIn">
          {score}<span className="text-muted">/{totalQuestions}</span>
        </div>

        <h2 className="text-h2 font-semibold text-ink mt-s4">
          {score === totalQuestions
            ? "Perfect run."
            : passed
              ? "That unlocks the next day."
              : `You need ${passingScore} to move on.`}
        </h2>

        <p className="text-ui text-muted mt-s3 max-w-[46ch]">
          {passed
            ? "Your plot gains a building and tomorrow opens on the roadmap."
            : "Nothing is lost — reread the concept and the article, then take it again."}
        </p>

        {saveError && (
          <p className="text-meta text-danger mt-s4 max-w-[46ch]">
            {saveError} Check your connection and take the quiz again.
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-s3 mt-s6">
          <Link
            href="/roadmap"
            className="px-s5 py-s3 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors min-h-[44px] flex items-center"
          >
            {passed ? "See your plot" : "Back to roadmap"}
          </Link>
          <Link
            href={`/lessons/${lessonId}/quizzes`}
            className="px-s5 py-s3 rounded-md border border-line-strong text-ink text-ui font-medium hover:border-accent hover:text-accent transition-colors min-h-[44px] flex items-center"
          >
            {passed ? "Back to quiz" : "Try again"}
          </Link>
          {!passed && (
            <Link
              href={`/lessons/${lessonId}/concepts`}
              className="px-s5 py-s3 rounded-md text-muted text-ui hover:text-ink transition-colors min-h-[44px] flex items-center"
            >
              Reread the concept
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Stage bar */}
      <div className="flex items-center justify-between gap-s3 mb-s4">
        <div className="flex items-center gap-s3 min-w-0">
          <Link
            href={`/lessons/${lessonId}/quizzes`}
            className="flex items-center gap-1 text-meta text-muted hover:text-ink transition-colors shrink-0"
          >
            <ArrowLeft size={15} /> Back
          </Link>
          <span className="text-label uppercase px-s2 py-1 rounded-sm bg-quiz-soft text-quiz shrink-0">
            Day {lessonId}
          </span>
        </div>

        <div className="flex items-center gap-s4 shrink-0">
          <span className="font-mono text-meta text-muted tabular">
            {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="font-mono text-meta text-reward tabular">
            ★ {score}/{totalQuestions}
          </span>
        </div>
      </div>

      {/* One segment per question */}
      <div className="flex gap-1 mb-s6" role="progressbar" aria-valuenow={currentQuestionIndex + 1} aria-valuemin={1} aria-valuemax={totalQuestions}>
        {answers.map((status, i) => {
          let cls = "bg-line-strong";
          if (status === 1) cls = "bg-success";
          else if (status === 0) cls = "bg-danger";
          else if (i === currentQuestionIndex) cls = "bg-accent animate-barpulse";
          return <span key={i} className={`flex-1 h-1 rounded-sm ${cls}`} />;
        })}
      </div>

      <div className={showShake ? "animate-shake" : ""}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* Question */}
            <div className="rounded-lg border border-line bg-surface shadow-sh1 p-s5">
              <div className="flex items-center justify-between gap-s3 mb-s4">
                <span className="text-label uppercase text-faint">
                  Question {currentQuestionIndex + 1}
                </span>
                <span className="text-label uppercase text-faint">Medium</span>
              </div>
              <h2 className="text-h2 font-semibold text-ink text-balance">
                {currentQuestion?.questionText || currentQuestion?.question}
              </h2>
            </div>

            {/* Options */}
            <div className="mt-s4 flex flex-col gap-s2">
              {currentQuestion?.options.map((opt: string, idx: number) => {
                const isSelected = currentSelected === idx;
                const isCorrect = idx === currentValidated;

                let box = "border-line bg-surface hover:border-line-strong";
                let badge = "bg-bg-sunk text-muted";

                if (hasAnsweredCurrent) {
                  if (isCorrect) {
                    box = "border-success bg-success-soft";
                    badge = "bg-success text-white";
                  } else if (isSelected) {
                    box = "border-danger bg-danger-soft";
                    badge = "bg-danger text-white";
                  } else {
                    box = "border-line bg-surface opacity-50";
                  }
                } else if (isSelected) {
                  box = "border-accent bg-accent-soft";
                  badge = "bg-accent text-on-accent";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasAnsweredCurrent}
                    onClick={() => handleSelectAnswer(idx)}
                    aria-pressed={isSelected}
                    className={`w-full text-left flex items-center gap-s3 p-s3 rounded-md border transition-colors min-h-[56px] ${box} ${
                      hasAnsweredCurrent ? "cursor-default" : "cursor-pointer"
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-sm grid place-items-center font-mono text-meta shrink-0 ${badge}`}>
                      {LETTERS[idx]}
                    </span>
                    <span className="text-ui text-ink flex-1">{opt}</span>
                    {hasAnsweredCurrent && isCorrect && (
                      <Check size={18} className="text-success shrink-0 animate-popIn" />
                    )}
                    {hasAnsweredCurrent && isSelected && !isCorrect && (
                      <XIcon size={18} className="text-danger shrink-0 animate-popIn" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-s3 mt-s6">
        <button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-s4 py-s3 rounded-md text-ui text-muted hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
        >
          &larr; Previous
        </button>

        {currentQuestionIndex === displayQuestions.length - 1 && hasAnsweredCurrent ? (
          <button
            onClick={handleFinishQuiz}
            className="px-s5 py-s3 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors min-h-[44px]"
          >
            Finish quiz
          </button>
        ) : !hasAnsweredCurrent && currentSelected !== null ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={isSubmitting}
            className="px-s5 py-s3 rounded-md bg-accent text-on-accent text-ui font-semibold hover:bg-accent-strong transition-colors disabled:opacity-50 min-h-[44px]"
          >
            {isSubmitting ? "Checking…" : "Submit"}
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-s5 py-s3 rounded-md border border-line-strong text-ink text-ui font-medium hover:border-accent hover:text-accent transition-colors min-h-[44px]"
          >
            {hasAnsweredCurrent ? "Next question →" : "Skip →"}
          </button>
        )}
      </div>
    </div>
  );
}
