// sections.jsx — Style tile sections (color, typography, tokens, components, demo)

const { useState: useStateS, useEffect: useEffectS } = React;

// ─────────────────────────────────────────────────────────────────────────────
// Section wrapper

function Section({ id, eyebrow, title, subtitle, children, dense = false, bg }) {
  return (
    <section id={id} style={{
      padding: dense ? "56px 0" : "96px 0",
      background: bg || "transparent", position: "relative",
    }}>
      <div className="wrap">
        {(eyebrow || title) && (
          <div style={{ marginBottom: 40, maxWidth: 720 }}>
            {eyebrow && <span className="sec-eyebrow">{eyebrow}</span>}
            {title && (
              <h2 style={{
                marginTop: eyebrow ? 14 : 0,
                fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700,
                lineHeight: 1.05, letterSpacing: "-0.03em",
              }}>{title}</h2>
            )}
            {subtitle && (
              <p style={{ marginTop: 12, color: "var(--text-muted)", fontSize: 17, lineHeight: 1.55, maxWidth: 640 }}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cover hero

function Cover() {
  return (
    <section style={{
      position: "relative", overflow: "hidden",
      paddingTop: 80, paddingBottom: 64,
    }}>
      <div className="blob" style={{ width: 520, height: 520, background: "var(--grad-from)", top: -120, left: -80 }} />
      <div className="blob" style={{ width: 460, height: 460, background: "var(--grad-to)", top: 60, right: -120 }} />
      <div className="blob" style={{ width: 340, height: 340, background: "var(--accent-2)", bottom: -120, left: "40%", opacity: 0.25 }} />

      <div className="wrap" style={{ position: "relative" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 14px 6px 8px",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--r-pill)", fontSize: 12, color: "var(--text-muted)",
          boxShadow: "var(--sh-xs)",
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: 999,
            background: "linear-gradient(var(--grad-angle), var(--grad-from), var(--grad-to))",
          }} />
          Sistema de Diseño · v0.1 · Pop / Juvenil
        </div>

        <h1 style={{
          marginTop: 28, fontSize: "clamp(48px, 9vw, 112px)",
          fontWeight: 700, lineHeight: 0.92, letterSpacing: "-0.045em",
        }}>
          Diseño <span className="brand-grad-text">vibrante</span><br />
          para vender <em style={{ fontStyle: "italic", fontWeight: 500 }}>cualquier</em> cosa.
        </h1>

        <p style={{
          marginTop: 28, maxWidth: 620,
          color: "var(--text-muted)", fontSize: 19, lineHeight: 1.55,
        }}>
          Cimientos visuales y librería de componentes para un e-commerce genérico:
          mismo diseño, mismo código, infinitos catálogos. Sirve igual para tenis,
          llaveros o audífonos.
        </p>

        <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Button size="lg" trailingIcon="arrR" onClick={() => {
            const el = document.getElementById("demo");
            if (el) window.scrollTo({ top: el.offsetTop - 20, behavior: "smooth" });
          }}>
            Ver demo de página
          </Button>
          <Button size="lg" variant="secondary" leadingIcon="grid" onClick={() => {
            const el = document.getElementById("componentes");
            if (el) window.scrollTo({ top: el.offsetTop - 20, behavior: "smooth" });
          }}>
            Explorar componentes
          </Button>
        </div>

        {/* metadata strip */}
        <div style={{
          marginTop: 64, display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 24, padding: "24px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
        }}>
          {[
            ["Stack",   "Next.js 16 · Tailwind 3"],
            ["Tipografía", "Space Grotesk · Sora"],
            ["Tokens",  "Color · Tipo · Espacio · Radios · Sombras · Trans."],
            ["Componentes", "16 base · 5 ProductCards"],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 11, color: "var(--text-soft)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{k}</div>
              <div style={{ marginTop: 6, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Colors

function ColorChip({ name, token, value, contrast = "dark", big = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <div style={{
        background: value, height: big ? 140 : 80,
        borderRadius: "var(--r-md)", border: "1px solid var(--border)",
        position: "relative", overflow: "hidden",
      }}>
        <span style={{
          position: "absolute", top: 8, right: 10,
          color: contrast === "dark" ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.85)",
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.05em",
        }}>
          {value.toUpperCase()}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13 }}>{name}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-soft)" }}>{token}</span>
      </div>
    </div>
  );
}

function ColorRow({ label, items }) {
  return (
    <div>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>{label}</h3>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(items.length, 10)}, minmax(0, 1fr))`, gap: 12 }}>
        {items.map((c) => <ColorChip key={c.token} {...c} />)}
      </div>
    </div>
  );
}

function ColorsSection() {
  const brand = [
    { name: "50",  token: "brand-50",  value: "#E6FBEE" },
    { name: "100", token: "brand-100", value: "#BFF5D6" },
    { name: "200", token: "brand-200", value: "#84ECB1" },
    { name: "300", token: "brand-300", value: "#46DE89" },
    { name: "400", token: "brand-400", value: "#14D26A" },
    { name: "500", token: "brand-500", value: "#00C853", contrast: "light" },
    { name: "600", token: "brand-600", value: "#00A847", contrast: "light" },
    { name: "700", token: "brand-700", value: "#008538", contrast: "light" },
    { name: "800", token: "brand-800", value: "#006B2E", contrast: "light" },
    { name: "900", token: "brand-900", value: "#054A22", contrast: "light" },
  ];
  const accents = [
    { name: "Secondary", token: "secondary", value: "#FF5C8A", contrast: "light" },
    { name: "Accent",    token: "accent",    value: "#FFD23F" },
    { name: "Accent 2",  token: "accent-2",  value: "#7C3AED", contrast: "light" },
  ];
  const status = [
    { name: "Success", token: "success", value: "#16A34A", contrast: "light" },
    { name: "Error",   token: "error",   value: "#EF4444", contrast: "light" },
    { name: "Warning", token: "warning", value: "#F59E0B" },
    { name: "Info",    token: "info",    value: "#3B82F6", contrast: "light" },
  ];
  const neutrals = [
    { name: "Background",  token: "bg",          value: "#FAFAF7" },
    { name: "Surface",     token: "surface",     value: "#FFFFFF" },
    { name: "Surface 2",   token: "surface-2",   value: "#F4F4EE" },
    { name: "Border",      token: "border",      value: "#E7E7DE" },
    { name: "Text Soft",   token: "text-soft",   value: "#8A8A78", contrast: "light" },
    { name: "Text Muted",  token: "text-muted",  value: "#5B5B4D", contrast: "light" },
    { name: "Text",        token: "text",        value: "#1A1A14", contrast: "light" },
  ];

  return (
    <Section id="color" eyebrow="01 / Color" title="Colores con energía, contraste accesible."
      subtitle="Verde dominante saturado, coral y violeta como pareja pop, amarillo como acento de alta energía. Todas las combinaciones cumplen AA sobre los neutros.">
      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        <ColorRow label="Marca" items={brand} />
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32 }} className="colors-acc">
          <ColorRow label="Acentos" items={accents} />
          <ColorRow label="Estado" items={status} />
        </div>
        <ColorRow label="Neutros" items={neutrals} />

        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Gradientes de marca</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 16 }} className="grad-grid">
            <div style={{
              borderRadius: "var(--r-lg)", height: 200, padding: 24,
              background: "linear-gradient(var(--grad-angle), var(--grad-from), var(--grad-to))",
              color: "#0a3a18", display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", opacity: 0.7 }}>GRADIENT-BRAND</span>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>Verde Lima</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, marginTop: 4, opacity: 0.6 }}>#00D97A → #C7F864</div>
              </div>
            </div>
            <div style={{
              borderRadius: "var(--r-lg)", height: 200, padding: 24,
              background: "linear-gradient(135deg, var(--secondary), var(--accent))",
              color: "#3a0a18", display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", opacity: 0.7 }}>GRADIENT-POP</span>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>Pop</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, marginTop: 4, opacity: 0.6 }}>#FF5C8A → #FFD23F</div>
              </div>
            </div>
            <div style={{
              borderRadius: "var(--r-lg)", height: 200, padding: 24,
              background: "linear-gradient(135deg, var(--accent-2), #00BFFF)",
              color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", opacity: 0.7 }}>GRADIENT-NIGHT</span>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>Noche</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, marginTop: 4, opacity: 0.6 }}>#7C3AED → #00BFFF</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .colors-acc { grid-template-columns: 1fr !important; }
          .grad-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Typography

function TypeRow({ name, size, weight, lh, sample, font = "display" }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "200px 1fr",
      gap: 24, alignItems: "baseline",
      padding: "20px 0", borderBottom: "1px solid var(--border)",
    }} className="type-row">
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>{name}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-soft)", marginTop: 4 }}>
          {size}/{lh} · {weight}
        </div>
      </div>
      <div style={{
        fontFamily: font === "display" ? "var(--font-display)" : font === "mono" ? "var(--font-mono)" : "var(--font-body)",
        fontWeight: weight, fontSize: size, lineHeight: lh,
        letterSpacing: parseInt(size) > 32 ? "-0.025em" : parseInt(size) > 20 ? "-0.015em" : "-0.005em",
      }}>
        {sample}
      </div>
      <style>{`@media (max-width: 720px){.type-row{grid-template-columns: 1fr !important;}}`}</style>
    </div>
  );
}

function TypographySection() {
  return (
    <Section id="tipo" eyebrow="02 / Tipografía" title="Geométrica, con personalidad."
      subtitle="Space Grotesk como display (titulares, botones, precios); Sora como body (lecturas largas, formularios). JetBrains Mono para metadatos técnicos.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 48 }} className="type-fams">
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)", padding: 32,
        }}>
          <span className="sec-eyebrow">Display</span>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 88, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 0.9, marginTop: 16 }}>
            Aa
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-soft)", marginTop: 8 }}>
            Space Grotesk · 400 · 500 · 600 · 700
          </div>
          <div style={{ marginTop: 16, fontFamily: "var(--font-display)", fontSize: 17 }}>
            ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br />
            abcdefghijklmnñopqrstuvwxyz<br />
            0123456789 ¿?¡! $€£%
          </div>
        </div>
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)", padding: 32,
        }}>
          <span className="sec-eyebrow">Body</span>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 88, fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 0.9, marginTop: 16 }}>
            Aa
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-soft)", marginTop: 8 }}>
            Sora · 300 · 400 · 500 · 600 · 700
          </div>
          <div style={{ marginTop: 16, fontFamily: "var(--font-body)", fontSize: 17 }}>
            ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br />
            abcdefghijklmnñopqrstuvwxyz<br />
            0123456789 ¿?¡! $€£%
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Escala tipográfica</h3>
      <div>
        <TypeRow name="Display"   size="72px" weight={700} lh={0.95} sample="Vende lo que sea" />
        <TypeRow name="H1"        size="48px" weight={700} lh={1.05} sample="Encabezado primario" />
        <TypeRow name="H2"        size="36px" weight={700} lh={1.1}  sample="Encabezado secundario" />
        <TypeRow name="H3"        size="28px" weight={600} lh={1.2}  sample="Encabezado terciario" />
        <TypeRow name="H4"        size="22px" weight={600} lh={1.25} sample="Encabezado cuarto" />
        <TypeRow name="Lead"      size="20px" weight={400} lh={1.5}  sample="Párrafo introductorio para captar la atención" font="body" />
        <TypeRow name="Body"      size="16px" weight={400} lh={1.55} sample="Texto base para lectura corrida. Sora a 16/24, óptimo en pantalla." font="body" />
        <TypeRow name="Body sm"   size="14px" weight={400} lh={1.5}  sample="Texto secundario, descripciones, formularios" font="body" />
        <TypeRow name="Caption"   size="12px" weight={500} lh={1.4}  sample="Pequeños metadatos y leyendas" font="body" />
        <TypeRow name="Overline"  size="11px" weight={500} lh={1.3}  sample="EYEBROW · MONO · LETTERSPACED" font="mono" />
      </div>

      <style>{`
        @media (max-width: 720px){.type-fams{grid-template-columns: 1fr !important;}}
      `}</style>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tokens: spacing, radii, shadows, transitions

function TokensSection() {
  const spacing = [
    ["space-1",  4],  ["space-2",  8],  ["space-3", 12], ["space-4", 16],
    ["space-5", 20], ["space-6", 24], ["space-8", 32], ["space-10", 40],
    ["space-12", 48], ["space-16", 64],
  ];
  const radii = [
    ["r-xs", "var(--r-xs)", "4px"],
    ["r-sm", "var(--r-sm)", "8px"],
    ["r-md", "var(--r-md)", "12px"],
    ["r-lg", "var(--r-lg)", "18px"],
    ["r-xl", "var(--r-xl)", "28px"],
    ["r-2xl","var(--r-2xl)","40px"],
    ["r-pill","var(--r-pill)","999px"],
  ];
  const shadows = [
    ["xs", "var(--sh-xs)"],
    ["sm", "var(--sh-sm)"],
    ["md", "var(--sh-md)"],
    ["lg", "var(--sh-lg)"],
    ["brand", "var(--sh-brand)"],
  ];
  const trans = [
    ["fast", "120ms", "Hover, toggles"],
    ["base", "220ms", "Tarjetas, paneles"],
    ["slow", "380ms", "Modales, overlays"],
  ];

  return (
    <Section id="tokens" eyebrow="03 / Tokens" title="Espaciado, radios, sombras y transiciones."
      subtitle="Escala 4-base. Radios suaves y generosos para reforzar la sensación amable. Sombras direccionales con tinte de marca para los elementos primarios.">

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="tokens-grid">
        {/* spacing */}
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 18 }}>Espaciado</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {spacing.map(([name, v]) => (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "100px 60px 1fr", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-soft)" }}>{name}</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13 }}>{v}px</span>
                <div style={{ height: 10, width: v, background: "linear-gradient(var(--grad-angle), var(--grad-from), var(--grad-to))", borderRadius: 999 }} />
              </div>
            ))}
          </div>
        </div>

        {/* radii */}
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 18 }}>Radios</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {radii.map(([name, v, px]) => (
              <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 60, height: 60,
                  background: "linear-gradient(var(--grad-angle), var(--grad-from), var(--grad-to))",
                  borderRadius: v,
                }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12 }}>{name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-soft)" }}>{px}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* shadows */}
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 18 }}>Sombras</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {shadows.map(([name, v]) => (
              <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 60, height: 60, background: "var(--surface)",
                  borderRadius: "var(--r-md)", boxShadow: v,
                  border: name === "xs" ? "1px solid var(--border)" : "0",
                }} />
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12 }}>{name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* transitions */}
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 18 }}>Transiciones</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {trans.map(([name, dur, use]) => (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "80px 80px 1fr", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>{name}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-soft)" }}>{dur}</span>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{use}</span>
              </div>
            ))}
            <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-soft)", marginTop: 8 }}>
              ease: cubic-bezier(.22, 1, .36, 1)
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width: 900px){.tokens-grid{grid-template-columns:1fr !important;}}`}</style>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Components showcase

function CompCard({ title, children, code }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "var(--r-lg)", overflow: "hidden",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 20px", borderBottom: "1px solid var(--border)",
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>{title}</span>
        {code && <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-soft)" }}>{code}</span>}
      </div>
      <div style={{ padding: 28, background: "var(--bg)" }}>
        {children}
      </div>
    </div>
  );
}

function ButtonsShowcase() {
  return (
    <CompCard title="Button" code="<Button />">
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {/* Variants */}
        <div>
          <div style={{ fontSize: 11, color: "var(--text-soft)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>variants</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>
        {/* Sizes */}
        <div>
          <div style={{ fontSize: 11, color: "var(--text-soft)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>sizes</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
        {/* States */}
        <div>
          <div style={{ fontSize: 11, color: "var(--text-soft)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>states & icons</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button leadingIcon="cart">Agregar al carrito</Button>
            <Button variant="secondary" trailingIcon="arrR">Continuar</Button>
            <Button loading>Procesando</Button>
            <Button disabled>Deshabilitado</Button>
          </div>
        </div>
        {/* IconButton */}
        <div>
          <div style={{ fontSize: 11, color: "var(--text-soft)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>IconButton</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <IconButton variant="primary" icon="cart" label="Cart" />
            <IconButton variant="secondary" icon="heart" label="Fav" />
            <IconButton variant="ghost" icon="search" label="Search" />
            <IconButton variant="soft" icon="bolt" label="Bolt" />
            <IconButton variant="destructive" icon="x" label="Close" />
            <IconButton variant="secondary" icon="user" label="User" size="sm" />
            <IconButton variant="secondary" icon="user" label="User" size="md" />
            <IconButton variant="secondary" icon="user" label="User" size="lg" />
          </div>
        </div>
      </div>
    </CompCard>
  );
}

function FormsShowcase() {
  const [v, setV] = useStateS("");
  const [err, setErr] = useStateS(false);
  return (
    <CompCard title="Form controls" code="<Input /> <Select /> <Textarea />">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="forms-grid">
        <Input label="Nombre" placeholder="Tu nombre completo" required />
        <Input label="Correo" placeholder="tu@email.com" leadingIcon="user" hint="Te enviaremos las notificaciones aquí." />
        <Input label="Búsqueda" placeholder="¿Qué buscas hoy?" leadingIcon="search" />
        <Input label="Contraseña" type="password" value="•••••••" onChange={() => {}} error="Mínimo 8 caracteres" />
        <Select label="País" options={["México", "Argentina", "Colombia", "España", "Chile"]} />
        <Select label="Categoría" options={["Ropa", "Calzado", "Accesorios", "Electrónica"]} />
        <div style={{ gridColumn: "1 / -1" }}>
          <Textarea label="Descripción" placeholder="Cuéntanos sobre el producto…" hint="Máximo 280 caracteres." />
        </div>
      </div>
      <style>{`@media(max-width: 720px){.forms-grid{grid-template-columns:1fr !important;}}`}</style>
    </CompCard>
  );
}

function BadgesShowcase() {
  return (
    <CompCard title="Badge · Tag · Pill" code="<Badge /> <Tag /> <Pill />">
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-soft)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Badge — etiquetas pequeñas, alta visibilidad</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Badge tone="brand">Nuevo</Badge>
            <Badge tone="gradient" leadingIcon="bolt">-40%</Badge>
            <Badge tone="secondary">Hot</Badge>
            <Badge tone="accent">Top ventas</Badge>
            <Badge tone="success" leadingIcon="check">En stock</Badge>
            <Badge tone="error">Sin stock</Badge>
            <Badge tone="warning">Pocas unidades</Badge>
            <Badge tone="info">Envío hoy</Badge>
            <Badge tone="neutral">Categoría</Badge>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-soft)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Tag — filtros aplicados, removibles</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Tag onRemove={() => {}}>Talla M</Tag>
            <Tag onRemove={() => {}}>Color: Negro</Tag>
            <Tag tone="brand" onRemove={() => {}}>Envío gratis</Tag>
            <Tag tone="secondary" onRemove={() => {}}>En oferta</Tag>
            <Tag>$500 – $1,000</Tag>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-soft)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Pill — categorías navegables</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Pill active>Todos</Pill>
            <Pill>Novedades</Pill>
            <Pill>Más vendidos</Pill>
            <Pill leadingIcon="bolt">Oferta</Pill>
            <Pill>Ropa</Pill>
            <Pill>Calzado</Pill>
            <Pill>Accesorios</Pill>
          </div>
        </div>
      </div>
    </CompCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sample products

const SAMPLE = [
  {
    id: 1, brand: "ATELIER", label: "PRODUCTO · A", name: "Producto destacado de catálogo genérico",
    price: 1299, oldPrice: 1899, rating: 4.7, reviews: 248, tag: "Nuevo",
    accent: "#00D97A", sizes: ["XS", "S", "M", "L", "XL"], fav: false,
  },
  {
    id: 2, brand: "STUDIO", label: "PRODUCTO · B", name: "Otro artículo del marketplace",
    price: 599, oldPrice: 999, rating: 4.4, reviews: 132, tag: "Top",
    accent: "#FF5C8A", sizes: ["UNI"], stock: 5,
  },
  {
    id: 3, brand: "BRAND", label: "PRODUCTO · C", name: "Tercera referencia para mostrar el grid",
    price: 349, oldPrice: 499, rating: 4.9, reviews: 891,
    accent: "#FFD23F", sizes: ["35", "36", "37", "38", "39", "40"],
  },
  {
    id: 4, brand: "MAKER", label: "PRODUCTO · D", name: "Cuarto producto, otra fila del listado",
    price: 2199, oldPrice: 2899, rating: 4.6, reviews: 401, tag: "Trending",
    accent: "#7C3AED",
  },
];

function ProductCardsSection() {
  const variants = [
    { Comp: ProductCardCanonical,    name: "Canónico",                code: "<ProductCard />" },
    { Comp: ProductCardFullBleed,    name: "Full-bleed",              code: "<ProductCard variant=\"full-bleed\" />" },
    { Comp: ProductCardDiscount,     name: "Descuento prominente",    code: "<ProductCard variant=\"discount\" />" },
    { Comp: ProductCardQuickActions, name: "Acciones rápidas (hover)", code: "<ProductCard variant=\"quick-actions\" />" },
    { Comp: ProductCardMinimal,      name: "Minimal sin chrome",      code: "<ProductCard variant=\"minimal\" />" },
  ];

  return (
    <Section id="productcard" eyebrow="04 / ProductCard" title="El componente clave, en cinco voces."
      subtitle="Mismo modelo de datos (name, price, oldPrice, rating, reviews, badge, fav). Distintos énfasis: galería, oferta, fricción cero, listado limpio.">
      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        {variants.map(({ Comp, name, code }, i) => (
          <div key={name}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-soft)" }}>0{i + 1}</span>
                <h3 style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>{name}</h3>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-soft)" }}>{code}</span>
            </div>
            <div style={{
              display: "grid", gap: 20,
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            }}>
              {SAMPLE.map((p) => <Comp key={p.id} p={p} />)}
            </div>
          </div>
        ))}

        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-soft)" }}>SK</span>
            <h3 style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>Estado de carga</h3>
          </div>
          <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {[0, 1, 2, 3].map((i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Components umbrella

function ComponentsSection() {
  return (
    <Section id="componentes" eyebrow="05 / Componentes" title="Base UI, autocontenido."
      subtitle="Cada componente con sus props tipadas. Todos respetan los tokens — cambia el color de marca y todo se mueve junto.">
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <ButtonsShowcase />
        <FormsShowcase />
        <BadgesShowcase />
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout chrome

function LayoutSection() {
  const [cat, setCat] = useStateS("Novedades");
  return (
    <Section id="layout" eyebrow="06 / Layout" title="Chrome de tienda."
      subtitle="Topbar promocional, Header con buscador, CategoryNav navegable, Footer completo. Cuatro piezas que dan estructura a cualquier página.">
      <div style={{
        background: "var(--bg)", border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)", overflow: "hidden",
      }}>
        <Topbar />
        <Header cartCount={3} />
        <CategoryNav active={cat} onChange={setCat} />
      </div>
      <div style={{
        marginTop: 24, background: "var(--bg)", border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)", overflow: "hidden",
      }}>
        <Footer />
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo página completa

function DemoSection() {
  const [cat, setCat] = useStateS("Más vendidos");
  return (
    <Section id="demo" eyebrow="07 / En vivo" title="Una página, todo el sistema."
      subtitle="Cómo se ve todo cuando se compone. Los ProductCards de aquí son los canónicos; cambia el variant en código para listar otro estilo.">
      <div style={{
        background: "var(--bg)", border: "1px solid var(--border)",
        borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--sh-md)",
      }}>
        <Topbar />
        <Header cartCount={3} />
        <CategoryNav active={cat} onChange={setCat} />

        {/* Hero promo */}
        <div style={{
          position: "relative", overflow: "hidden",
          background: "linear-gradient(120deg, var(--brand-50), #FFF9E6 60%, #FFE7EF)",
        }}>
          <div className="blob" style={{ width: 360, height: 360, background: "var(--grad-from)", top: -100, right: -60 }} />
          <div className="blob" style={{ width: 280, height: 280, background: "var(--secondary)", bottom: -120, left: 100, opacity: 0.35 }} />
          <div style={{
            position: "relative", padding: "56px 32px", display: "grid",
            gridTemplateColumns: "1.2fr 1fr", gap: 32, alignItems: "center",
          }} className="hero-promo">
            <div>
              <Badge tone="gradient" leadingIcon="bolt">Esta semana</Badge>
              <h1 style={{
                marginTop: 16, fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 700, lineHeight: 0.95, letterSpacing: "-0.035em",
              }}>
                Hasta <span className="brand-grad-text">-40%</span><br />
                en novedades<br />
                de temporada.
              </h1>
              <p style={{ marginTop: 16, color: "var(--text-muted)", fontSize: 17, maxWidth: 440 }}>
                Selección curada de productos con descuento por tiempo limitado. Envío gratis arriba de $499.
              </p>
              <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Button size="lg" trailingIcon="arrR">Comprar ahora</Button>
                <Button size="lg" variant="secondary">Ver categorías</Button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="hero-imgs">
              <ProductImage label="HERO · A" accent="#00D97A" aspect="3/4" style={{ transform: "rotate(-3deg)" }} />
              <ProductImage label="HERO · B" accent="#FF5C8A" aspect="3/4" style={{ transform: "rotate(3deg) translateY(20px)" }} />
            </div>
          </div>
        </div>

        {/* Filters + grid */}
        <div style={{ padding: "40px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>Más vendidos</h2>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--text-soft)" }}>1,248 productos</span>
              <Select options={["Relevancia", "Menor precio", "Mayor precio", "Mejor calificados"]} style={{ width: 180 }} />
            </div>
          </div>

          <div style={{ marginBottom: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Tag tone="brand" onRemove={() => {}}>Envío gratis</Tag>
            <Tag onRemove={() => {}}>Color: Negro</Tag>
            <Tag onRemove={() => {}}>Talla M</Tag>
            <Tag onRemove={() => {}}>$500 – $1,500</Tag>
            <button style={{
              border: 0, background: "transparent", color: "var(--brand-700)",
              fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, cursor: "pointer",
              padding: "0 8px", height: 28,
            }}>Limpiar todo</button>
          </div>

          <div style={{
            display: "grid", gap: 20,
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          }}>
            {[...SAMPLE, ...SAMPLE.map(s => ({...s, id: s.id + 10}))].map((p) => (
              <ProductCardCanonical key={p.id} p={p} />
            ))}
          </div>

          <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
            <Button variant="secondary" trailingIcon="arrR">Cargar más productos</Button>
          </div>
        </div>

        <Footer />
      </div>

      <style>{`
        @media (max-width: 880px) {
          .hero-promo { grid-template-columns: 1fr !important; }
          .hero-imgs { display: none !important; }
        }
      `}</style>
    </Section>
  );
}

Object.assign(window, {
  Section, Cover, ColorsSection, TypographySection,
  TokensSection, ComponentsSection, ProductCardsSection,
  LayoutSection, DemoSection, SAMPLE,
});
