import { useState, useEffect } from "react";

/**
 * DimensionBar
 * Animated traffic-light progress bar for a single diagnostic dimension.
 * Props:
 *   dim   – dimension object with { icon, shortLabel, score, max, pct }
 *   delay – animation delay in ms (stagger effect)
 */
export default function DimensionBar({ dim, delay = 0 }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(dim.pct), 200 + delay);
    return () => clearTimeout(t);
  }, [dim.pct, delay]);

  // Color & label based on percentage
  const color =
    dim.pct >= 75
      ? "#22c55e"
      : dim.pct >= 50
      ? "#eab308"
      : dim.pct >= 30
      ? "#f97316"
      : "#ef4444";

  const statusLabel =
    dim.pct >= 75
      ? "Óptimo"
      : dim.pct >= 50
      ? "Moderado"
      : dim.pct >= 30
      ? "En Riesgo"
      : "Crítico";

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>{dim.icon}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
            {dim.shortLabel}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "'DM Mono', monospace",
              color,
            }}
          >
            {dim.score}/{dim.max}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 99,
              color,
              background: color + "20",
            }}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Bar track */}
      <div
        style={{
          position: "relative",
          height: 12,
          borderRadius: 99,
          background: "#f1f5f9",
          overflow: "visible",
        }}
      >
        {/* Gradient fill */}
        <div
          style={{
            position: "absolute",
            inset: "0",
            borderRadius: 99,
            width: `${width}%`,
            background:
              "linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e)",
            transition: "width 1s cubic-bezier(.4,0,.2,1)",
            overflow: "hidden",
          }}
        />
        {/* Dot indicator */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: `calc(${width}% - 8px)`,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: color,
            border: "2px solid #fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            transition: "left 1s cubic-bezier(.4,0,.2,1)",
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
}
