import { getProfile } from "../utils/diagnosticData";

/**
 * RiskMatrix
 * 2×2 CSS Grid showing organizational risk quadrants.
 * The active quadrant is determined dynamically from the total score.
 */
export default function RiskMatrix({ score }) {
  const profile = getProfile(score);

  const cells = [
    { label: "Riesgo\nLatente",    bg: "#fee2c3", border: "#fed7aa", row: 0, col: 1 },
    { label: "Riesgo\nConductual", bg: "#fef9c3", border: "#fdec8a", row: 1, col: 0 },
    { label: "Riesgo\nCrítico",    bg: "#fee2e2", border: "#fca5a5", row: 1, col: 1 },
    { label: "Bajo\nRiesgo",       bg: "#dcfce7", border: "#bbf7d0", row: 0, col: 0 },
  ];

  return (
    <div>
      <div
        style={{
          fontSize: 10,
          color: "#9ca3af",
          textAlign: "center",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Impacto Organizacional ↔ Probabilidad
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
        }}
      >
        {cells.map((cell) => {
          const isActive =
            cell.row === profile.riskY && cell.col === profile.riskX;
          return (
            <div
              key={cell.label}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 68,
                borderRadius: 12,
                padding: "10px 8px",
                border: `2px solid ${isActive ? profile.color : cell.border}`,
                background: isActive ? profile.bg : cell.bg,
                boxShadow: isActive
                  ? `0 0 0 3px ${profile.color}30`
                  : "none",
                transition: "all 0.4s ease",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  textAlign: "center",
                  whiteSpace: "pre-line",
                  lineHeight: 1.35,
                  color: isActive ? profile.color : "#374151",
                }}
              >
                {cell.label}
              </span>

              {/* Pulsing dot on active quadrant */}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: profile.color,
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Active position label */}
      <div
        style={{
          marginTop: 10,
          textAlign: "center",
          fontSize: 12,
          fontWeight: 700,
          padding: "6px 12px",
          borderRadius: 8,
          color: profile.color,
          background: profile.bg,
        }}
      >
        Posición actual: {profile.label}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
