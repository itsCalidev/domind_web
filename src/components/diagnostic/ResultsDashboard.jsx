import { Fragment }        from "react";
import GaugeChart          from "./components/GaugeChart";
import DimensionBar        from "./components/DimensionBar";
import RiskMatrix          from "./components/RiskMatrix";
import AlertsPanel         from "./components/AlertsPanel";
import PdfHeader           from "./components/PdfHeader";
import PdfSuccessModal     from "./components/Pdfsuccessmodal";
import { usePdfDownload }  from "./hooks/usePdfDownload";
import {
  getProfile,
  getActionPlan,
  getDynamicAlerts,
  FONT_IMPORT,
  NAVBAR_OFFSET,
} from "./utils/diagnosticData";

// ─── Section title ─────────────────────────────────────────────────────────────
function SectionTitle({ children, style }) {
  return (
    <div
      style={{
        fontSize     : 11,
        fontWeight   : 700,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color        : "#64748b",
        marginBottom : 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── StatTile ─────────────────────────────────────────────────────────────────
function StatTile({
  icon, iconBg, title,
  value, valueSuffix, valueColor,
  description, descriptionHighlight,
}) {
  return (
    <div
      style={{
        background    : "#f8fafc",
        borderRadius  : 12,
        padding       : "14px 12px",
        border        : "1px solid #f1f5f9",
        display       : "flex",
        flexDirection : "column",
        gap           : 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div
          style={{
            width          : 28, height: 28,
            borderRadius   : 8,
            background     : iconBg,
            display        : "flex",
            alignItems     : "center",
            justifyContent : "center",
            flexShrink     : 0,
          }}
        >
          {icon}
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", lineHeight: 1.3 }}>
          {title}
        </span>
      </div>

      <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'DM Mono', monospace", color: valueColor, lineHeight: 1 }}>
        {value}
        <span style={{ fontSize: 14, fontWeight: 700, color: "#9ca3af" }}>{valueSuffix}</span>
      </div>

      <p style={{ margin: 0, fontSize: 12, color: "#6b7280", lineHeight: 1.5, textAlign: "justify" }}>
        {descriptionHighlight
          ? description
              .replace(descriptionHighlight, "__H__")
              .split("__H__")
              .map((part, i) =>
                i === 0 ? part : (
                  <Fragment key={i}>
                    <strong style={{ color: valueColor }}>{descriptionHighlight}</strong>
                    {part}
                  </Fragment>
                )
              )
          : description}
      </p>
    </div>
  );
}

// ─── ResultsDashboard ─────────────────────────────────────────────────────────
/**
 * Props:
 *   totalScore   – number (15–75)
 *   dimScores    – array from computeScores()
 *   contactInfo  – { name, email, industry }
 *   evaluationId – number | string
 *   onReset      – () => void
 */
export default function ResultsDashboard({
  totalScore,
  dimScores,
  contactInfo,
  evaluationId,
  onReset,
}) {
  const profile    = getProfile(totalScore);
  const alerts     = getDynamicAlerts(dimScores);
  const actionPlan = getActionPlan(totalScore);
  const pct        = Math.round(((totalScore - 15) / 60) * 100);

  // ── PDF hook ───────────────────────────────────────────────────────────────
  //
  // onclone strategy: the hook NEVER touches the live DOM.
  // All patches (kill animations, hide buttons, show PdfHeader) are applied
  // to the cloned document that html2canvas creates internally.
  // → Zero flicker, zero white flash for the user.
  const {
    dashboardRef,
    isGeneratingPdf,
    handleDownloadPDF,
    isPdfSuccess,
    handleClosePdfSuccess,
  } = usePdfDownload({ contactInfo, evaluationId });

  return (
    <>
      {/* ── Success modal (rendered outside the dashboard ref so it won't  ──
          appear in the PDF capture)                                         */}
      {isPdfSuccess && (
        <PdfSuccessModal
          onClose={handleClosePdfSuccess}
          contactInfo={contactInfo}
          evaluationId={evaluationId}
        />
      )}

      <div
        ref={dashboardRef}
        style={{
          minHeight   : "100vh",
          background  : "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          fontFamily  : "'DM Sans', 'Segoe UI', sans-serif",
          paddingTop  : NAVBAR_OFFSET,
          paddingBottom: 48,
          paddingLeft : 16,
          paddingRight: 16,
        }}
      >
        <style>{`
          ${FONT_IMPORT}
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          .r-card {
            background  : rgba(255,255,255,0.97);
            border-radius: 20px;
            box-shadow  : 0 4px 32px rgba(0,0,0,0.18);
          }
        `}</style>

        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/*
            ── BRANDED PDF HEADER ─────────────────────────────────────────────
            Hidden in the browser via display:none.
            The onclone callback in usePdfDownload flips [data-pdf-show]
            elements to display:block on the CLONED document only.
            The live page is never modified → no flicker.
          */}
          <div data-pdf-show style={{ display: "none" }}>
            <PdfHeader contactInfo={contactInfo} evaluationId={evaluationId} />
          </div>

          {/* ── DASHBOARD HEADER ───────────────────────────────────────────── */}
          <div
            style={{
              background   : "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)",
              borderRadius : 20,
              padding      : "28px 32px",
              marginBottom : 20,
              display      : "flex",
              justifyContent: "space-between",
              alignItems   : "center",
              flexWrap     : "wrap",
              gap          : 16,
              boxShadow    : "0 8px 32px rgba(30,64,175,0.4)",
              animation    : "fadeUp 0.5s ease both",
            }}
          >
            <div>
              <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
                Diagnóstico Estratégico
              </div>
              <h1 style={{ color: "#fff", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
                Informe de Diagnóstico<br />Organizacional
              </h1>
              <p style={{ color: "#bfdbfe", fontSize: 13, margin: "8px 0 0" }}>
                Resultados de tu evaluación ·{" "}
                {new Date().toLocaleDateString("es-MX", { month: "long", year: "numeric" })}
              </p>
            </div>

            {/* hidden in PDF — no need to show "Nuevo Diagnóstico" in the report */}
            <button
              data-pdf-hide
              onClick={onReset}
              style={{
                display        : "flex",
                alignItems     : "center",
                gap            : 8,
                padding        : "10px 20px",
                background     : "rgba(255,255,255,0.12)",
                border         : "1px solid rgba(255,255,255,0.25)",
                borderRadius   : 12,
                color          : "#fff",
                fontWeight     : 600,
                fontSize       : 13,
                cursor         : "pointer",
                backdropFilter : "blur(8px)",
              }}
            >
              ↺ Nuevo Diagnóstico
            </button>
          </div>

          {/* ── ROW 1: GAUGE · RISK MATRIX · STATS ────────────────────────── */}
          <div
            style={{
              display              : "grid",
              gridTemplateColumns  : "repeat(3, 1fr)",
              gap                  : 16,
              marginBottom         : 16,
              animation            : "fadeUp 0.5s ease 0.1s both",
            }}
          >
            {/* — Gauge — */}
            <div className="r-card" style={{ padding: "28px 20px" }}>
              <SectionTitle>Índice de Clima</SectionTitle>
              <GaugeChart score={totalScore} />
              <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 12, background: profile.bg, border: `1px solid ${profile.border}` }}>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: "#374151" }}>
                  {profile.description}
                </p>
              </div>
            </div>

            {/* — Risk matrix + alerts — */}
            <div className="r-card" style={{ padding: "24px 20px" }}>
              <SectionTitle>Matriz de Riesgo</SectionTitle>
              <RiskMatrix score={totalScore} />
              <SectionTitle style={{ marginTop: 20 }}>Alertas del Diagnóstico</SectionTitle>
              <AlertsPanel alerts={alerts} />
            </div>

            {/* — Stats (4 tiles) — */}
            <div className="r-card" style={{ padding: "22px 18px" }}>
              <div style={{ marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b" }}>Resumen Estadístico </span>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94a3b8" }}>del Diagnóstico</span>
                <div style={{ marginTop: 6, height: 1, background: "#f1f5f9" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <StatTile
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                  iconBg="#eff6ff" title="Puntaje Total"
                  value={`${totalScore}`} valueSuffix=" / 75" valueColor="#3b82f6"
                  description="Resultado general del diagnóstico de clima organizacional"
                />
                <StatTile
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                  iconBg="#ecfdf5" title="Índice de Clima"
                  value={`${pct}`} valueSuffix=" %" valueColor="#10b981"
                  description="Porcentaje de condiciones favorables de clima laboral"
                />
                <StatTile
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                  iconBg="#fff7ed" title="Dimensiones Críticas"
                  value={`${dimScores.filter(d => d.pct < 50).length}`} valueSuffix=" / 4" valueColor="#f97316"
                  description="Dimensiones del clima con condiciones de riesgo o deterioro"
                />
                <StatTile
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                  iconBg="#eef2ff" title="Prioridad de intervención"
                  value={profile.interventionPriority} valueSuffix=""
                  valueColor={
                    profile.interventionPriority === "ALTA"  ? "#ef4444" :
                    profile.interventionPriority === "MEDIA" ? "#f97316" : "#22c55e"
                  }
                  description={`Intervención recomendada antes de ${profile.interventionWeeks} semanas`}
                  descriptionHighlight={`antes de ${profile.interventionWeeks} semanas`}
                />
              </div>
            </div>
          </div>

          {/* ── ROW 2: DIMENSION BARS ──────────────────────────────────────── */}
          <div className="r-card" style={{ padding: "28px 32px", marginBottom: 16, animation: "fadeUp 0.5s ease 0.2s both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <SectionTitle style={{ margin: 0 }}>Análisis por Dimensión</SectionTitle>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  { label: "Crítico",   color: "#ef4444" },
                  { label: "En Riesgo", color: "#f97316" },
                  { label: "Moderado",  color: "#eab308" },
                  { label: "Óptimo",    color: "#22c55e" },
                ].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, color: "#64748b", fontSize: 11, fontWeight: 600 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "4px 32px" }}>
              {dimScores.map((dim, i) => (
                <DimensionBar key={dim.id} dim={dim} delay={i * 150} />
              ))}
            </div>
          </div>

          {/* ── ROW 3: ACTION PLAN ─────────────────────────────────────────── */}
          <div className="r-card" style={{ padding: "28px 32px", marginBottom: 16, animation: "fadeUp 0.5s ease 0.3s both" }}>
            <SectionTitle>Plan de Acción Recomendado</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              {actionPlan.map((action, i) => (
                <div
                  key={i}
                  style={{
                    display   : "flex", gap: 12, alignItems: "flex-start",
                    padding   : "14px 16px",
                    background: "#f8fafc", borderRadius: 12,
                    border    : "1px solid #e2e8f0", cursor: "default",
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#93c5fd"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc";  e.currentTarget.style.borderColor = "#e2e8f0"; }}
                >
                  <div style={{ minWidth: 30, height: 30, background: "linear-gradient(135deg, #1e3a5f, #1e40af)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.55 }}>{action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA / PDF SECTION ──────────────────────────────────────────── */}
          <div
           data-html2canvas-ignore="true"
            style={{
              background   : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              borderRadius : 20, padding: "40px 32px", textAlign: "center",
              border       : "1px solid rgba(99,102,241,0.3)",
              boxShadow    : "0 0 60px rgba(99,102,241,0.1)",
              animation    : "fadeUp 0.5s ease 0.4s both",
            }}
          >
            <div style={{ display: "inline-block", padding: "6px 18px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 99, color: "#a5b4fc", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
              📄 Tu reporte detallado está listo
            </div>
            <h3 style={{ color: "#f8fafc", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 900, margin: "0 0 12px" }}>
              Descarga el Análisis Completo
            </h3>
            <p style={{ color: "#94a3b8", fontSize: 15, margin: "0 auto 32px", maxWidth: 520, lineHeight: 1.6 }}>
              El PDF incluye el desglose completo por dimensión, benchmarks del sector y un plan de intervención de 90 días con métricas de seguimiento.
            </p>

            {/* data-pdf-hide → the entire button row is excluded from the PDF */}
            <div data-pdf-hide style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>

              {/* Primary — Download PDF */}
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                style={{
                  display    : "inline-flex", alignItems: "center", gap: 10,
                  padding    : "16px 32px",
                  background : isGeneratingPdf
                    ? "linear-gradient(135deg, #3730a3, #5b21b6)"
                    : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  border     : "none", borderRadius: 14, color: "#fff",
                  fontSize   : 16, fontWeight: 700,
                  cursor     : isGeneratingPdf ? "not-allowed" : "pointer",
                  opacity    : isGeneratingPdf ? 0.8 : 1,
                  boxShadow  : "0 8px 32px rgba(99,102,241,0.4)",
                  transition : "transform 0.2s, box-shadow 0.2s, opacity 0.2s",
                }}
                onMouseEnter={e => {
                  if (isGeneratingPdf) return;
                  e.currentTarget.style.transform = "scale(1.04)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(99,102,241,0.6)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.4)";
                }}
              >
                {isGeneratingPdf ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 0.9s linear infinite" }}>
                      <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Generando Reporte...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descargar PDF Completo
                  </>
                )}
              </button>

              {/* Secondary — Workshop */}
              <a
                href="mailto:contacto@domind.com"
                style={{
                  display       : "inline-flex", alignItems: "center", gap: 10,
                  padding       : "16px 28px",
                  background    : "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius  : 14, color: "#e2e8f0", fontSize: 15, fontWeight: 600,
                  cursor        : "pointer", textDecoration: "none", transition: "background 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Agendar Workshop
              </a>

              {/* Tertiary */}
              <a
                href="/#workshops"
                style={{
                  display       : "inline-flex", alignItems: "center", gap: 8,
                  padding       : "16px 24px",
                  background    : "transparent", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius  : 14, color: "#64748b", fontSize: 14, fontWeight: 600,
                  textDecoration: "none", transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
                onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
              >
                Ver Programas →
              </a>
            </div>

            <p style={{ color: "#475569", fontSize: 12, marginTop: 24 }}>
              Nuestros consultores pueden ayudarte a implementar estas recomendaciones con resultados medibles en 3–6 meses.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
