/**
 * AlertsPanel
 * Renders a list of dynamic diagnostic alerts derived from dimension scores.
 */
export default function AlertsPanel({ alerts }) {
  if (!alerts.length) {
    return (
      <div
        style={{
          padding: "12px 16px",
          background: "#f0fdf4",
          borderRadius: 10,
          border: "1px solid #86efac",
          color: "#15803d",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        ✅ Sin alertas críticas detectadas
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {alerts.map((alert, i) => {
        const isPositive = alert.icon === "✅";
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderRadius: 12,
              border: `1px solid ${isPositive ? "#86efac" : "#fcd34d"}`,
              background: isPositive ? "#f0fdf4" : "#fffbeb",
              color: isPositive ? "#15803d" : "#92400e",
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{alert.icon}</span>
            {alert.text}
          </div>
        );
      })}
    </div>
  );
}
