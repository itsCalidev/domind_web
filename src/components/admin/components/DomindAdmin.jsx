import { useState, useEffect, createContext, useContext } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  blue900 : "#1E3A8A",
  blue800 : "#1e40af",
  blue700 : "#1d4ed8",
  blue100 : "#dbeafe",
  blue50  : "#eff6ff",
  slate900: "#0f172a",
  slate800: "#1e293b",
  slate700: "#334155",
  slate600: "#475569",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate300: "#cbd5e1",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  slate50  : "#f8fafc",
  white    : "#ffffff",
  red500   : "#ef4444",
  red50    : "#fef2f2",
  green500 : "#22c55e",
  green50  : "#f0fdf4",
  amber500 : "#f59e0b",
};

const FONT = `'IBM Plex Sans', 'Segoe UI', sans-serif`;
const MONO = `'IBM Plex Mono', 'Fira Code', monospace`;

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.slate100}; font-family: ${FONT}; color: ${C.slate800}; }
  input, button, select, textarea { font-family: inherit; }
  ::placeholder { color: ${C.slate400}; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: ${C.slate100}; }
  ::-webkit-scrollbar-thumb { background: ${C.slate300}; border-radius: 99px; }

  /* Animations */
  @keyframes fadeIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
  @keyframes spin    { to { transform: rotate(360deg); } }

  .fade-in  { animation: fadeIn  0.35s cubic-bezier(.4,0,.2,1) both; }
  .slide-in { animation: slideIn 0.3s  cubic-bezier(.4,0,.2,1) both; }

  /* Table row hover */
  .data-row:hover { background: ${C.blue50} !important; }
  .data-row:hover td { color: ${C.slate900} !important; }

  /* Focus ring */
  .field-input:focus { outline: none; border-color: ${C.blue700} !important; box-shadow: 0 0 0 3px rgba(29,78,216,0.12) !important; }

  /* Sidebar nav items */
  .nav-item { transition: all 0.15s ease; }
  .nav-item:hover { background: rgba(255,255,255,0.08) !important; }

  /* Responsive */
  @media (max-width: 768px) {
    .sidebar { display: none !important; }
    .main-content { margin-left: 0 !important; }
    .top-bar { padding: 0 16px !important; }
    .table-wrap { font-size: 12px !important; }
    .table-wrap th, .table-wrap td { padding: 10px 12px !important; }
    .action-bar { flex-direction: column !important; align-items: stretch !important; }
    .action-bar > * { justify-content: center !important; }
    .settings-card { padding: 28px 20px !important; }
  }
`;

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK_EVALUATIONS = [
  { id: 1,  date: "2026-03-18", name: "Ana García",       company: "Grupo Innovación SA",  email: "ana@innovacion.mx",     score: 72, level: "Clima Favorable"  },
  { id: 2,  date: "2026-03-17", name: "Carlos Mendoza",   company: "TechVentures MX",      email: "c.mendoza@techv.com",   score: 43, level: "Clima Deteriorado"},
  { id: 3,  date: "2026-03-17", name: "Sofía Ramírez",    company: "Constructora Norte",   email: "sofia@cnorte.mx",       score: 58, level: "Clima Inestable"  },
  { id: 4,  date: "2026-03-15", name: "Javier Torres",    company: "Logística Express",    email: "jtorres@logex.com",     score: 29, level: "Clima Crítico"   },
  { id: 5,  date: "2026-03-14", name: "Mariana López",    company: "Farmacéutica del Sur", email: "m.lopez@farmasur.com",  score: 67, level: "Clima Favorable"  },
  { id: 6,  date: "2026-03-13", name: "Roberto Herrera",  company: "Distribuidora Central",email: "r.herrera@distcen.mx",  score: 51, level: "Clima Inestable"  },
  { id: 7,  date: "2026-03-12", name: "Daniela Castro",   company: "Consultores Nexo",     email: "dcastro@nexo.com.mx",   score: 74, level: "Clima Favorable"  },
  { id: 8,  date: "2026-03-11", name: "Miguel Ángel Ruiz","company": "Manufactura Global", email: "ma.ruiz@manglobal.mx",  score: 38, level: "Clima Deteriorado"},
  { id: 9,  date: "2026-03-10", name: "Valeria Soto",     company: "Servicios Integrales", email: "v.soto@servint.mx",     score: 62, level: "Clima Favorable"  },
  { id: 10, date: "2026-03-09", name: "Fernando Vega",    company: "Inmobiliaria Horizon", email: "fvega@horizon.mx",      score: 47, level: "Clima Deteriorado"},
  { id: 11, date: "2026-03-08", name: "Lucía Morales",    company: "Editorial Voz",        email: "l.morales@edvoz.com",   score: 70, level: "Clima Favorable"  },
  { id: 12, date: "2026-03-07", name: "Emilio Peña",      company: "Agro del Bajío",       email: "epeña@agrobajio.mx",    score: 22, level: "Clima Crítico"   },
];

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function scoreColor(score) {
  if (score >= 60) return { color: "#15803d", bg: "#dcfce7", border: "#86efac" };
  if (score >= 45) return { color: "#ca8a04", bg: "#fef9c3", border: "#fde68a" };
  if (score >= 30) return { color: "#ea580c", bg: "#ffedd5", border: "#fdba74" };
  return              { color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" };
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function Badge({ label, score }) {
  const { color, bg, border } = scoreColor(score);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, color, background: bg, border: `1px solid ${border}`, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function ScorePill({ score }) {
  const { color, bg, border } = scoreColor(score);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", fontFamily: MONO, fontSize: 13, fontWeight: 600, padding: "3px 10px", borderRadius: 8, color, background: bg, border: `1px solid ${border}` }}>
      {score} <span style={{ opacity: 0.6, fontSize: 11, marginLeft: 2 }}>/75</span>
    </span>
  );
}

function Input({ label, id, type = "text", value, onChange, placeholder, error, autoComplete }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: error ? C.red500 : C.slate700 }}>
          {label}
        </label>
      )}
      <input
        id={id} type={type} value={value} placeholder={placeholder}
        autoComplete={autoComplete || "off"}
        onChange={e => onChange(e.target.value)}
        className="field-input"
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 8,
          border: `1.5px solid ${error ? C.red500 : C.slate200}`,
          background: C.white, fontSize: 14, color: C.slate900,
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
      />
      {error && <span style={{ fontSize: 11, color: C.red500, fontWeight: 600 }}>{error}</span>}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", disabled, style: extra = {} }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 7,
    fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    border: "none", borderRadius: 8, transition: "all 0.15s ease",
    opacity: disabled ? 0.6 : 1,
    fontSize: size === "sm" ? 13 : 14,
    padding: size === "sm" ? "7px 14px" : "10px 20px",
  };

  const variants = {
    primary  : { background: C.blue900, color: C.white,   boxShadow: "0 2px 8px rgba(30,58,138,0.25)" },
    secondary: { background: C.white,   color: C.slate700, border: `1.5px solid ${C.slate200}` },
    ghost    : { background: "transparent", color: C.blue900 },
    danger   : { background: C.red50,   color: C.red500,   border: `1.5px solid #fca5a5` },
  };

  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...extra }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = "brightness(1.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}
    >
      {children}
    </button>
  );
}

function Card({ children, style: extra = {}, className = "" }) {
  return (
    <div className={className} style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.slate200}`, boxShadow: "0 1px 4px rgba(15,23,42,0.05)", ...extra }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.slate900, lineHeight: 1.3 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: C.slate500, marginTop: 4 }}>{subtitle}</p>}
    </div>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <Card style={{ padding: "20px 22px", flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.slate500, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent || C.slate900, fontFamily: MONO, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.slate400, marginTop: 5 }}>{sub}</div>}
    </Card>
  );
}

// ─── LOGIN VIEW ───────────────────────────────────────────────────────────────
function LoginView({ onLogin }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { 
      setError("Completa todos los campos."); 
      return; 
    }
    
    setLoading(true);
    setError("");
    
    try {
      const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          password: password 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Correo o contraseña incorrectos.");
      }

      localStorage.setItem("domind_token", data.access_token);

      onLogin(data.user);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${C.slate900} 0%, ${C.blue900} 60%, ${C.slate900} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: FONT }}>
      <style>{GLOBAL_CSS}</style>

      {/* Background texture */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `radial-gradient(circle at 20% 80%, rgba(29,78,216,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(30,58,138,0.2) 0%, transparent 50%)`, pointerEvents: "none" }} />

      <div className="fade-in" style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        {/* Logo block */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, background: C.white, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue900} strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, color: C.white, letterSpacing: "-0.3px" }}>Domind</span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Panel de Administración</p>
        </div>

        {/* Card */}
        <div style={{ background: C.white, borderRadius: 16, padding: "36px 32px", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.slate900, marginBottom: 4 }}>Iniciar sesión</h1>
          <p style={{ fontSize: 13, color: C.slate500, marginBottom: 28 }}>Ingresa tus credenciales para continuar.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Correo electrónico" id="login-email"    type="email"    value={email}    onChange={setEmail}    placeholder="admin@domind.com" autoComplete="email"    onKeyDown={handleKey} />
            <Input label="Contraseña"         id="login-password" type="password" value={password} onChange={setPassword} placeholder="••••••••"          autoComplete="current-password" onKeyDown={handleKey} />
          </div>

          {error && (
            <div style={{ marginTop: 14, padding: "10px 14px", background: C.red50, border: `1px solid #fca5a5`, borderRadius: 8, fontSize: 13, color: C.red500, fontWeight: 500 }}>
              {error}
            </div>
          )}

          <Btn onClick={handleSubmit} disabled={loading} style={{ width: "100%", justifyContent: "center", marginTop: 22, padding: "12px", fontSize: 15 }}>
            {loading
              ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}><path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10"/></svg> Verificando...</>
              : "Ingresar →"}
          </Btn>

        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ activeView, onNav, user, onLogout }) {
  const navItems = [
    { id: "dashboard", label: "Resultados",    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { id: "settings",  label: "Configuración", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  return (
    <aside className="sidebar" style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 230, background: C.slate900, display: "flex", flexDirection: "column", zIndex: 100 }}>

      {/* Logo */}
      <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: C.blue900, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 16, lineHeight: 1 }}>Domind</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.07em" }}>Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {navItems.map(item => {
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className="nav-item"
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                background: active ? "rgba(29,78,216,0.25)" : "transparent",
                color: active ? C.white : "rgba(255,255,255,0.55)",
                fontSize: 14, fontWeight: active ? 600 : 400, textAlign: "left",
                marginBottom: 2, fontFamily: FONT,
                borderLeft: active ? `3px solid ${C.blue700}` : "3px solid transparent",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: "14px 16px", borderTop: `1px solid rgba(255,255,255,0.07)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, background: C.blue900, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: C.white, fontWeight: 700, flexShrink: 0 }}>
            {user.email[0].toUpperCase()}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 12, color: C.white, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "capitalize" }}>{user.role}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{ width: "100%", padding: "7px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, color: "rgba(255,255,255,0.55)", fontSize: 12, cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", gap: 6, justifyContent: "center", transition: "background 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

// ─── TOP BAR (mobile) ─────────────────────────────────────────────────────────
function TopBar({ activeView, onNav, user, onLogout }) {
  return (
    <div className="top-bar" style={{ display: "none", position: "sticky", top: 0, zIndex: 50, background: C.slate900, padding: "0 20px", height: 56, alignItems: "center", justifyContent: "space-between" }}>
      <style>{`@media (max-width:768px){ .top-bar{ display:flex !important; } }`}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, background: C.blue900, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" /></svg>
        </div>
        <span style={{ color: C.white, fontWeight: 700, fontSize: 15 }}>Domind</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {[{ id: "dashboard", label: "Resultados" }, { id: "settings", label: "Config." }].map(item => (
          <button key={item.id} onClick={() => onNav(item.id)}
            style={{ padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 12, fontWeight: 500,
              background: activeView === item.id ? C.blue900 : "rgba(255,255,255,0.08)",
              color: activeView === item.id ? C.white : "rgba(255,255,255,0.55)"
            }}
          >{item.label}</button>
        ))}
        <button onClick={onLogout} style={{ padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 12, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>Salir</button>
      </div>
    </div>
  );
}

// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
function DashboardView() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search,  setSearch]  = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page,    setPage]    = useState(1);
  const PER_PAGE = 8;

  // 1. Efecto para obtener datos cuando el componente se monta
  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const token = localStorage.getItem("domind_token");
        const API_URL = import.meta.env.PUBLIC_API_URL;

        const res = await fetch(`${API_URL}/evaluations/admin/all`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Error al obtener los datos");
        
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Fallo la conexión con la API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  const filtered = data
    .filter(r => {
      const q = search.toLowerCase();
      return !q || 
        (r.name && r.name.toLowerCase().includes(q)) || 
        (r.company && r.company.toLowerCase().includes(q)) || 
        (r.email && r.email.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      const m = sortDir === "asc" ? 1 : -1;
      if (sortKey === "score") return (a.score - b.score) * m;
      if (sortKey === "name")  return (a.name || "").localeCompare(b.name || "") * m;
      return (a.date || "").localeCompare(b.date || "") * m;
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.3 }}><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>;
    return sortDir === "asc"
      ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.blue700} strokeWidth="2.5"><path d="M12 19V5m-7 7 7-7 7 7"/></svg>
      : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.blue700} strokeWidth="2.5"><path d="M12 5v14m-7-7 7 7 7-7"/></svg>;
  };

  const avg  = data.length > 0 ? Math.round(data.reduce((s, r) => s + (r.score || 0), 0) / data.length) : 0;
  const crit = data.filter(r => (r.score || 0) < 30).length;
  const fav  = data.filter(r => (r.score || 0) >= 60).length;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "100px", color: C.slate500 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite", marginRight: 10 }}><path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10"/></svg>
        Cargando datos históricos...
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <SectionHeader title="Resultados de Diagnóstico" subtitle="Historial completo de evaluaciones organizacionales." />

      {/* Stats row */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <StatCard label="Total evaluaciones" value={data.length} sub="Todas las organizaciones" />
        <StatCard label="Puntaje promedio"   value={`${avg}/75`}            sub="Media global" accent={C.blue900} />
        <StatCard label="Clima Favorable"    value={fav}                    sub="Puntaje ≥ 60" accent="#15803d" />
        <StatCard label="Clima Crítico"      value={crit}                   sub="Puntaje < 30" accent="#dc2626" />
      </div>

      {/* Table card */}
      <Card>
        {/* Action bar */}
        <div className="action-bar" style={{ padding: "18px 20px", borderBottom: `1px solid ${C.slate100}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 320 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.slate400} strokeWidth="2" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar por nombre, empresa o email…"
              className="field-input"
              style={{ width: "100%", padding: "9px 12px 9px 34px", borderRadius: 8, border: `1.5px solid ${C.slate200}`, fontSize: 13, color: C.slate800, background: C.slate50 }}
            />
          </div>

          {/* Export buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" size="sm" onClick={() => console.log("Descargar PDF", filtered)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Descargar PDF
            </Btn>
            <Btn variant="secondary" size="sm" onClick={() => console.log("Descargar Excel", filtered)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Descargar Excel
            </Btn>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.slate50, borderBottom: `1px solid ${C.slate200}` }}>
                {[
                  { key: "date",    label: "Fecha" },
                  { key: "name",    label: "Nombre" },
                  { key: "company", label: "Empresa" },
                  { key: "email",   label: "Email" },
                  { key: "score",   label: "Puntaje" },
                  { key: "level",   label: "Nivel de Clima" },
                ].map(col => (
                  <th key={col.key}
                    onClick={() => ["date","name","score"].includes(col.key) && toggleSort(col.key)}
                    style={{
                      padding: "11px 16px", textAlign: "left", fontWeight: 600,
                      color: C.slate600, fontSize: 12, textTransform: "uppercase",
                      letterSpacing: "0.06em", whiteSpace: "nowrap",
                      cursor: ["date","name","score"].includes(col.key) ? "pointer" : "default",
                      userSelect: "none",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                      {col.label}
                      {["date","name","score"].includes(col.key) && <SortIcon k={col.key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && !loading ? (
                 <tr>
                   <td colSpan={6} style={{ padding: "40px 16px", textAlign: "center", color: C.slate400, fontSize: 14 }}>
                     Aún no hay evaluaciones registradas en el sistema.
                   </td>
                 </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px 16px", textAlign: "center", color: C.slate400, fontSize: 14 }}>
                    No se encontraron resultados para "{search}"
                  </td>
                </tr>
              ) : paginated.map((row, i) => (
                <tr key={row.id} className="data-row" style={{ background: i % 2 === 0 ? C.white : C.slate50, borderBottom: `1px solid ${C.slate100}`, transition: "background 0.1s" }}>
                  <td style={{ padding: "13px 16px", color: C.slate500, fontFamily: MONO, fontSize: 12, whiteSpace: "nowrap" }}>{row.date !== 'N/A' ? formatDate(row.date) : 'N/A'}</td>
                  <td style={{ padding: "13px 16px", color: C.slate900, fontWeight: 500, whiteSpace: "nowrap" }}>{row.name}</td>
                  <td style={{ padding: "13px 16px", color: C.slate700, whiteSpace: "nowrap" }}>{row.company}</td>
                  <td style={{ padding: "13px 16px", color: C.slate500, fontFamily: MONO, fontSize: 12 }}>{row.email}</td>
                  <td style={{ padding: "13px 16px" }}><ScorePill score={row.score} /></td>
                  <td style={{ padding: "13px 16px" }}><Badge label={row.level} score={row.score} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.slate100}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: C.slate500 }}>
              Mostrando {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} de {filtered.length}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <Btn variant="secondary" size="sm" disabled={page === 1}      onClick={() => setPage(p => p - 1)}>← Anterior</Btn>
              {Array.from({ length: totalPages }, (_, i) => (
                <Btn key={i} size="sm" variant={page === i + 1 ? "primary" : "secondary"} onClick={() => setPage(i + 1)}>{i + 1}</Btn>
              ))}
              <Btn variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Siguiente →</Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── SETTINGS VIEW ────────────────────────────────────────────────────────────
function SettingsView() {
  const { user } = useAuth();
  const isDueño   = user.role === "dueño";
  const isSistema = user.role === "sistema";

  const [form,    setForm]    = useState({ name: isDueño ? "Administrador Domind" : "", email: isDueño ? user.email : "", newPassword: "", confirmPassword: "" });
  const [errors,  setErrors]  = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key) => (val) => {
    setForm(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: null }));
    setSuccess(false);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                      e.name = "El nombre es requerido.";
    if (!form.email.trim())                     e.email = "El correo es requerido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = "Correo inválido.";
    if (form.newPassword && form.newPassword.length < 6)    e.newPassword = "Mínimo 6 caracteres.";
    if (form.newPassword !== form.confirmPassword)          e.confirmPassword = "Las contraseñas no coinciden.";
    return e;
  };

const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);

    try {
      const token = localStorage.getItem("domind_token");
      const API_URL = import.meta.env.PUBLIC_API_URL;

      const res = await fetch(`${API_URL}/users/profile/update`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.newPassword
        })
      });

      if (res.ok) setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const title    = isDueño   ? "Mi Perfil"                  : "Recuperación de Cuenta Cliente";
  const subtitle = isDueño   ? "Actualiza tus credenciales de acceso al panel." : "Como usuario de sistema, puedes restablecer las credenciales del dueño en caso de emergencia.";

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 600 }}>
      <SectionHeader title={title} subtitle={subtitle} />

      {/* Warning banner for sistema role */}
      {isSistema && (
        <div style={{ padding: "12px 16px", background: "#fffbeb", border: `1px solid #fde68a`, borderRadius: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.amber500} strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#92400e" }}>Modo de rescate activo</p>
            <p style={{ fontSize: 12, color: "#a16207", marginTop: 2 }}>Cualquier cambio aquí actualizará directamente las credenciales del rol <strong>dueño</strong>.</p>
          </div>
        </div>
      )}

      <Card className="settings-card" style={{ padding: "28px 28px" }}>
        {/* Target label for sistema */}
        {isSistema && (
          <div style={{ marginBottom: 20, padding: "10px 14px", background: C.blue50, border: `1px solid ${C.blue100}`, borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.blue900} strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.blue900 }}>Actualizando credenciales de: <strong>dueño</strong></span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Input
            label={isDueño ? "Tu nombre" : "Nombre del dueño"}
            id="s-name" value={form.name} onChange={update("name")}
            placeholder="Nombre completo" error={errors.name}
          />
          <Input
            label={isDueño ? "Tu correo electrónico" : "Correo del dueño"}
            id="s-email" type="email" value={form.email} onChange={update("email")}
            placeholder="correo@domind.com" error={errors.email}
            autoComplete="email"
          />
          <hr style={{ border: "none", borderTop: `1px solid ${C.slate100}`, margin: "4px 0" }} />
          <p style={{ fontSize: 12, color: C.slate400, marginTop: -8 }}>Deja los campos de contraseña en blanco si no deseas cambiarla.</p>
          <Input
            label="Nueva contraseña"
            id="s-newpwd" type="password" value={form.newPassword} onChange={update("newPassword")}
            placeholder="••••••••" error={errors.newPassword}
          />
          <Input
            label="Confirmar nueva contraseña"
            id="s-confirmpwd" type="password" value={form.confirmPassword} onChange={update("confirmPassword")}
            placeholder="••••••••" error={errors.confirmPassword}
          />
        </div>

        {success && (
          <div style={{ marginTop: 18, padding: "11px 14px", background: C.green50, border: `1px solid #86efac`, borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.green500} strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            <span style={{ fontSize: 13, color: "#15803d", fontWeight: 500 }}>Cambios guardados correctamente.</span>
          </div>
        )}

        <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
          <Btn onClick={handleSave} disabled={loading}>
            {loading
              ? <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}><path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10"/></svg> Guardando...</>
              : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Guardar Cambios</>}
          </Btn>
          <Btn variant="secondary" onClick={() => { setForm({ name: isDueño ? "Administrador Domind" : "", email: isDueño ? user.email : "", newPassword: "", confirmPassword: "" }); setErrors({}); setSuccess(false); }}>
            Cancelar
          </Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── MAIN LAYOUT (authenticated) ─────────────────────────────────────────────
function AdminLayout({ user, onLogout }) {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <AuthCtx.Provider value={{ user }}>
      <div style={{ minHeight: "100vh", background: C.slate100, fontFamily: FONT }}>
        <style>{GLOBAL_CSS}</style>

        <Sidebar activeView={activeView} onNav={setActiveView} user={user} onLogout={onLogout} />
        <TopBar  activeView={activeView} onNav={setActiveView} user={user} onLogout={onLogout} />

        {/* Main content */}
        <main className="main-content" style={{ marginLeft: 230, minHeight: "100vh", padding: "32px 32px" }}>
          {/* Page header strip */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${C.slate200}` }}>
            <div>
              <div style={{ fontSize: 11, color: C.slate400, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
                Domind · Panel de Administración
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: C.slate900, lineHeight: 1.2 }}>
                {activeView === "dashboard" ? "Resultados" : "Configuración"}
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: C.slate500 }}>Rol:</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.blue900, padding: "3px 10px", background: C.blue50, borderRadius: 99, border: `1px solid ${C.blue100}`, textTransform: "capitalize" }}>
                {user.role}
              </span>
            </div>
          </div>

          {activeView === "dashboard" && <DashboardView />}
          {activeView === "settings"  && <SettingsView  />}
        </main>
      </div>
    </AuthCtx.Provider>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function DomindAdmin() {
  const [user, setUser] = useState(null);  // null = not logged in

  if (!user) return <LoginView onLogin={setUser} />;
  return <AdminLayout user={user} onLogout={() => setUser(null)} />;
}
