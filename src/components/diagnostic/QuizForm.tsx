import { useState } from "react";
import { ClipboardList } from "lucide-react";
import type { Answer } from "./DiagnosticContainer";

const questions = [
  {
    id: 1,
    text: "¿Con qué frecuencia siente que su carga de trabajo es manejable?",
    category: "Condiciones Laborales",
  },
  {
    id: 2,
    text: "¿Considera que tiene oportunidades de crecimiento en su organización?",
    category: "Desarrollo",
  },
  {
    id: 3,
    text: "¿Qué tan frecuentemente recibe retroalimentación de su supervisor?",
    category: "Liderazgo",
  },
  {
    id: 4,
    text: "¿Se siente seguro reportando incidentes o riesgos en su trabajo?",
    category: "Seguridad",
  },
  {
    id: 5,
    text: "¿Con qué frecuencia experimenta estrés relacionado con el trabajo?",
    category: "Riesgos Psicosociales",
  },
];

const options = [
  { label: "Nunca", value: 0, color: "bg-red-500" },
  { label: "A veces", value: 1, color: "bg-yellow-500" },
  { label: "Siempre", value: 2, color: "bg-green-500" },
];

interface QuizFormProps {
  onComplete: (answers: Answer[]) => void;
}

export default function QuizForm({ onComplete }: QuizFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const handleAnswer = () => {
    if (selectedValue === null) return;

    const newAnswers = [
      ...answers,
      { questionId: questions[currentQuestion].id, value: selectedValue },
    ];
    setAnswers(newAnswers);
    setSelectedValue(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <ClipboardList className="w-8 h-8 text-blue-900" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Diagnóstico Organizacional
        </h1>
        <p className="text-gray-600">
          Responde las siguientes preguntas para obtener tu reporte
          personalizado
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Pregunta {currentQuestion + 1} de {questions.length}
          </span>
          <span className="text-sm font-medium text-blue-900">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-900 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-6">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-900 text-sm font-semibold rounded-full mb-4">
            {questions[currentQuestion].category}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            {questions[currentQuestion].text}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedValue(option.value)}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedValue === option.value
                  ? "border-blue-900 bg-blue-50 shadow-md scale-105"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedValue === option.value
                      ? "border-blue-900 bg-blue-900"
                      : "border-gray-300"
                  }`}
                >
                  {selectedValue === option.value && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${option.color}`}></div>
                  <span className="text-lg font-semibold text-gray-900">
                    {option.label}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            if (currentQuestion > 0) {
              setCurrentQuestion(currentQuestion - 1);
              setSelectedValue(answers[currentQuestion - 1]?.value ?? null);
              setAnswers(answers.slice(0, -1));
            }
          }}
          disabled={currentQuestion === 0}
          className="px-6 py-3 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        <button
          onClick={handleAnswer}
          disabled={selectedValue === null}
          className="px-8 py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {currentQuestion === questions.length - 1
            ? "Ver Resultados"
            : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
