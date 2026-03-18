/**
 * PdfSuccessModal
 * ─────────────────────────────────────────────────────────────────────────────
 * Full-screen overlay shown after a successful PDF download.
 * Uses the same dark-blue gradient as the dashboard so it feels native,
 * not like a browser alert pasted on top.
 *
 * Props:
 *   onClose      – () => void   called when the user dismisses the modal
 *   contactInfo  – { name, email, industry }   (optional, for personalisation)
 *   evaluationId – number | string             (optional)
 */
export default function PdfSuccessModal({ onClose, contactInfo, evaluationId }) {
  return (
    /* ── Backdrop ──────────────────────────────────────────────────────────── */
    <div
      onClick={onClose}               /* click outside → close */
      style={{
        position       : "fixed",
        inset          : 0,
        zIndex         : 9999,
        display        : "flex",
        alignItems     : "center",
        justifyContent : "center",
        background     : "rgba(15, 23, 42, 0.80)",  /* #0f172a at 80% */
        backdropFilter : "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        fontFamily     : "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Modal card ────────────────────────────────────────────────────── */}
      <div
        onClick={e => e.stopPropagation()}  /* don't close when clicking inside */
        style={{
          background   : "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)",
          borderRadius : 24,
          padding      : "48px 40px",
          textAlign    : "center",
          maxWidth     : 480,
          width        : "90%",
          boxShadow    : "0 32px 80px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255,255,255,0.08)",
          animation    : "modalIn 0.35s cubic-bezier(.4,0,.2,1) both",
        }}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.90) translateY(16px); }
            to   { opacity: 1; transform: scale(1)    translateY(0);    }
          }
        `}</style>

        {/* ── Green check icon ──────────────────────────────────────────── */}
        <div
          style={{
            width          : 72,
            height         : 72,
            borderRadius   : "50%",
            background     : "linear-gradient(135deg, #16a34a, #22c55e)",
            display        : "flex",
            alignItems     : "center",
            justifyContent : "center",
            margin         : "0 auto 24px",
            boxShadow      : "0 8px 24px rgba(34,197,94,0.45)",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        {/* ── Heading ───────────────────────────────────────────────────── */}
        <h2 style={{ color: "#f8fafc", fontSize: 26, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.2 }}>
          ¡Reporte Descargado!
        </h2>

        {/* ── Subtext ───────────────────────────────────────────────────── */}
        <p style={{ color: "#bfdbfe", fontSize: 14, margin: "0 0 8px", lineHeight: 1.65 }}>
          Tu diagnóstico organizacional ha sido generado y descargado exitosamente.
        </p>

        {/* ── Filename hint ─────────────────────────────────────────────── */}
        {evaluationId && (
          <p style={{ color: "rgba(147,197,253,0.65)", fontSize: 12, margin: "0 0 32px", fontFamily: "'DM Mono', monospace" }}>
            diagnostico-organizacional-{evaluationId}.pdf
          </p>
        )}
        {!evaluationId && (
          <div style={{ marginBottom: 32 }} />
        )}

        {/* ── Dismiss button ────────────────────────────────────────────── */}
        <button
          onClick={onClose}
          style={{
            display        : "inline-flex",
            alignItems     : "center",
            gap            : 8,
            padding        : "13px 36px",
            background     : "rgba(255,255,255,0.12)",
            border         : "1px solid rgba(255,255,255,0.25)",
            borderRadius   : 12,
            color          : "#fff",
            fontWeight     : 700,
            fontSize       : 15,
            cursor         : "pointer",
            transition     : "background 0.2s",
            backdropFilter : "blur(4px)",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
        >
          Listo
        </button>
      </div>
    </div>
  );
}
