import GaugeChart from "./components/GaugeChart";
import DimensionBar from "./components/DimensionBar";
import RiskMatrix from "./components/RiskMatrix";
import AlertsPanel from "./components/AlertsPanel";
import {
  getProfile,
  getActionPlan,
  getDynamicAlerts,
  FONT_IMPORT,
  NAVBAR_OFFSET,
} from "./utils/diagnosticData";
import { useState } from "react";

// ─── Shared card style ────────────────────────────────────────────────────────
const CARD = {
  background: "rgba(255,255,255,0.97)",
  borderRadius: 20,
  boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
};

// ─── Section title style ──────────────────────────────────────────────────────
function SectionTitle({ children, style }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "#64748b",
        marginBottom: 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * ResultsDashboard
 * Full analytical results screen with gauge, dimension bars,
 * risk matrix, alerts, action plan, and PDF/CTA section.
 *
 * Props:
 *   totalScore – number (15–75)
 *   dimScores  – array produced by computeScores()
 *   onReset    – callback to restart the diagnostic
 */
// 1. Recibimos la prop "answers" aquí arriba
export default function ResultsDashboard({
  totalScore,
  dimScores,
  onReset,
  evaluationId,
}) {
  const profile = getProfile(totalScore);
  const alerts = getDynamicAlerts(dimScores);
  const actionPlan = getActionPlan(totalScore);
  const pct = Math.round(((totalScore - 15) / 60) * 100);

  // PDF HANDLER
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloadingPdf(true);

    try {
      const API_URL = import.meta.env.PUBLIC_API_URL;

      const res = await fetch(
        // Desarrollo
        // `http://localhost:3000/reports/evaluation/${evaluationId}/pdf`,

        // Producción
        `${API_URL}/reports/evaluation/${evaluationId}/pdf`,
      );

      if (!res.ok) throw new Error("Error al generar el PDF");

      // 4. Recibimos el archivo binario y forzamos la descarga en el navegador
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Diagnostico-Organizacional-${evaluationId}.pdf`;
      a.click();

      // Limpieza de la URL temporal
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Hubo un problema descargando el PDF:", error);
      alert("Hubo un problema al generar el reporte. Intenta de nuevo.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        paddingTop: NAVBAR_OFFSET,
        paddingBottom: 48,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <style>{`
        ${FONT_IMPORT}
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .r-card { background: rgba(255,255,255,0.97); border-radius: 20px; box-shadow: 0 4px 32px rgba(0,0,0,0.18); }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* ── HEADER ─────────────────────────────────────────────────────────── */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)",
            borderRadius: 20,
            padding: "28px 32px",
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            boxShadow: "0 8px 32px rgba(30,64,175,0.4)",
            animation: "fadeUp 0.5s ease both",
          }}
        >
          <div>
            <div
              style={{
                color: "#93c5fd",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Diagnóstico Estratégico
            </div>
            <h1
              style={{
                color: "#fff",
                fontSize: "clamp(22px, 4vw, 32px)",
                fontWeight: 900,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Informe de Diagnóstico
              <br />
              Organizacional
            </h1>
            <p style={{ color: "#bfdbfe", fontSize: 13, margin: "8px 0 0" }}>
              Resultados de tu evaluación ·{" "}
              {new Date().toLocaleDateString("es-MX", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <button
            onClick={onReset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 12,
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              backdropFilter: "blur(8px)",
            }}
          >
            ↺ Nuevo Diagnóstico
          </button>
        </div>

        {/* ── ROW 1: GAUGE · RISK + ALERTS · STATS ───────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 16,
            animation: "fadeUp 0.5s ease 0.1s both",
          }}
        >
          {/* — Gauge — */}
          <div className="r-card" style={{ padding: "28px 20px" }}>
            <SectionTitle>Nivel General</SectionTitle>
            <GaugeChart score={totalScore} />
            <div
              style={{
                marginTop: 16,
                padding: "12px 16px",
                borderRadius: 12,
                background: profile.bg,
                border: `1px solid ${profile.border}`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: "#374151",
                }}
              >
                {profile.description}
              </p>
            </div>
          </div>

          {/* — Risk matrix + alerts — */}
          <div className="r-card" style={{ padding: "24px 20px" }}>
            <SectionTitle>Matriz de Riesgo</SectionTitle>
            <RiskMatrix score={totalScore} />

            <SectionTitle style={{ marginTop: 20 }}>
              Alertas del Diagnóstico
            </SectionTitle>
            <AlertsPanel alerts={alerts} />
          </div>

          {/* — Stats + mini action plan — */}
          <div className="r-card" style={{ padding: "24px 20px" }}>
            <SectionTitle>Resumen Estadístico</SectionTitle>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 20,
              }}
            >
              {[
                { label: "Puntaje Total", value: `${totalScore}/75` },
                { label: "índice", value: `${pct}%` },
                {
                  label: "Dimensiones OK",
                  value: `${dimScores.filter((d) => d.pct >= 50).length}/4`,
                },
                { label: "Tiempo est.", value: "3-6 meses" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "#f8fafc",
                    borderRadius: 12,
                    padding: "14px 12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: "#0f172a",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#64748b",
                      fontWeight: 600,
                      marginTop: 2,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* ─────────────────────────────────────────────── */}
            <SectionTitle>Acciones Recomendadas</SectionTitle>
            {actionPlan.slice(0, 3).map((action, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  marginBottom: 8,
                  fontSize: 12,
                  color: "#374151",
                  lineHeight: 1.5,
                }}
              >
                <div
                  style={{
                    minWidth: 22,
                    height: 22,
                    background: "#1e40af",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                {action}
              </div>
            ))}
            <p
              style={{
                fontSize: 11,
                color: "#94a3b8",
                marginTop: 6,
                fontStyle: "italic",
              }}
            >
              +{actionPlan.length - 3} más en el PDF completo...
            </p>
            {/* ─────────────────────────────────────────────── */}
          </div>
        </div>

        {/* ── ROW 2: DIMENSION BARS ───────────────────────────────────────────── */}
        <div
          className="r-card"
          style={{
            padding: "28px 32px",
            marginBottom: 16,
            animation: "fadeUp 0.5s ease 0.2s both",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <SectionTitle style={{ margin: 0 }}>
              Análisis por Dimensión
            </SectionTitle>

            {/* Legend */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Crítico", color: "#ef4444" },
                { label: "En Riesgo", color: "#f97316" },
                { label: "Moderado", color: "#eab308" },
                { label: "Óptimo", color: "#22c55e" },
              ].map((l) => (
                <div
                  key={l.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    color: "#64748b",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: l.color,
                    }}
                  />
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "4px 32px",
            }}
          >
            {dimScores.map((dim, i) => (
              <DimensionBar key={dim.id} dim={dim} delay={i * 150} />
            ))}
          </div>
        </div>

        {/* ── ROW 3: FULL ACTION PLAN ──────────────────────────────────────────── */}
        <div
          className="r-card"
          style={{
            padding: "28px 32px",
            marginBottom: 16,
            animation: "fadeUp 0.5s ease 0.3s both",
          }}
        >
          <SectionTitle>Plan de Acción de 7 Días Recomendado</SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {actionPlan.map((action, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: "14px 16px",
                  background: "#f8fafc",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  cursor: "default",
                  transition: "background 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#eff6ff";
                  e.currentTarget.style.borderColor = "#93c5fd";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                <div
                  style={{
                    minWidth: 30,
                    height: 30,
                    background: "linear-gradient(135deg, #1e3a5f, #1e40af)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#374151",
                    lineHeight: 1.55,
                  }}
                >
                  {action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA / PDF SECTION ────────────────────────────────────────────────── */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: 20,
            padding: "40px 32px",
            textAlign: "center",
            border: "1px solid rgba(99,102,241,0.3)",
            boxShadow: "0 0 60px rgba(99,102,241,0.1)",
            animation: "fadeUp 0.5s ease 0.4s both",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-block",
              padding: "6px 18px",
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.4)",
              borderRadius: 99,
              color: "#a5b4fc",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            📄 Tu reporte detallado está listo
          </div>

          <h3
            style={{
              color: "#f8fafc",
              fontSize: "clamp(20px, 4vw, 28px)",
              fontWeight: 900,
              margin: "0 0 12px",
            }}
          >
            Descarga el Análisis Completo
          </h3>
          <p
            style={{
              color: "#94a3b8",
              fontSize: 15,
              margin: "0 auto 32px",
              maxWidth: 520,
              lineHeight: 1.6,
            }}
          >
            El PDF incluye el desglose completo por dimensión, benchmarks del
            sector y un plan de intervención de 90 días con métricas de
            seguimiento.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Primary — Download PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloadingPdf}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 32px",
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                border: "none",
                borderRadius: 14,
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.boxShadow =
                  "0 12px 40px rgba(99,102,241,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(99,102,241,0.4)";
              }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Descargar PDF Completo
            </button>

            {/* Secondary — Schedule workshop */}
            <a
              href="mailto:info@domind.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 28px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 14,
                color: "#e2e8f0",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
              }
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Agendar Workshop
            </a>

            {/* Tertiary */}
            <a
              href="/#workshops"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 24px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14,
                color: "#64748b",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
            >
              Ver Programas →
            </a>
          </div>

          <p style={{ color: "#475569", fontSize: 12, marginTop: 24 }}>
            Nuestros consultores pueden ayudarte a implementar estas
            recomendaciones con resultados medibles en 3–6 meses.
          </p>
        </div>
      </div>
    </div>
  );
}
