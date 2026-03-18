import { useState } from "react";
import QuizForm from "./QuizForm";
import ResultsDashboard from "./ResultsDashboard";
import { NAVBAR_OFFSET } from "./utils/diagnosticData";

// ─── SANITIZATION HELPERS ────────────────────────────────────────────────────
// Basic client-side sanitization. Real validation/sanitization MUST also
// be enforced on the NestJS backend before persisting or using the data.

const SANITIZE = {
  /** Remove HTML tags, collapse whitespace, trim. */
  text: (v) =>
    v
      .replace(/<[^>]*>/g, "") // strip any html tags
      .replace(/[<>"'`]/g, "") // strip dangerous chars
      .replace(/\s+/g, " ") // collapse whitespace
      .trim()
      .slice(0, 120), // hard max length

  /** Normalise + basic structural check for email. */
  email: (v) =>
    v
      .replace(/\s/g, "") // no spaces in emails
      .replace(/[<>"'`]/g, "")
      .toLowerCase()
      .slice(0, 254), // RFC 5321 max
};

const VALIDATE = {
  name: (v) => v.trim().length >= 2,
  industry: (v) => v.trim().length >= 2,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
};

const ERROR_MSG = {
  name: "Ingresa un nombre válido (mínimo 2 caracteres).",
  industry: "Ingresa el nombre de tu empresa.",
  email: "Ingresa un correo electrónico válido.",
};

// ─── FIELD COMPONENT ─────────────────────────────────────────────────────────

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  icon,
}) {
  const [focused, setFocused] = useState(false);

  const borderColor = error ? "#ef4444" : focused ? "#1e40af" : "#e2e8f0";
  const shadowColor = error
    ? "rgba(239,68,68,0.15)"
    : focused
      ? "rgba(30,64,175,0.12)"
      : "transparent";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        htmlFor={id}
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: error ? "#ef4444" : "#374151",
          transition: "color 0.15s",
        }}
      >
        {label}
      </label>

      <div style={{ position: "relative" }}>
        {/* Leading icon */}
        <div
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: error ? "#ef4444" : focused ? "#1e40af" : "#94a3b8",
            transition: "color 0.15s",
            pointerEvents: "none",
          }}
        >
          {icon}
        </div>

        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={type === "email" ? "email" : "off"}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: "13px 14px 13px 42px",
            borderRadius: 12,
            border: `2px solid ${borderColor}`,
            background: "#fff",
            fontSize: 15,
            fontWeight: 500,
            color: "#0f172a",
            outline: "none",
            boxSizing: "border-box",
            boxShadow: `0 0 0 4px ${shadowColor}`,
            transition: "border-color 0.15s, box-shadow 0.15s",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          }}
        />
      </div>

      {error && (
        <span
          style={{
            fontSize: 11,
            color: "#ef4444",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}

// ─── CONTACT SCREEN ──────────────────────────────────────────────────────────

function ContactScreen({ onSubmit }) {
  const [fields, setFields] = useState({ name: "", industry: "", email: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (raw) => {
    const sanitized =
      key === "email" ? SANITIZE.email(raw) : SANITIZE.text(raw);
    setFields((prev) => ({ ...prev, [key]: sanitized }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    Object.keys(VALIDATE).forEach((key) => {
      if (!VALIDATE[key](fields[key])) newErrors[key] = ERROR_MSG[key];
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    onSubmit({ ...fields });
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
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div
        style={{
          maxWidth: 480,
          width: "100%",
          animation: "slideUp 0.45s cubic-bezier(.4,0,.2,1) both",
        }}
      >
        {/* Step indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {[
            { label: "Cuestionario", done: true, active: false },
            { label: "Tus datos", done: false, active: true },
            { label: "Resultados", done: false, active: false },
          ].map((step, i) => (
            <div
              key={step.label}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <div
                style={{
                  padding: "5px 12px",
                  borderRadius: 99,
                  background: step.active
                    ? "rgba(99,102,241,0.25)"
                    : step.done
                      ? "rgba(34,197,94,0.18)"
                      : "rgba(255,255,255,0.06)",
                  border: `1px solid ${step.active ? "rgba(99,102,241,0.5)" : step.done ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.1)"}`,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: step.active
                      ? "#a5b4fc"
                      : step.done
                        ? "#86efac"
                        : "#475569",
                  }}
                >
                  {step.done ? "✓ " : ""}
                  {step.label}
                </span>
              </div>
              {i < 2 && (
                <div
                  style={{
                    width: 20,
                    height: 1,
                    background: "rgba(255,255,255,0.12)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: "40px 36px 36px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.45)",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                width: 52,
                height: 52,
                background: "linear-gradient(135deg, #1e3a5f, #4f46e5)",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
                boxShadow: "0 6px 20px rgba(79,70,229,0.3)",
              }}
            >
              <svg
                width="26"
                height="26"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#0f172a",
                margin: "0 0 8px",
                lineHeight: 1.25,
              }}
            >
              Casi listo — ¿a quién le enviamos el reporte?
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "#64748b",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Tu diagnóstico está completo. Estos datos nos permiten
              personalizar y entregar tu informe correctamente.
            </p>
          </div>

          {/* Inputs */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              marginBottom: 28,
            }}
          >
            <Field
              id="contact-name"
              label="Nombre completo *"
              value={fields.name}
              onChange={update("name")}
              error={errors.name}
              placeholder="Ej. Ana García"
              icon={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />
            <Field
              id="contact-industry"
              label="Empresa u organización *"
              value={fields.industry}
              onChange={update("industry")}
              error={errors.industry}
              placeholder="Ej. Grupo Innovación SA"
              icon={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              }
            />
            <Field
              id="contact-email"
              label="Correo electrónico *"
              type="email"
              value={fields.email}
              onChange={update("email")}
              error={errors.email}
              placeholder="ana@empresa.com"
              icon={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: "100%",
              padding: "15px",
              background: submitting
                ? "linear-gradient(135deg,#3730a3,#5b21b6)"
                : "linear-gradient(135deg,#1e3a5f,#1e40af)",
              border: "none",
              borderRadius: 14,
              color: "#fff",
              fontSize: 16,
              fontWeight: 800,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.85 : 1,
              boxShadow: "0 6px 24px rgba(30,64,175,0.4)",
              transition: "transform 0.15s, box-shadow 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
            onMouseEnter={(e) => {
              if (submitting) return;
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 10px 32px rgba(30,64,175,0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 6px 24px rgba(30,64,175,0.4)";
            }}
          >
            {submitting ? (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ animation: "spin 0.9s linear infinite" }}
                >
                  <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Generando informe...
              </>
            ) : (
              "Ver mi Diagnóstico →"
            )}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "#94a3b8",
              marginTop: 14,
              lineHeight: 1.5,
            }}
          >
            🔒 Tus datos se usan únicamente para personalizar y entregar tu
            reporte. No se comparten con terceros.
          </p>
        </div>
      </div>
    </div>
  );
}

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
          <div
            style={{
              width: 72,
              height: 72,
              background: "linear-gradient(135deg,#1e3a5f,#1e40af)",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 28px",
              boxShadow: "0 8px 24px rgba(30,64,175,0.35)",
            }}
          >
            <svg
              width="36"
              height="36"
              fill="none"
              stroke="white"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <h1
            style={{
              fontSize: "clamp(24px,5vw,32px)",
              fontWeight: 900,
              color: "#0f172a",
              marginBottom: 12,
              lineHeight: 1.2,
            }}
          >
            Diagnóstico Estratégico Organizacional
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: 16,
              marginBottom: 36,
              lineHeight: 1.6,
            }}
          >
            Evalúa el clima laboral, liderazgo y condiciones de tu equipo.
            Recibe un análisis detallado con gráficos, matriz de riesgo y plan
            de acción personalizado.
          </p>
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
              {
                icon: "📊",
                title: "15 preguntas rápidas",
                sub: "Evaluación completa en menos de 5 minutos",
              },
              {
                icon: "🎯",
                title: "Análisis por dimensiones",
                sub: "Velocímetro, semáforos y matriz de riesgo en vivo",
              },
              {
                icon: "📄",
                title: "Reporte PDF descargable",
                sub: "Plan de 90 días con métricas de seguimiento",
              },
            ].map((f) => (
              <div
                key={f.title}
                style={{ display: "flex", gap: 14, alignItems: "center" }}
              >
                <span style={{ fontSize: 24 }}>{f.icon}</span>
                <div>
                  <div
                    style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}
                  >
                    {f.title}
                  </div>
                  <div style={{ color: "#64748b", fontSize: 13 }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={onStart}
            style={{
              width: "100%",
              padding: "18px",
              background: "linear-gradient(135deg,#1e3a5f,#1e40af)",
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
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(30,64,175,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(30,64,175,0.45)";
            }}
          >
            Comenzar Diagnóstico Gratuito →
          </button>
          <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 16 }}>
            * No requiere registro previo para completar el cuestionario
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
        background: "linear-gradient(135deg,#0f172a,#1e293b)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        paddingTop: NAVBAR_OFFSET,
      }}
    >
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100%{ opacity:1 } 50%{ opacity:0.3 } }
      `}</style>

      {/* Double-ring spinner */}
      <div style={{ position: "relative", width: 80, height: 80 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "4px solid rgba(255,255,255,0.08)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "4px solid transparent",
            borderTopColor: "#6366f1",
            borderRadius: "50%",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 8,
            border: "3px solid transparent",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin 1.4s linear infinite reverse",
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

      {/* Animated steps */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginTop: 4,
        }}
      >
        {[
          { label: "Procesando respuestas", delay: "0s" },
          { label: "Calculando dimensiones", delay: "0.6s" },
          { label: "Generando plan de acción", delay: "1.2s" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              animation: `blink 1.8s ${item.delay} ease-in-out infinite`,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#6366f1",
              }}
            />
            <span style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STATE MACHINE ─────────────────────────────────────────────────────────────

export default function DiagnosticContainer() {
  const [state, setState] = useState("idle");
  const [totalScore, setTotalScore] = useState(0);
  const [dimScores, setDimScores] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [evaluationId, setEvaluationId] = useState(null);

  const handleStart = () => setState("answering");

  // 1. Cuando termina el quiz, SOLO guardamos las respuestas y pedimos los datos
  const handleQuizComplete = (score, dims, finalAnswers) => {
    setTotalScore(score);
    setDimScores(dims);
    setAnswers(finalAnswers);
    setState("collecting_info");
  };

  const handleContactSubmit = async (info) => {
    setContactInfo(info);
    setState("loading"); // Mostramos la pantalla de "Calculando..."

    try {
      const API_URL = import.meta.env.PUBLIC_API_URL;

      // PASO A: Guardar el Cliente
      const clientRes = await fetch(`${API_URL}/clients/public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: info.name,
          email: info.email,
          industry: info.industry,
        }),
      });

      const clientData = await clientRes.json();
      const clientId = clientData.clientId;

      // PASO B: Guardar la Evaluación vinculada a ese Cliente
      if (clientId) {
        const formattedAnswers = answers.map((valor, index) => ({
          questionId: index + 1,
          score: valor,
        }));

        const evalRes = await fetch(`${API_URL}/evaluations/public`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            surveyTemplateId: 1,
            totalScore: totalScore,
            clientId: clientId,
            answers: formattedAnswers,
          }),
        });

        const evalData = await evalRes.json();
        if (evalData.evaluationId) {
          setEvaluationId(evalData.evaluationId);
        }
      }
    } catch (e) {
      console.error("Error silencioso al guardar datos", e);
    }

    setTimeout(() => setState("result_ready"), 1500);
  };

  const handleReset = () => {
    setState("idle");
    setTotalScore(0);
    setDimScores([]);
    setContactInfo(null);
    setAnswers([]);
    setEvaluationId(null);
  };

  if (state === "idle") return <IdleScreen onStart={handleStart} />;
  if (state === "answering")
    return <QuizForm onComplete={handleQuizComplete} />;
  if (state === "collecting_info")
    return <ContactScreen onSubmit={handleContactSubmit} />;
  if (state === "loading") return <LoadingScreen />;

  if (state === "result_ready") {
    return (
      <ResultsDashboard
        totalScore={totalScore}
        dimScores={dimScores}
        contactInfo={contactInfo}
        onReset={handleReset}
        evaluationId={evaluationId}
      />
    );
  }
  return null;
}
