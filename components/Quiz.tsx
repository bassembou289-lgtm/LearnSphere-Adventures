import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface QuizProps {
  questions: QuizQuestion[];
  onSubmit: (score: number, correctAnswers: number, totalQuestions: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onSubmit }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [lastClicked, setLastClicked] = useState<{ qIndex: number; oIndex: number } | null>(null);
  const { t } = useTranslation();

  const handleSelectAnswer = (questionIndex: number, option: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionIndex]: option }));
    setLastClicked({ qIndex: questionIndex, oIndex: optionIndex });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        correctCount++;
      }
    });
    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    onSubmit(scorePercentage, correctCount, questions.length);
  };

  const getOptionStyling = (q: QuizQuestion, option: string, index: number) => {
    let bgClass = '';
    let animationClass = '';

    if (!submitted) {
      bgClass = answers[index] === option ? 'bg-yellow-300' : 'bg-white hover:bg-yellow-100';
    } else {
      if (option === q.answer) {
        bgClass = 'bg-green-300';
        animationClass = 'animate-correct-reveal';
      } else if (answers[index] === option && option !== q.answer) {
        bgClass = 'bg-red-300';
        animationClass = 'animate-incorrect-reveal';
      } else {
        bgClass = 'bg-gray-100 opacity-60';
      }
    }
    return `${bgClass} ${animationClass}`;
  };

  return (
    <div className="space-y-6">
      {questions.map((q, index) => (
        <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md">
          <p className="text-lg font-bold text-gray-800 mb-4">{index + 1}. {q.q}</p>
          <div className="space-y-3">
            {q.options.map((option, optionIndex) => {
              const isPulsing = lastClicked?.qIndex === index && lastClicked?.oIndex === optionIndex;
              const stylingClasses = getOptionStyling(q, option, index);
              
              return (
                <button
                  key={optionIndex}
                  onClick={() => handleSelectAnswer(index, option, optionIndex)}
                  onAnimationEnd={() => setLastClicked(null)}
                  disabled={submitted}
                  className={`w-full text-start p-4 rounded-lg border-2 transition-all duration-200 ${
                    stylingClasses
                  } ${
                    isPulsing ? 'animate-pulse-once' : ''
                  } ${
                    answers[index] === option ? 'border-yellow-500' : 'border-gray-200'
                  } ${
                    submitted ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== questions.length}
          className="w-full bg-green-500 text-white font-black py-4 px-6 rounded-xl text-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {t('quiz.submit')}
        </button>
      )}
    </div>
  );
};

export default Quiz;