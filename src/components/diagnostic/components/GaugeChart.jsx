import { useState, useEffect } from "react";
import { getProfile } from "../utils/diagnosticData";

/**
 * GaugeChart
 * Semicircular SVG gauge with animated needle.
 * Score range: 15–75
 */
export default function GaugeChart({ score, min = 15, max = 75 }) {
  const [animated, setAnimated] = useState(0);
  const pct = Math.min(Math.max((score - min) / (max - min), 0), 1);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);

  const R = 80;
  const cx = 100;
  const cy = 100;

  const arcPath = (from, to, r) => {
    const x1 = cx + r * Math.cos(from);
    const y1 = cy - r * Math.sin(from);
    const x2 = cx + r * Math.cos(to);
    const y2 = cy - r * Math.sin(to);
    const large = Math.abs(from - to) > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const segments = [
    { from: Math.PI,        to: Math.PI * 0.75, color: "#ef4444" },
    { from: Math.PI * 0.75, to: Math.PI * 0.5,  color: "#f97316" },
    { from: Math.PI * 0.5,  to: Math.PI * 0.25, color: "#eab308" },
    { from: Math.PI * 0.25, to: 0,               color: "#22c55e" },
  ];

  const needleAngle = Math.PI - animated * Math.PI;
  const nx = cx + (R - 15) * Math.cos(needleAngle);
  const ny = cy - (R - 15) * Math.sin(needleAngle);
  const profile = getProfile(score);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg viewBox="0 0 200 115" width="240" height="138">
        {/* Track */}
        <path
          d={arcPath(Math.PI, 0, R)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* Color segments */}
        {segments.map((seg, i) => (
          <path
            key={i}
            d={arcPath(seg.from, seg.to, R)}
            fill="none"
            stroke={seg.color}
            strokeWidth="18"
            strokeLinecap="butt"
            opacity="0.85"
          />
        ))}
        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={nx}  y2={ny}
          stroke="#1e293b"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            transition:
              "x2 1s cubic-bezier(.4,0,.2,1), y2 1s cubic-bezier(.4,0,.2,1)",
          }}
        />
        <circle cx={cx} cy={cy} r="7" fill="#1e293b" />
        <circle cx={cx} cy={cy} r="3" fill="#f8fafc" />
        {/* Scale labels */}
        <text x="18"  y="108" fontSize="9" fill="#6b7280" fontFamily="monospace">15</text>
        <text x="92"  y="20"  fontSize="9" fill="#6b7280" fontFamily="monospace" textAnchor="middle">45</text>
        <text x="175" y="108" fontSize="9" fill="#6b7280" fontFamily="monospace">75</text>
      </svg>

      {/* Score display */}
      <div style={{ textAlign: "center", marginTop: -8 }}>
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            fontFamily: "'DM Mono', monospace",
            color: profile.color,
            lineHeight: 1,
          }}
        >
          {score}
          <span style={{ fontSize: 24, color: "#9ca3af", fontWeight: 600 }}>/75</span>
        </div>
        <div
          style={{
            marginTop: 8,
            display: "inline-block",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "4px 14px",
            borderRadius: 99,
            color: profile.color,
            background: profile.bg,
            border: `1px solid ${profile.border}`,
          }}
        >
          {profile.label}
        </div>
        <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginTop: 4 }}>
          Nivel General
        </div>
      </div>
    </div>
  );
}
