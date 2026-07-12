"use client";

import { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Question } from "../lib/types";
import { markQuizDoneAction } from "@/app/actions/progress";

export default function QuizSection({
  quizId,
  questions,
  onAnsweredChange,
}: {
  quizId: string;
  questions: Question[];
  onAnsweredChange?: (count: number) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const retryMode = searchParams?.get("retry") === "true";
  const [, startTransition] = useTransition();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [eliminated, setEliminated] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (onAnsweredChange) onAnsweredChange(Object.keys(answers).length);
  }, [answers, onAnsweredChange]);

  if (!questions || questions.length === 0) {
    return null;
  }

  const handleEliminate = (e: React.MouseEvent, questionId: string, answer: string) => {
    e.stopPropagation();
    if (submitted) return;
    setEliminated(prev => {
      const qs = prev[questionId] || [];
      if (qs.includes(answer)) {
        return { ...prev, [questionId]: qs.filter(a => a !== answer) };
      } else {
        return { ...prev, [questionId]: [...qs, answer] };
      }
    });
  };

  const handleSelect = (questionId: string, answer: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    let currentScore = 0;
    const mistakes: { questionId: string; userAnswer: string; questionText?: string; correctAnswer?: string; explanation?: string }[] = [];

    questions.forEach((q: any) => {
      let isCorrect = false;
      if (q.type === "multiple-choice" && answers[q._key] === q.correctAnswer) {
        isCorrect = true;
      } else if (
        q.type === "open-ended" &&
        answers[q._key]?.trim().length > 0
      ) {
        isCorrect = true;
      }

      if (isCorrect) {
        currentScore++;
      } else {
        mistakes.push({ 
          questionId: q._key, 
          userAnswer: answers[q._key] ?? "",
          questionText: typeof q.questionText === 'string' ? q.questionText : "Question text missing",
          correctAnswer: q.correctAnswer || "",
          explanation: q.explanation || ""
        });
      }
    });

    setScore(currentScore);
    setSubmitted(true);

    const overallScore = Math.round(
      ((questions.length - mistakes.length) / questions.length) * 100,
    );
    
    startTransition(async () => {
      try {
        await markQuizDoneAction(quizId, overallScore, mistakes);
        router.refresh();
      } catch (err) {
        console.error("Failed to submit quiz results", err);
      }
    });
  };

  return (
    <div className="mt-12">
      <h2 style={{ color: '#1A1A2E', fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
        {retryMode ? "Review Your Mistakes" : "Comprehension Check"}
      </h2>

      {questions.map((q, idx) => (
        <div
          key={q._key}
          className="bg-gradient-to-br from-[#EEF3FF] to-[#F8F9FC] rounded-2xl p-4 sm:p-6 mb-4 border border-[#C7D7FF]"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ background: '#7B6FE7', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.06em' }}>
              QUESTION {idx + 1} OF {questions.length}
            </div>
            <div style={{ fontSize: '10px', color: '#888', fontWeight: 600 }}>
              ⚡ Medium
            </div>
          </div>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#111111', lineHeight: '1.6', marginBottom: '18px' }}>
            {q.questionText}
          </p>

          {q.type === "multiple-choice" && q.options && (
            <div className="space-y-3">
              {q.options.map((opt) => {
                const isSelected = answers[q._key] === opt;
                const isEliminated = eliminated[q._key]?.includes(opt);
                const isCorrect = q.correctAnswer === opt;
                
                const optionStyle: React.CSSProperties = {
                  background: '#ffffff',
                  border: '1px solid #E0E7FF',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  width: '100%',
                  textAlign: 'left'
                };

                if (submitted) {
                  if (isSelected && isCorrect) {
                    optionStyle.border = "2px solid #22c55e";
                    optionStyle.background = "#f0fdf4";
                  } else if (isSelected && !isCorrect) {
                    optionStyle.border = "2px solid #ef4444";
                    optionStyle.background = "#fef2f2";
                  } else if (!isSelected && isCorrect) {
                    optionStyle.border = "2px solid #22c55e";
                    optionStyle.background = "#f0fdf4";
                  } else {
                    optionStyle.opacity = 0.5;
                  }
                } else if (isEliminated) {
                  optionStyle.opacity = 0.4;
                  optionStyle.textDecoration = 'line-through';
                } else if (isSelected) {
                  optionStyle.background = '#7B6FE7';
                  optionStyle.borderColor = '#7B6FE7';
                  optionStyle.color = '#ffffff';
                  optionStyle.fontWeight = 600;
                  optionStyle.transform = 'translateX(0)';
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(q._key, opt)}
                    disabled={submitted}
                    style={optionStyle}
                    onMouseEnter={(e) => {
                      if (!submitted && !isSelected) {
                        e.currentTarget.style.borderColor = '#7B6FE7';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(61,82,160,0.12)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!submitted && !isSelected) {
                        e.currentTarget.style.borderColor = '#E0E7FF';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }
                    }}
                  >
                    <span style={{ color: isSelected ? '#ffffff' : '#1A1A2E', fontSize: '14px', fontWeight: isSelected ? 600 : 400 }}>{opt}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {!isSelected && (
                        <span 
                          onClick={(e) => handleEliminate(e, q._key, opt)}
                          style={{ 
                            color: isEliminated ? '#ef4444' : '#C7D7FF', 
                            fontSize: '18px', 
                            fontWeight: 'bold',
                            padding: '0 4px',
                            cursor: 'pointer'
                          }}
                        >
                          -
                        </span>
                      )}
                      <span style={{ color: isSelected ? 'rgba(255,255,255,0.5)' : '#C7D7FF', fontSize: '16px' }}>→</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {q.type === "open-ended" && (
            <div className="mt-3">
              <textarea
                value={answers[q._key] || ""}
                onChange={(e) => handleSelect(q._key, e.target.value)}
                disabled={submitted}
                className={`w-full p-3 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  submitted
                    ? "border-green-500 bg-green-50 text-gray-700"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
                rows={3}
                placeholder="Type your answer here..."
              />
            </div>
          )}

          {submitted && q.explanation && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100">
              <span className="font-semibold text-[#0096a5] block mb-1">
                Explanation:
              </span>
              {q.explanation}
            </div>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length === 0}
          style={{ background: '#7B6FE7', color: '#ffffff', opacity: Object.keys(answers).length === 0 ? 0.5 : 1, fontWeight: 700, fontSize: '15px', borderRadius: '8px', padding: '14px 32px', width: '100%', border: 'none', cursor: Object.keys(answers).length === 0 ? 'not-allowed' : 'pointer' }}
        >
          Submit Answers
        </button>
      ) : (
        <div className="mt-8 text-center bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#1F2937]">Quiz Complete!</h3>
            <div className="bg-[#7B6FE7] text-white text-sm font-bold px-4 py-1.5 rounded-full">
              {questions.length - Object.keys(eliminated).length} / {questions.length} Correct
            </div>
          </div>
          <p className="text-brand-primary font-medium mb-2 uppercase tracking-wider text-xs">
            Your Score
          </p>
          <div className="text-5xl font-bold text-brand-primary mb-2">
            {score} / {questions.length}
          </div>
          <p className="text-brand-primary text-sm mb-6">
            {score === questions.length
              ? "Perfect score! Great job."
              : "Good effort! Review the explanations above."}
          </p>
          <button
            onClick={() => router.push("/roadmap")}
            className="bg-brand-primary hover:bg-[#5A4FBD] text-white px-7 py-[13px] rounded-[50px] font-bold text-sm transition-colors shadow-[0_4px_12px_rgba(123,111,231,0.3)]"
          >
            Back to Roadmap →
          </button>
        </div>
      )}
    </div>
  );
}
