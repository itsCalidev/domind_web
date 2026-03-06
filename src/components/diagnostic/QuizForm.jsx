import { useState } from "react";
import {
  QUESTIONS,
  SCALE_OPTIONS,
  computeScores,
  FONT_IMPORT,
  NAVBAR_OFFSET,
} from "./utils/diagnosticData";

/**
 * QuizForm
 * Renders questions one at a time with a progress bar.
 * Calls onComplete(totalScore, dimScores) when the user finishes.
 */
export default function QuizForm({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showError, setShowError] = useState(false);

  const progress = ((current + 1) / QUESTIONS.length) * 100;
  const isLast = current === QUESTIONS.length - 1;

  const handleAnswer = (val) => {
    setAnswers((prev) => ({ ...prev, [current]: val }));
    setShowError(false);
  };

  const handleNext = () => {
    if (answers[current] === undefined) {
      setShowError(true);
      return;
    }
    if (isLast) {
      if (Object.keys(answers).length < QUESTIONS.length) {
        alert("Por favor responde todas las preguntas.");
        return;
      }

      const { totalScore, dimScores } = computeScores(answers);

      // NUEVO: Convertimos el objeto {0: 5, 1: 4...} a un arreglo ordenado [5, 4...]
      const answersArray = Array.from(
        { length: QUESTIONS.length },
        (_, i) => answers[i],
      );

      // NUEVO: Pasamos el tercer parámetro (answersArray)
      onComplete(totalScore, dimScores, answersArray);
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
      setShowError(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `${NAVBAR_OFFSET} 16px 48px`,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      <style>{FONT_IMPORT}</style>

      <div style={{ maxWidth: 640, width: "100%" }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>
              Pregunta {current + 1} de {QUESTIONS.length}
            </span>
            <span style={{ color: "#60a5fa", fontSize: 13, fontWeight: 700 }}>
              {Math.round(progress)}% completado
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(to right, #3b82f6, #6366f1)",
                borderRadius: 99,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Question card */}
        <div
          style={{
            background: "rgba(255,255,255,0.97)",
            borderRadius: 24,
            padding: "40px 36px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          {/* Number badge */}
          <div
            style={{
              width: 48,
              height: 48,
              background: "linear-gradient(135deg, #1e3a5f, #3b82f6)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 900,
              fontSize: 18,
              marginBottom: 20,
            }}
          >
            {current + 1}
          </div>

          {/* Question text */}
          <h2
            style={{
              fontSize: "clamp(18px, 3vw, 24px)",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 28,
              lineHeight: 1.35,
            }}
          >
            {QUESTIONS[current]}
          </h2>

          {/* Answer options */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 24,
            }}
          >
            {SCALE_OPTIONS.map((opt) => {
              const selected = answers[current] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    borderRadius: 14,
                    border: `2px solid ${selected ? "#1e40af" : "#e2e8f0"}`,
                    background: selected ? "#eff6ff" : "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!selected)
                      e.currentTarget.style.borderColor = "#93c5fd";
                  }}
                  onMouseLeave={(e) => {
                    if (!selected)
                      e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: selected ? "#1e40af" : "#1e293b",
                    }}
                  >
                    {opt.label}
                  </span>

                  {/* Radio indicator */}
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: `2px solid ${selected ? "#1e40af" : "#cbd5e1"}`,
                      background: selected ? "#1e40af" : "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {selected && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="white"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Validation error */}
          {showError && (
            <div
              style={{
                marginBottom: 16,
                padding: "12px 16px",
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                borderRadius: 10,
                color: "#b91c1c",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              ⚠️ Por favor selecciona una opción antes de continuar.
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={handlePrev}
              disabled={current === 0}
              style={{
                padding: "13px 20px",
                borderRadius: 12,
                border: "none",
                background: current === 0 ? "#f1f5f9" : "#e2e8f0",
                color: current === 0 ? "#94a3b8" : "#374151",
                fontWeight: 700,
                cursor: current === 0 ? "not-allowed" : "pointer",
                fontSize: 14,
              }}
            >
              Anterior
            </button>

            <button
              onClick={handleNext}
              style={{
                flex: 1,
                padding: "13px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #1e3a5f, #1e40af)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(30,64,175,0.4)",
                transition: "transform 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {isLast ? "Ver Resultados" : "Siguiente"}
            </button>
          </div>

          {/* Counter */}
          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#94a3b8",
              marginTop: 16,
            }}
          >
            {Object.keys(answers).length} de {QUESTIONS.length} preguntas
            respondidas
          </p>
        </div>
      </div>
    </div>
  );
}
