// components.jsx — Base UI components (Button, IconButton, Input, Select,
// Textarea, Badge, Tag, Pill, Skeleton, Header, Topbar, CategoryNav, Footer).

const { useState, useEffect, useRef } = React;

// ─────────────────────────────────────────────────────────────────────────────
// Icon (simple inline SVG library — generic shapes only)

function Icon({ name, size = 18, stroke = 1.8, ...rest }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    cart:   <><path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L22 8H6" /><circle cx="10" cy="21" r="1.2" /><circle cx="18" cy="21" r="1.2" /></>,
    user:   <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    heart:  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
    heartF: <path fill="currentColor" stroke="none" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
    star:   <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />,
    starF:  <path fill="currentColor" stroke="none" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />,
    menu:   <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>,
    chev:   <path d="m6 9 6 6 6-6" />,
    chevR:  <path d="m9 6 6 6-6 6" />,
    plus:   <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    minus:  <path d="M5 12h14" />,
    x:      <><path d="m18 6-12 12" /><path d="m6 6 12 12" /></>,
    check:  <path d="m4 12 5 5L20 6" />,
    bolt:   <path d="M13 2 3 14h7v8l10-12h-7V2z" />,
    eye:    <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
    info:   <><circle cx="12" cy="12" r="10" /><path d="M12 8v.01M11 12h1v5h1" /></>,
    warn:   <><path d="M12 3 2 21h20L12 3z" /><path d="M12 9v5" /><path d="M12 17.5v.01" /></>,
    err:    <><circle cx="12" cy="12" r="10" /><path d="m9 9 6 6M15 9l-6 6" /></>,
    spark:  <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4" />,
    truck:  <><path d="M3 17V6h13v11" /><path d="M16 9h4l3 4v4h-7" /><circle cx="7.5" cy="18.5" r="2" /><circle cx="18.5" cy="18.5" r="2" /></>,
    shield: <path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z" />,
    refresh:<><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></>,
    arrR:   <><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></>,
    arrL:   <><path d="M19 12H5" /><path d="m11 5-7 7 7 7" /></>,
    grid:   <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    tag:    <><path d="M3 12V3h9l9 9-9 9-9-9z" /><circle cx="7.5" cy="7.5" r="1.2" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={stroke}
         strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {paths[name] || null}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Button — variants: primary | secondary | ghost | destructive
//          sizes:    sm | md | lg
//          states:   hover | active | disabled | loading

function Button({
  variant = "primary", size = "md", loading = false, disabled = false,
  leadingIcon, trailingIcon, className = "", style = {}, children, ...rest
}) {
  const isDisabled = disabled || loading;

  const sizeMap = {
    sm: { h: 36, px: 14, fz: 13, gap: 6, ic: 14 },
    md: { h: 44, px: 18, fz: 14, gap: 8, ic: 16 },
    lg: { h: 54, px: 24, fz: 16, gap: 10, ic: 18 },
  }[size];

  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: sizeMap.gap, height: sizeMap.h, padding: `0 ${sizeMap.px}px`,
    fontFamily: "var(--font-display)", fontWeight: 600, fontSize: sizeMap.fz,
    letterSpacing: "-0.005em", borderRadius: "var(--r-pill)",
    border: "1px solid transparent", cursor: isDisabled ? "not-allowed" : "pointer",
    transition: "all var(--t-base) var(--ease)", whiteSpace: "nowrap",
    opacity: isDisabled ? 0.55 : 1, userSelect: "none", position: "relative",
  };

  const variantStyle = {
    primary: {
      color: "var(--on-brand)",
      background: "linear-gradient(var(--grad-angle), var(--grad-from), var(--grad-to))",
      boxShadow: "var(--sh-brand)",
    },
    secondary: {
      color: "var(--text)",
      background: "var(--surface)",
      borderColor: "var(--border-strong)",
      boxShadow: "var(--sh-xs)",
    },
    ghost: {
      color: "var(--text)",
      background: "transparent",
    },
    destructive: {
      color: "#fff",
      background: "var(--error)",
      boxShadow: "0 14px 30px -10px rgba(239,68,68,0.45)",
    },
  }[variant];

  return (
    <button
      disabled={isDisabled}
      style={{ ...base, ...variantStyle, ...style }}
      className={`btn btn-${variant} ${className}`}
      onMouseEnter={(e) => {
        if (isDisabled) return;
        if (variant === "primary" || variant === "destructive") {
          e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
          e.currentTarget.style.filter = "brightness(1.05)";
        } else if (variant === "secondary") {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.borderColor = "var(--brand-500)";
        } else {
          e.currentTarget.style.background = "var(--surface-2)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.filter = "";
        if (variant === "secondary") e.currentTarget.style.borderColor = "var(--border-strong)";
        if (variant === "ghost") e.currentTarget.style.background = "transparent";
      }}
      onMouseDown={(e) => { if (!isDisabled) e.currentTarget.style.transform = "translateY(0) scale(0.98)"; }}
      onMouseUp={(e)   => { if (!isDisabled) e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; }}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner size={sizeMap.ic} />
          <span>Cargando…</span>
        </>
      ) : (
        <>
          {leadingIcon && <Icon name={leadingIcon} size={sizeMap.ic} />}
          <span>{children}</span>
          {trailingIcon && <Icon name={trailingIcon} size={sizeMap.ic} />}
        </>
      )}
    </button>
  );
}

function Spinner({ size = 16 }) {
  return (
    <svg className="spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IconButton — circular variants, sm/md/lg

function IconButton({
  variant = "secondary", size = "md", icon, label, active = false,
  className = "", style = {}, ...rest
}) {
  const dim = { sm: 36, md: 44, lg: 54 }[size];
  const ic  = { sm: 16, md: 20, lg: 22 }[size];

  const variants = {
    primary: { color: "var(--on-brand)", background: "linear-gradient(var(--grad-angle), var(--grad-from), var(--grad-to))", boxShadow: "var(--sh-brand)" },
    secondary: { color: "var(--text)", background: "var(--surface)", border: "1px solid var(--border-strong)", boxShadow: "var(--sh-xs)" },
    ghost: { color: "var(--text)", background: "transparent" },
    soft: { color: "var(--brand-700)", background: "var(--brand-50)" },
    destructive: { color: "#fff", background: "var(--error)" },
  };
  const active_ = active ? { background: "var(--brand-500)", color: "#fff" } : {};

  return (
    <button
      aria-label={label}
      title={label}
      style={{
        width: dim, height: dim, borderRadius: "var(--r-pill)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        border: "1px solid transparent", cursor: "pointer",
        transition: "all var(--t-base) var(--ease)",
        ...variants[variant], ...active_, ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.94)"; }}
      onMouseUp={(e)   => { e.currentTarget.style.transform = "scale(1.08)"; }}
      className={className}
      {...rest}
    >
      <Icon name={icon} size={ic} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Input / Select / Textarea (label, hint, error, leading icon)

function Field({ label, hint, error, required, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      {label && (
        <span style={{
          fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13,
          color: "var(--text)", letterSpacing: "-0.005em",
        }}>
          {label}{required && <span style={{ color: "var(--error)", marginLeft: 4 }}>*</span>}
        </span>
      )}
      {children}
      {error ? (
        <span style={{ fontSize: 12, color: "var(--error)", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Icon name="err" size={13} stroke={2} /> {error}
        </span>
      ) : hint ? (
        <span style={{ fontSize: 12, color: "var(--text-soft)" }}>{hint}</span>
      ) : null}
    </label>
  );
}

function Input({ label, hint, error, leadingIcon, trailingIcon, required, style = {}, ...rest }) {
  const [focus, setFocus] = useState(false);
  const ring = error ? "var(--error)" : focus ? "var(--brand-500)" : "var(--border-strong)";
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        height: 48, padding: "0 14px",
        background: "var(--surface)", color: "var(--text)",
        border: `1.5px solid ${ring}`, borderRadius: "var(--r-md)",
        boxShadow: focus && !error ? "0 0 0 4px rgba(0,200,83,0.15)" : "none",
        transition: "all var(--t-base) var(--ease)",
      }}>
        {leadingIcon && <Icon name={leadingIcon} size={18} stroke={1.8} style={{ color: "var(--text-soft)", flexShrink: 0 }} />}
        <input
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1, minWidth: 0, height: "100%", border: 0, outline: 0, background: "transparent",
            color: "inherit", font: "inherit", fontSize: 14, ...style,
          }}
          {...rest}
        />
        {trailingIcon && <Icon name={trailingIcon} size={18} stroke={1.8} style={{ color: "var(--text-soft)", flexShrink: 0 }} />}
      </div>
    </Field>
  );
}

function Select({ label, hint, error, options = [], required, style = {}, ...rest }) {
  const [focus, setFocus] = useState(false);
  const ring = error ? "var(--error)" : focus ? "var(--brand-500)" : "var(--border-strong)";
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      <div style={{
        position: "relative", height: 48,
        background: "var(--surface)", border: `1.5px solid ${ring}`,
        borderRadius: "var(--r-md)",
        boxShadow: focus && !error ? "0 0 0 4px rgba(0,200,83,0.15)" : "none",
        transition: "all var(--t-base) var(--ease)",
      }}>
        <select
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            appearance: "none", WebkitAppearance: "none",
            width: "100%", height: "100%",
            padding: "0 40px 0 14px",
            background: "transparent", border: 0, outline: 0,
            color: "var(--text)", font: "inherit", fontSize: 14, ...style,
          }}
          {...rest}
        >
          {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
        <Icon name="chev" size={16} stroke={2} style={{
          position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
          pointerEvents: "none", color: "var(--text-soft)",
        }} />
      </div>
    </Field>
  );
}

function Textarea({ label, hint, error, required, rows = 4, style = {}, ...rest }) {
  const [focus, setFocus] = useState(false);
  const ring = error ? "var(--error)" : focus ? "var(--brand-500)" : "var(--border-strong)";
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      <textarea
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        rows={rows}
        style={{
          width: "100%", padding: "12px 14px",
          background: "var(--surface)", color: "var(--text)",
          border: `1.5px solid ${ring}`, borderRadius: "var(--r-md)",
          font: "inherit", fontSize: 14, lineHeight: 1.5,
          outline: 0, resize: "vertical",
          boxShadow: focus && !error ? "0 0 0 4px rgba(0,200,83,0.15)" : "none",
          transition: "all var(--t-base) var(--ease)", ...style,
        }}
        {...rest}
      />
    </Field>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Badge / Tag / Pill

function Badge({ children, tone = "brand", size = "sm", style = {}, leadingIcon }) {
  const tones = {
    brand:     { color: "#fff", background: "var(--brand-500)" },
    gradient:  { color: "#fff", background: "linear-gradient(var(--grad-angle), var(--grad-from), var(--grad-to))" },
    secondary: { color: "#fff", background: "var(--secondary)" },
    accent:    { color: "#1A1A14", background: "var(--accent)" },
    success:   { color: "#fff", background: "var(--success)" },
    error:     { color: "#fff", background: "var(--error)" },
    warning:   { color: "#1A1A14", background: "var(--warning)" },
    info:      { color: "#fff", background: "var(--info)" },
    neutral:   { color: "var(--text)", background: "var(--surface-2)", border: "1px solid var(--border)" },
  };
  const sizes = { xs: { h: 18, px: 6, fz: 10, gap: 3 }, sm: { h: 24, px: 9, fz: 11, gap: 4 }, md: { h: 28, px: 11, fz: 12, gap: 5 } };
  const sz = sizes[size];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: sz.gap,
      height: sz.h, padding: `0 ${sz.px}px`,
      fontFamily: "var(--font-display)", fontWeight: 700, fontSize: sz.fz,
      letterSpacing: "0.02em", borderRadius: "var(--r-pill)",
      textTransform: "uppercase", ...tones[tone], ...style,
    }}>
      {leadingIcon && <Icon name={leadingIcon} size={sz.fz + 1} stroke={2.4} />}
      {children}
    </span>
  );
}

function Tag({ children, tone = "neutral", onRemove, style = {} }) {
  const tones = {
    neutral: { color: "var(--text)", background: "var(--surface-2)", borderColor: "var(--border)" },
    brand:   { color: "var(--brand-700)", background: "var(--brand-50)", borderColor: "var(--brand-200)" },
    secondary:{ color: "var(--secondary-600)", background: "#FFE7EF", borderColor: "#FFC8D8" },
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      height: 28, padding: "0 10px 0 12px",
      border: "1px solid", borderRadius: "var(--r-sm)",
      fontSize: 12, fontWeight: 500, ...tones[tone], ...style,
    }}>
      {children}
      {onRemove && (
        <button onClick={onRemove} aria-label="Quitar" style={{
          marginLeft: 2, width: 16, height: 16, border: 0,
          borderRadius: 999, background: "rgba(0,0,0,0.08)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "inherit",
        }}>
          <Icon name="x" size={10} stroke={2.4} />
        </button>
      )}
    </span>
  );
}

function Pill({ children, active = false, onClick, leadingIcon, style = {} }) {
  return (
    <button
      onClick={onClick}
      className="pill-btn"
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        height: 36, padding: "0 16px",
        fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600,
        borderRadius: "var(--r-pill)", cursor: "pointer",
        border: active ? "1.5px solid transparent" : "1.5px solid var(--border-strong)",
        background: active
          ? "linear-gradient(var(--grad-angle), var(--grad-from), var(--grad-to))"
          : "var(--surface)",
        color: active ? "var(--on-brand)" : "var(--text)",
        boxShadow: active ? "var(--sh-brand)" : "none",
        transition: "all var(--t-base) var(--ease)", ...style,
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = "var(--brand-500)"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = "var(--border-strong)"; }}
    >
      {leadingIcon && <Icon name={leadingIcon} size={14} stroke={2} />}
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Star rating

function Stars({ value = 0, total = 5, size = 14, showValue = true, reviews }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--accent)" }}>
      <span style={{ display: "inline-flex", gap: 1 }}>
        {Array.from({ length: total }).map((_, i) => {
          const filled = i + 1 <= Math.floor(value);
          const half   = !filled && i + 0.5 < value;
          return <Icon key={i} name={filled || half ? "starF" : "star"} size={size} stroke={1.4} style={{ opacity: half ? 0.6 : 1 }} />;
        })}
      </span>
      {showValue && (
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginLeft: 2 }}>
          {value.toFixed(1)}
        </span>
      )}
      {reviews != null && (
        <span style={{ fontSize: 12, color: "var(--text-soft)" }}>
          ({reviews})
        </span>
      )}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton

function Skeleton({ w = "100%", h = 16, r = 6, style = {} }) {
  return <div className="sk" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Product image placeholder

function ProductImage({ label = "PRODUCTO", aspect = "1/1", rounded = "var(--r-lg)", style = {}, accent }) {
  return (
    <div className="ph-stripes" style={{
      position: "relative", width: "100%", aspectRatio: aspect,
      borderRadius: rounded, overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      ...style,
    }}>
      {accent && (
        <div className="blob" style={{
          width: "60%", height: "60%", background: accent, top: "10%", left: "20%",
        }} />
      )}
      <div style={{
        position: "absolute", inset: 12, border: "1px dashed rgba(0,0,0,0.12)",
        borderRadius: "calc(" + rounded + " - 4px)", display: "flex",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "var(--text-soft)",
        }}>
          {label}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Header / Topbar / CategoryNav / Footer

function Topbar() {
  return (
    <div style={{
      background: "linear-gradient(90deg, var(--brand-600), var(--brand-500), var(--accent-2))",
      color: "#fff",
      fontSize: 12, fontWeight: 500, letterSpacing: "0.01em",
    }}>
      <div className="wrap" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        minHeight: 36, paddingTop: 8, paddingBottom: 8,
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Icon name="truck" size={14} stroke={2} />
          <span className="topbar-full">Envío gratis en compras desde $499 · Devoluciones 30 días</span>
          <span className="topbar-short">Envío gratis desde $499</span>
        </span>
        <span style={{ display: "none", gap: 18 }} className="topbar-right">
          <a href="#" style={{ textDecoration: "none", opacity: 0.9 }}>Ayuda</a>
          <a href="#" style={{ textDecoration: "none", opacity: 0.9 }}>Vende con nosotros</a>
          <a href="#" style={{ textDecoration: "none", opacity: 0.9 }}>ES · MXN</a>
        </span>
      </div>
      <style>{`
        .topbar-short{display:none}
        @media(min-width: 768px){.topbar-right{display:inline-flex !important}}
        @media(max-width: 520px){
          .topbar-full{display:none}
          .topbar-short{display:inline}
        }
      `}</style>
    </div>
  );
}

function Logo({ size = 28 }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      fontFamily: "var(--font-display)", fontWeight: 800, fontSize: size * 0.72,
      letterSpacing: "-0.04em",
    }}>
      <span style={{
        width: size, height: size, borderRadius: 999,
        background: "linear-gradient(var(--grad-angle), var(--grad-from), var(--grad-to))",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: size * 0.5, fontWeight: 800,
        boxShadow: "var(--sh-brand)",
      }}>
        p
      </span>
      <span>página<span style={{ color: "var(--brand-500)" }}>/</span></span>
    </span>
  );
}

function Header({ cartCount = 3 }) {
  const [menu, setMenu] = useState(false);

  // Lock scroll while menu is open
  useEffect(() => {
    if (!menu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [menu]);

  return (
    <>
      <header style={{
        background: "var(--surface)", borderBottom: "1px solid var(--border)",
        position: "relative", zIndex: 5,
      }}>
        <div className="wrap hdr-row" style={{
          display: "flex", alignItems: "center", gap: 16, minHeight: 64,
        }}>
          <IconButton className="hdr-menu" variant="ghost" icon="menu" label="Abrir menú"
                      onClick={() => setMenu(true)} />
          <Logo />
          <div className="hdr-search-d" style={{ flex: 1, maxWidth: 560 }}>
            <Input leadingIcon="search" placeholder="Buscar productos, marcas y categorías…" />
          </div>
          <nav style={{ display: "inline-flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
            <IconButton className="hdr-account" variant="ghost" icon="user" label="Mi cuenta" />
            <IconButton className="hdr-fav" variant="ghost" icon="heart" label="Favoritos" />
            <div style={{ position: "relative" }}>
              <IconButton variant="ghost" icon="cart" label="Carrito" />
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: 2, right: -2,
                  minWidth: 18, height: 18, padding: "0 5px", borderRadius: 999,
                  background: "var(--secondary)", color: "#fff",
                  fontSize: 10, fontWeight: 700,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  border: "2px solid var(--surface)",
                  pointerEvents: "none",
                }}>{cartCount}</span>
              )}
            </div>
          </nav>
        </div>
        <div className="hdr-search-m wrap" style={{ paddingBottom: 12 }}>
          <Input leadingIcon="search" placeholder="Buscar productos…" />
        </div>
      </header>

      {menu && <MobileMenu onClose={() => setMenu(false)} cartCount={cartCount} />}

      <style>{`
        .hdr-menu, .hdr-search-m { display: none !important; }
        @media (max-width: 720px) {
          .hdr-row { gap: 8px !important; min-height: 56px !important; }
          .hdr-menu { display: inline-flex !important; }
          .hdr-search-d { display: none !important; }
          .hdr-account, .hdr-fav { display: none !important; }
          .hdr-search-m { display: block !important; }
        }
      `}</style>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MobileMenu — slide-in drawer

function MobileMenu({ onClose, cartCount = 0 }) {
  const items = ["Novedades", "Más vendidos", "Tendencias", "Ropa", "Calzado", "Accesorios", "Electrónica", "Hogar", "Oferta"];
  return (
    <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, zIndex: 100 }}>
      <div onClick={onClose} style={{
        position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)",
        animation: "mm-fade 200ms var(--ease)",
      }} />
      <aside style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: "min(86vw, 340px)", background: "var(--surface)",
        boxShadow: "var(--sh-lg)",
        display: "flex", flexDirection: "column",
        animation: "mm-slide 280ms var(--ease)",
        overflowY: "auto",
      }}>
        <div style={{
          padding: "14px 16px", display: "flex",
          justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid var(--border)",
          position: "sticky", top: 0, background: "var(--surface)", zIndex: 1,
        }}>
          <Logo size={28} />
          <IconButton variant="ghost" icon="x" label="Cerrar menú" onClick={onClose} />
        </div>
        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 2 }}>
          <MenuItem icon="user"  label="Mi cuenta" onClick={onClose} />
          <MenuItem icon="heart" label="Favoritos" onClick={onClose} />
          <MenuItem icon="cart"  label={`Carrito (${cartCount})`} onClick={onClose} />
          <div style={{ height: 1, background: "var(--border)", margin: "12px 8px" }} />
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 11,
            textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-soft)",
            padding: "8px 12px",
          }}>Categorías</div>
          {items.map((c) => (
            <MenuItem key={c} label={c} trailing="chevR" onClick={onClose} />
          ))}
        </div>
        <div style={{
          marginTop: "auto", padding: 16, borderTop: "1px solid var(--border)",
          position: "sticky", bottom: 0, background: "var(--surface)",
        }}>
          <Button leadingIcon="user" style={{ width: "100%" }}>Iniciar sesión</Button>
        </div>
      </aside>
      <style>{`
        @keyframes mm-fade  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mm-slide { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}

function MenuItem({ icon, label, onClick, trailing }) {
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick && onClick(); }} style={{
      display: "flex", alignItems: "center", gap: 14, minHeight: 48,
      padding: "12px 12px", textDecoration: "none", color: "var(--text)",
      borderRadius: "var(--r-md)", fontSize: 15, fontWeight: 500,
      transition: "background var(--t-fast) var(--ease)",
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"}
    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
      {icon && <Icon name={icon} size={20} stroke={1.8} style={{ color: "var(--text-soft)", flexShrink: 0 }} />}
      <span style={{ flex: 1 }}>{label}</span>
      {trailing && <Icon name={trailing} size={16} stroke={2} style={{ color: "var(--text-soft)", flexShrink: 0 }} />}
    </a>
  );
}

function CategoryNav({ items, active, onChange }) {
  const defaults = ["Novedades", "Más vendidos", "Tendencias", "Ropa", "Calzado", "Accesorios", "Electrónica", "Hogar", "Oferta"];
  const list = items || defaults;
  const cur = active ?? list[0];
  return (
    <div style={{
      background: "var(--surface)", borderBottom: "1px solid var(--border)",
    }}>
      <div className="wrap" style={{
        display: "flex", alignItems: "center", gap: 8,
        height: 56, overflowX: "auto", scrollbarWidth: "none",
      }}>
        {list.map((it) => (
          <Pill key={it} active={it === cur} onClick={() => onChange && onChange(it)}>
            {it === "Oferta" && <Icon name="bolt" size={13} stroke={2.4} />}
            {it}
          </Pill>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  const cols = [
    { title: "Ayuda",   items: ["Centro de ayuda", "Envíos y entregas", "Devoluciones", "Métodos de pago"] },
    { title: "Empresa", items: ["Sobre nosotros", "Sostenibilidad", "Trabaja con nosotros", "Prensa"] },
    { title: "Vende",   items: ["Abre tu tienda", "Centro para vendedores", "Calculadora de comisiones"] },
    { title: "Legal",   items: ["Términos", "Privacidad", "Cookies", "Avisos legales"] },
  ];
  return (
    <footer style={{
      background: "var(--surface-2)", borderTop: "1px solid var(--border)",
      color: "var(--text)", marginTop: 64,
    }}>
      <div className="wrap" style={{ padding: "64px 24px 32px" }}>
        <div style={{
          display: "grid", gap: 40,
          gridTemplateColumns: "1.4fr repeat(4, 1fr)",
        }} className="footer-grid">
          <div>
            <Logo size={32} />
            <p style={{
              marginTop: 16, color: "var(--text-muted)", maxWidth: 320,
              fontSize: 14, lineHeight: 1.6,
            }}>
              El marketplace genérico que se adapta a tu producto. Construye tu tienda, vende a todo el mundo.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <Input placeholder="tu@email.com" style={{}} />
              <Button>Suscribirme</Button>
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h5 style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
                {c.title}
              </h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {c.items.map((i) => (
                  <li key={i}>
                    <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14 }}>{i}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 56, paddingTop: 24, borderTop: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
          color: "var(--text-soft)", fontSize: 13,
        }}>
          <span>© 2026 página/ · Todos los derechos reservados</span>
          <span style={{ display: "inline-flex", gap: 18 }}>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Términos</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacidad</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Cookies</a>
          </span>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}

// Export
Object.assign(window, {
  Icon, Spinner, Button, IconButton, Field, Input, Select, Textarea,
  Badge, Tag, Pill, Stars, Skeleton, ProductImage,
  Topbar, Logo, Header, CategoryNav, Footer,
});
