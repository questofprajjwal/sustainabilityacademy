'use client';

import type { QuizQuestion, QuizState } from '@/lib/types';

interface Props {
  questions: QuizQuestion[];
  lessonId: string;
  quizState: QuizState;
  onSaveAnswer: (qIndex: number, answer: number) => void;
  onSubmitAnswer: (qIndex: number) => void;
}

export default function Quiz({ questions, lessonId, quizState, onSaveAnswer, onSubmitAnswer }: Props) {
  if (!questions || questions.length === 0) return null;

  const { answers, submitted } = quizState;

  const allSubmitted = questions.every((_, i) => submitted[i]);
  const correctCount = questions.filter((q, i) => submitted[i] && answers[i] === q.answer).length;

  return (
    <section aria-label="Lesson Quiz" className="mt-8 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <span aria-hidden>📝</span> Knowledge Check
      </h2>

      {allSubmitted && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            correctCount === questions.length
              ? 'bg-green-50 border border-green-300 text-green-800'
              : 'bg-blue-50 border border-blue-300 text-blue-800'
          }`}
          role="status"
          aria-live="polite"
        >
          <span className="text-2xl" aria-hidden>
            {correctCount === questions.length ? '🎉' : '📊'}
          </span>
          <div>
            <p className="font-semibold">Score: {correctCount}/{questions.length}</p>
            <p className="text-sm">
              {correctCount === questions.length
                ? 'Perfect score! Ready to move on.'
                : 'Review the explanations below and try again.'}
            </p>
          </div>
        </div>
      )}

      {questions.map((q, qIdx) => {
        const isSubmitted = !!submitted[qIdx];
        const selected = answers[qIdx];
        const isCorrect = isSubmitted && selected === q.answer;

        return (
          <div key={qIdx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="font-semibold text-gray-800 mb-4" id={`q-${lessonId}-${qIdx}-label`}>
              <span className="text-gray-400 mr-2 text-sm">{qIdx + 1}.</span>
              {q.question}
            </p>

            <div
              role="radiogroup"
              aria-labelledby={`q-${lessonId}-${qIdx}-label`}
              className="space-y-2"
              // Arrow key navigation between radio options
              onKeyDown={e => {
                if (isSubmitted) return;
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                  e.preventDefault();
                  const next = ((selected ?? -1) + 1) % q.options.length;
                  onSaveAnswer(qIdx, next);
                  (e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[next])?.focus();
                }
                if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                  e.preventDefault();
                  const prev = ((selected ?? 0) - 1 + q.options.length) % q.options.length;
                  onSaveAnswer(qIdx, prev);
                  (e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[prev])?.focus();
                }
              }}
            >
              {q.options.map((option, optIdx) => {
                const isSelected = selected === optIdx;
                const isAnswer = q.answer === optIdx;

                let optionClass =
                  'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 ';

                if (!isSubmitted) {
                  optionClass += isSelected
                    ? 'border-green-500 bg-green-50 text-green-800 font-medium focus:ring-green-500'
                    : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-gray-700 focus:ring-gray-400';
                } else {
                  if (isAnswer) {
                    optionClass += 'border-green-500 bg-green-50 text-green-800 font-medium';
                  } else if (isSelected && !isAnswer) {
                    optionClass += 'border-red-400 bg-red-50 text-red-700';
                  } else {
                    optionClass += 'border-gray-200 text-gray-500';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    role="radio"
                    aria-checked={isSelected}
                    aria-disabled={isSubmitted}
                    // Keep focusable after submission so screen readers can review answers/explanations
                    tabIndex={isSelected || (!isSubmitted && optIdx === 0) ? 0 : -1}
                    className={optionClass}
                    onClick={() => {
                      if (isSubmitted) return;
                      onSaveAnswer(qIdx, optIdx);
                    }}
                    onKeyDown={e => {
                      if (isSubmitted) return;
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSaveAnswer(qIdx, optIdx);
                      }
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs ${
                          isSelected
                            ? isSubmitted
                              ? isAnswer
                                ? 'border-green-500 bg-green-500 text-white'
                                : 'border-red-400 bg-red-400 text-white'
                              : 'border-green-500 bg-green-500 text-white'
                            : isSubmitted && isAnswer
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-gray-300'
                        }`}
                        aria-hidden
                      >
                        {isSubmitted && isAnswer ? '✓' : isSubmitted && isSelected ? '✗' : ''}
                      </span>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {!isSubmitted && (
              <button
                className="mt-4 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                disabled={selected === undefined}
                onClick={() => onSubmitAnswer(qIdx)}
              >
                Check Answer
              </button>
            )}

            {isSubmitted && q.explanation && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm ${
                  isCorrect
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
                role="note"
                aria-label="Explanation"
              >
                <span className="font-semibold mr-1">{isCorrect ? '✓ Correct!' : '→ Explanation:'}</span>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
