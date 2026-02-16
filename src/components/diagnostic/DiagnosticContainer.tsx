import { useState } from 'react';
import QuizForm from './QuizForm';
import ResultsDashboard from './ResultsDashboard';

export type Answer = {
  questionId: number;
  value: number; // 0 = Nunca, 1 = A veces, 2 = Siempre
};

export default function DiagnosticContainer() {
  const [step, setStep] = useState<'quiz' | 'results'>('quiz');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState<number>(0);

  const handleQuizComplete = (userAnswers: Answer[]) => {
    setAnswers(userAnswers);
    
    // Calcular puntaje (simulado)
    const totalScore = userAnswers.reduce((acc, curr) => acc + curr.value, 0);
    const avgScore = totalScore / userAnswers.length;
    const finalScore = Number((avgScore * 1.4 + 1).toFixed(1)); // Escala 1-4
    
    setScore(finalScore);
    setStep('results');
  };

  const handleRestart = () => {
    setAnswers([]);
    setScore(0);
    setStep('quiz');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {step === 'quiz' ? (
        <QuizForm onComplete={handleQuizComplete} />
      ) : (
        <ResultsDashboard score={score} answers={answers} onRestart={handleRestart} />
      )}
    </div>
  );
}