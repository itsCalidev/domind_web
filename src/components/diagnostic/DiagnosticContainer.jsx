import { useState } from "react";
import QuizForm         from "./QuizForm";
import ResultsDashboard from "./ResultsDashboard";
import { FONT_IMPORT, NAVBAR_OFFSET } from "./utils/diagnosticData";

// ─── IDLE SCREEN ──────────────────────────────────────────────────────────────

function IdleScreen({ onStart }) {
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

      <div style={{ maxWidth: 560, width: "100%" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.97)",
            borderRadius: 28,
            padding: "52px 44px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
            textAlign: "center",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 72,
              height: 72,
              background: "linear-gradient(135deg, #1e3a5f, #1e40af)",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 28px",
              boxShadow: "0 8px 24px rgba(30,64,175,0.35)",
            }}
          >
            <svg width="36" height="36" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>

          <h1
            style={{
              fontSize: "clamp(24px, 5vw, 32px)",
              fontWeight: 900,
              color: "#0f172a",
              marginBottom: 12,
              lineHeight: 1.2,
            }}
          >
            Diagnóstico Estratégico Organizacional
          </h1>

          <p style={{ color: "#64748b", fontSize: 16, marginBottom: 36, lineHeight: 1.6 }}>
            Evalúa el clima laboral, liderazgo y condiciones de tu equipo. Recibe un análisis
            detallado con gráficos, matriz de riesgo y plan de acción personalizado
          </p>

          {/* Features list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              marginBottom: 36,
              textAlign: "left",
            }}
          >
            {[
              { icon: "📊", title: "15 preguntas rápidas",       sub: "Evaluación completa en menos de 5 minutos" },
              { icon: "🎯", title: "Análisis por dimensiones",   sub: "Velocímetro, semáforos y matriz de riesgo en vivo" },
              { icon: "📄", title: "Reporte PDF descargable",    sub: "Plan de 90 días con métricas de seguimiento" },
            ].map((f) => (
              <div key={f.title} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>{f.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>{f.title}</div>
                  <div style={{ color: "#64748b", fontSize: 13 }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={onStart}
            style={{
              width: "100%",
              padding: "18px",
              background: "linear-gradient(135deg, #1e3a5f, #1e40af)",
              border: "none",
              borderRadius: 16,
              color: "#fff",
              fontSize: 17,
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(30,64,175,0.45)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(30,64,175,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(30,64,175,0.45)";
            }}
          >
            Comenzar Diagnóstico Gratuito →
          </button>

          <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 16 }}>
            * No requiere registro ni información personal
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        paddingTop: NAVBAR_OFFSET,
      }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ position: "relative", width: 80, height: 80 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "4px solid rgba(255,255,255,0.1)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "4px solid transparent",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin 0.9s linear infinite",
          }}
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <h3
          style={{
            color: "#f8fafc",
            fontSize: 24,
            fontWeight: 800,
            margin: "0 0 8px",
          }}
        >
          Calculando resultados...
        </h3>
        <p style={{ color: "#64748b", fontSize: 15, margin: 0 }}>
          Analizando tus respuestas y generando el informe
        </p>
      </div>
    </div>
  );
}

// ─── STATE MACHINE ─────────────────────────────────────────────────────────────

/**
 * DiagnosticContainer
 * Top-level state machine: idle → answering → loading → result_ready
 */
export default function DiagnosticContainer() {
  const [state,      setState]      = useState("idle");
  const [totalScore, setTotalScore] = useState(0);
  const [dimScores,  setDimScores]  = useState([]);
  const [answers, setAnswers] = useState([]);
  const [evaluationId, setEvaluationId] = useState(null);

  const handleStart = () => setState("answering");

const handleQuizComplete = async (score, dims, finalAnswers) => {
    setTotalScore(score);
    setDimScores(dims);
    setAnswers(finalAnswers);
    setState("loading"); 

    try {
      const response = await fetch('http://localhost:3000/evaluations/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers })
      });
      const data = await response.json();
      if (data.evaluationId) {
        setEvaluationId(data.evaluationId); 
      }
    } catch (e) {
      console.error("Error silencioso al guardar datos", e);
    }

    setTimeout(() => setState("result_ready"), 2000);
  };

  const handleReset = () => {
    setState("idle");
    setTotalScore(0);
    setDimScores([]);
    setAnswers([]);
  };

  if (state === "idle")         return <IdleScreen onStart={handleStart} />;
  if (state === "answering")    return <QuizForm onComplete={handleQuizComplete} />;
  if (state === "loading")      return <LoadingScreen />;
  if (state === "result_ready") {
    return (
      <ResultsDashboard
        totalScore={totalScore}
        dimScores={dimScores}
        onReset={handleReset}
        evaluationId={evaluationId}
      />
    );
  }
  return null;
}
