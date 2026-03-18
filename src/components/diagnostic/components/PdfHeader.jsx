/**
 * PdfHeader
 * ─────────────────────────────────────────────────────────────────────────────
 * A branded document header rendered only when the PDF is being generated.
 *
 * In normal web view this component is wrapped in a [data-pdf-show] div that
 * keeps it hidden (display: none). The usePdfDownload hook reveals it right
 * before calling html2canvas and hides it again afterward.
 *
 * Props:
 *   contactInfo  – { name: string, email: string, industry: string }
 *   evaluationId – number | string
 */
export default function PdfHeader({ contactInfo, evaluationId }) {
  const today = new Date().toLocaleDateString("es-MX", {
    day  : "numeric",
    month: "long",
    year : "numeric",
  });

  return (
    <div
      style={{
        background    : "#ffffff",
        borderBottom  : "3px solid #1e40af",
        padding       : "20px 32px 16px",
        display       : "flex",
        justifyContent: "space-between",
        alignItems    : "center",
        gap           : 16,
        fontFamily    : "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Left: Logo ─────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/*
          Replace the src below with your actual logo path.
          html2canvas requires useCORS: true if the image is served
          from a different origin (e.g. a CDN).
        */}
        <img
          src="/logo.png"
          alt="DOMIND"
          crossOrigin="anonymous"
          style={{ height: 44, width: "auto", objectFit: "contain" }}
          onError={(e) => {
            // Graceful fallback if logo doesn't load: show the brand name as text
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.insertAdjacentHTML(
              "afterbegin",
              `<span style="font-size:20px;font-weight:900;color:#1e40af;letter-spacing:-0.5px">DOMIND</span>`
            );
          }}
        />

        {/* Divider */}
        <div style={{ width: 1, height: 36, background: "#e2e8f0" }} />

        {/* Document type label */}
        <div>
          <div
            style={{
              fontSize     : 10,
              fontWeight   : 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color        : "#94a3b8",
            }}
          >
            Diagnóstico Estratégico Organizacional
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginTop: 2 }}>
            Informe de Resultados
          </div>
        </div>
      </div>

      {/* ── Right: User info ────────────────────────────────────────────────── */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
          {contactInfo?.name || "—"}
        </div>
        <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
          {contactInfo?.industry || contactInfo?.email || "—"}
        </div>
        <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
          &nbsp;·&nbsp; {today}
        </div>
      </div>
    </div>
  );
}
