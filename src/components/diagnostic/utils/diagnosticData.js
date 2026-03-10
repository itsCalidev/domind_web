// ─── QUESTIONS ────────────────────────────────────────────────────────────────

export const QUESTIONS = [
  "La comunicación del equipo es clara, fluida y sin información oculta.",
  "Compartimos feedback respetuoso y constructivo para mejorar nuestro trabajo.",
  "Celebramos los éxitos del equipo y aprendemos de los errores sin culpar a nadie.",
  "Puedo expresar desacuerdos o errores sin temor a represalias del equipo.",
  "El equipo apoya nuevas ideas y no penaliza las iniciativas que no resultan.",
  "Nos ayudamos mutuamente cuando alguien enfrenta sobrecarga o un problema.",
  "Todos asumimos juntos la responsabilidad por alcanzar las metas del equipo.",
  "Los conflictos se resuelven de forma respetuosa buscando soluciones conjuntas.",
  "Los objetivos y roles del equipo están bien definidos y son conocidos por todos.",
  "Mi líder escucha nuestras ideas y nos involucra en las decisiones importantes.",
  "Contamos con las herramientas, tecnología y recursos necesarios para hacer bien el trabajo.",
  "Las condiciones físicas del espacio (iluminación, limpieza, clima, seguridad) son buenas.",
  "Tenemos acceso a la información y datos relevantes que necesitamos para nuestro trabajo.",
  "Existen oportunidades reales de desarrollo profesional y aprendizaje dentro de la organización.",
  "Cumplimos acuerdos y normas del equipo aun cuando el líder no supervisa directamente.",
];

// ─── SCALE ───────────────────────────────────────────────────────────────────

export const SCALE_OPTIONS = [
  { value: 1, label: "Nunca" },
  { value: 2, label: "Rara vez" },
  { value: 3, label: "A veces" },
  { value: 4, label: "Frecuentemente" },
  { value: 5, label: "Siempre" },
];

// ─── DIMENSIONS ──────────────────────────────────────────────────────────────

export const DIMENSIONS = [
  {
    id: "comunicacion",
    label: "Comunicación y Confianza Psicológica",
    shortLabel: "Comunicación",
    questions: [0, 1, 2, 3, 4],
    max: 25,
    icon: "💬",
  },
  {
    id: "colaboracion",
    label: "Colaboración y Apoyo Mutuo",
    shortLabel: "Colaboración",
    questions: [5, 6, 7],
    max: 15,
    icon: "🤝",
  },
  {
    id: "liderazgo",
    label: "Liderazgo y Objetivos",
    shortLabel: "Liderazgo",
    questions: [8, 9, 14],
    max: 15,
    icon: "🎯",
  },
  {
    id: "recursos",
    label: "Recursos y Condiciones",
    shortLabel: "Recursos",
    questions: [10, 11, 12, 13],
    max: 20,
    icon: "🏗️",
  },
];

// ─── SCORE COMPUTATION ───────────────────────────────────────────────────────

export function computeScores(answers) {
  const totalScore = Object.values(answers).reduce((s, v) => s + v, 0);
  const dimScores = DIMENSIONS.map((dim) => {
    const score = dim.questions.reduce((s, qi) => s + (answers[qi] || 0), 0);
    const pct = (score / dim.max) * 100;
    return { ...dim, score, pct };
  });
  return { totalScore, dimScores };
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────
// Score range: 15–75  |  4 climate levels as defined by the psychologist

export function getProfile(score) {
  // 15–30 · Clima Crítico
  if (score <= 30)
    return {
      label: "Clima Crítico",
      color: "#ef4444",
      bg: "#fef2f2",
      border: "#fca5a5",
      riskX: 1,
      riskY: 1,
      interventionPriority: "ALTA",
      interventionWeeks: 6,
      description:
        "Ambiente laboral deteriorado, presencia de conflictos, baja satisfacción y riesgos importantes para el desempeño y la estabilidad del equipo.",
    };
  // 30–45 · Clima Deteriorado
  if (score <= 45)
    return {
      label: "Clima Deteriorado",
      color: "#f97316",
      bg: "#fff7ed",
      border: "#fdba74",
      riskX: 1,
      riskY: 0,
      interventionPriority: "ALTA",
      interventionWeeks: 6,
      description:
        "Problemas relevantes en liderazgo, comunicación o coordinación que afectan la motivación y el funcionamiento del equipo.",
    };
  // 45–60 · Clima Inestable
  if (score <= 60)
    return {
      label: "Clima Inestable",
      color: "#eab308",
      bg: "#fefce8",
      border: "#fde68a",
      riskX: 0,
      riskY: 1,
      interventionPriority: "MEDIA",
      interventionWeeks: 12,
      description:
        "Condiciones mixtas. Algunas áreas funcionan adecuadamente, pero existen tensiones o factores que pueden afectar el desempeño si no se atienden.",
    };
  // 60–75 · Clima Favorable
  return {
    label: "Clima Favorable",
    color: "#22c55e",
    bg: "#f0fdf4",
    border: "#86efac",
    riskX: 0,
    riskY: 0,
    interventionPriority: "BAJA",
    interventionWeeks: 24,
    description:
      "Ambiente laboral positivo, con liderazgo funcional, buena colaboración y condiciones favorables para el desempeño.",
  };
}

// ─── ACTION PLAN ─────────────────────────────────────────────────────────────

export function getActionPlan(score) {
  // Clima Crítico (15–30)
  if (score <= 30)
    return [
      "Definir reglas claras de comunicación y colaboración",
      "Realizar reuniones 1:1 para reconocer aportes individuales",
      "Revisar y actualizar herramientas de trabajo urgentemente",
      "Clarificar objetivos y responsabilidades del equipo",
      "Implementar sistema de feedback anónimo inmediato",
    ];
  // Clima Deteriorado (30–45)
  if (score <= 45)
    return [
      "Facilitar taller de resolución de conflictos",
      "Establecer sesiones de feedback grupal estructurado",
      "Optimizar recursos y herramientas disponibles",
      "Definir roles y responsabilidades con mayor claridad",
      "Crear ruta de desarrollo profesional visible",
    ];
  // Clima Inestable (45–60)
  if (score <= 60)
    return [
      "Organizar sesiones de brainstorming para innovación",
      "Implementar programa de mentoría cruzada",
      "Planificar objetivos trimestrales co-creados con el equipo",
      "Revisar necesidades de capacitación avanzada",
      "Reforzar alineación con estrategia organizacional",
    ];
  // Clima Favorable (60–75)
  return [
    "Implementar ciclos de mejora continua",
    "Rotar liderazgo en proyectos específicos",
    "Co-crear plan de crecimiento ambicioso del equipo",
    "Institucionalizar feedback 360° trimestral",
    "Documentar y compartir mejores prácticas externamente",
  ];
}

// ─── DYNAMIC ALERTS ──────────────────────────────────────────────────────────

export function getDynamicAlerts(dimScores) {
  const alerts = [];
  dimScores.forEach((dim) => {
    if (dim.id === "comunicacion" && dim.pct < 50)
      alerts.push({ icon: "⚠️", text: "Brecha Crítica en Comunicación Interna" });
    if (dim.id === "colaboracion" && dim.pct < 50)
      alerts.push({ icon: "⚠️", text: "Riesgo de Fractura en Colaboración" });
    if (dim.id === "liderazgo" && dim.pct < 50)
      alerts.push({ icon: "⚠️", text: "Brecha en Liderazgo Operativo" });
    if (dim.id === "recursos" && dim.pct < 50)
      alerts.push({ icon: "⚠️", text: "Condiciones Físicas y Recursos Deficientes" });
    if (dim.id === "comunicacion" && dim.pct < 35)
      alerts.push({ icon: "🔴", text: "Riesgo de Rotación Elevado" });
    if (dim.id === "liderazgo" && dim.pct > 80)
      alerts.push({ icon: "✅", text: "Fortaleza: Liderazgo consolidado" });
  });
  return alerts.slice(0, 3);
}

// ─── SHARED FONT IMPORT ───────────────────────────────────────────────────────

export const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=DM+Mono:wght@400;600&display=swap');`;

// ─── NAVBAR OFFSET ───────────────────────────────────────────────────────────
// The navbar floats at top-4 (16px) and its content is ~60px tall → 76px total.
// We use 88px to give a comfortable 12px extra breathing room.
export const NAVBAR_OFFSET = "32px";
