// app.jsx — Main app composition + Tweaks

const { useState: useStateA, useEffect: useEffectA, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "palette": "verde",
  "fontPair": "space-sora",
  "density": "comfy",
  "radius": "round",
  "gradient": 1
}/*EDITMODE-END*/;

const PALETTES = {
  verde: {
    label: "Verde pop",
    brand:   { 50:"#E6FBEE",100:"#BFF5D6",200:"#84ECB1",300:"#46DE89",400:"#14D26A",
               500:"#00C853",600:"#00A847",700:"#008538",800:"#006B2E",900:"#054A22" },
    secondary: "#FF5C8A", secondary600: "#ED3A6E",
    accent: "#FFD23F", accent2: "#7C3AED",
    gradFrom: "#00D97A", gradTo: "#C7F864",
    shBrand: "0 14px 30px -10px rgba(0, 200, 83, 0.45)",
  },
  magenta: {
    label: "Magenta",
    brand:   { 50:"#FFE7EF",100:"#FFC0D4",200:"#FF94B7",300:"#FF6996",400:"#FF4378",
               500:"#FF1F5F",600:"#E60049",700:"#B8003A",800:"#8B002B",900:"#5C001D" },
    secondary: "#7C3AED", secondary600: "#6D28D9",
    accent: "#FFD23F", accent2: "#00BFFF",
    gradFrom: "#FF3D7F", gradTo: "#FFB347",
    shBrand: "0 14px 30px -10px rgba(255, 31, 95, 0.45)",
  },
  cobalto: {
    label: "Cobalto",
    brand:   { 50:"#E6F0FF",100:"#BFD7FF",200:"#94BCFF",300:"#669CFF",400:"#3E80FF",
               500:"#1A66FF",600:"#0049E0",700:"#0036B2",800:"#002584",900:"#001656" },
    secondary: "#22D3EE", secondary600: "#0BB5D0",
    accent: "#FFD23F", accent2: "#FF5C8A",
    gradFrom: "#3B82F6", gradTo: "#22D3EE",
    shBrand: "0 14px 30px -10px rgba(26, 102, 255, 0.45)",
  },
  solar: {
    label: "Solar",
    brand:   { 50:"#FFF1E6",100:"#FFD9BF",200:"#FFBC8F",300:"#FF9C5C",400:"#FF7D2E",
               500:"#FF6B0F",600:"#E55400",700:"#B84200",800:"#8A3100",900:"#5C2000" },
    secondary: "#7C3AED", secondary600: "#6D28D9",
    accent: "#FFD23F", accent2: "#16A34A",
    gradFrom: "#FF6B35", gradTo: "#FFD23F",
    shBrand: "0 14px 30px -10px rgba(255, 107, 15, 0.45)",
  },
};

const FONT_PAIRS = {
  "space-sora":     { display: "'Space Grotesk', system-ui, sans-serif", body: "'Sora', system-ui, sans-serif", label: "Space + Sora" },
  "bricolage-inter":{ display: "'Bricolage Grotesque', system-ui, sans-serif", body: "'Inter Tight', system-ui, sans-serif", label: "Bricolage + Inter Tight" },
  "space-mono":     { display: "'Space Grotesk', system-ui, sans-serif", body: "'JetBrains Mono', monospace", label: "Space + JetBrains" },
};

const DENSITIES = {
  compact: { pad: 12, gap: 12 },
  comfy:   { pad: 16, gap: 16 },
  wide:    { pad: 22, gap: 22 },
};

const RADIUS_PRESETS = {
  sharp:  { xs: 0,  sm: 0,  md: 2,  lg: 4,  xl: 6,  xxl: 8  },
  soft:   { xs: 2,  sm: 4,  md: 8,  lg: 12, xl: 16, xxl: 22 },
  round:  { xs: 4,  sm: 8,  md: 12, lg: 18, xl: 28, xxl: 40 },
  pillow: { xs: 8,  sm: 14, md: 20, lg: 28, xl: 40, xxl: 56 },
};

// ─────────────────────────────────────────────────────────────────────────────

function applyTokens(t) {
  const root = document.documentElement;
  // theme
  root.setAttribute("data-theme", t.theme);

  // palette
  const p = PALETTES[t.palette] || PALETTES.verde;
  Object.entries(p.brand).forEach(([k, v]) => root.style.setProperty(`--brand-${k}`, v));
  root.style.setProperty("--secondary", p.secondary);
  root.style.setProperty("--secondary-600", p.secondary600);
  root.style.setProperty("--accent", p.accent);
  root.style.setProperty("--accent-2", p.accent2);
  root.style.setProperty("--grad-from", p.gradFrom);
  root.style.setProperty("--grad-to", p.gradTo);
  root.style.setProperty("--sh-brand", p.shBrand);

  // fonts
  const fp = FONT_PAIRS[t.fontPair] || FONT_PAIRS["space-sora"];
  root.style.setProperty("--font-display", fp.display);
  root.style.setProperty("--font-body",    fp.body);

  // density
  const d = DENSITIES[t.density] || DENSITIES.comfy;
  root.style.setProperty("--pad", d.pad + "px");
  root.style.setProperty("--gap", d.gap + "px");

  // radius
  const r = RADIUS_PRESETS[t.radius] || RADIUS_PRESETS.round;
  root.style.setProperty("--r-xs", r.xs + "px");
  root.style.setProperty("--r-sm", r.sm + "px");
  root.style.setProperty("--r-md", r.md + "px");
  root.style.setProperty("--r-lg", r.lg + "px");
  root.style.setProperty("--r-xl", r.xl + "px");
  root.style.setProperty("--r-2xl", r.xxl + "px");

  // gradient intensity
  root.style.setProperty("--grad-intensity", String(t.gradient));
}

// ─────────────────────────────────────────────────────────────────────────────

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffectA(() => { applyTokens(t); }, [t]);

  // Build a palette preview for the TweakColor swatches
  const paletteOptions = useMemo(
    () => Object.entries(PALETTES).map(([key, p]) => ({
      value: key,
      colors: [p.brand[500], p.gradFrom, p.gradTo, p.secondary, p.accent],
    })),
    []
  );

  return (
    <>
      <SideNav />
      <main>
        <Cover />
        <ColorsSection />
        <TypographySection />
        <TokensSection />
        <ComponentsSection />
        <ProductCardsSection />
        <LayoutSection />
        <DemoSection />
        <ClosingSection />
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Tema" />
        <TweakRadio
          label="Modo"
          value={t.theme}
          options={["light", "dark"]}
          onChange={(v) => setTweak("theme", v)}
        />
        <TweakSelect
          label="Paleta"
          value={t.palette}
          options={Object.entries(PALETTES).map(([k, p]) => ({ value: k, label: p.label }))}
          onChange={(v) => setTweak("palette", v)}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          {paletteOptions.map((p) => (
            <button
              key={p.value}
              onClick={() => setTweak("palette", p.value)}
              aria-label={p.value}
              style={{
                flex: 1, height: 32, borderRadius: 8,
                border: t.palette === p.value ? "2px solid var(--text)" : "1px solid var(--border-strong)",
                cursor: "pointer", overflow: "hidden", padding: 2,
                background: "var(--surface)",
                display: "flex", gap: 1,
              }}
            >
              {p.colors.map((c, i) => (
                <span key={i} style={{ flex: 1, background: c, borderRadius: 3 }} />
              ))}
            </button>
          ))}
        </div>

        <TweakSection label="Tipografía" />
        <TweakSelect
          label="Familia"
          value={t.fontPair}
          options={Object.entries(FONT_PAIRS).map(([k, p]) => ({ value: k, label: p.label }))}
          onChange={(v) => setTweak("fontPair", v)}
        />

        <TweakSection label="Forma" />
        <TweakRadio
          label="Radio"
          value={t.radius}
          options={["sharp", "soft", "round", "pillow"]}
          onChange={(v) => setTweak("radius", v)}
        />
        <TweakRadio
          label="Densidad"
          value={t.density}
          options={["compact", "comfy", "wide"]}
          onChange={(v) => setTweak("density", v)}
        />
        <TweakSlider
          label="Intensidad gradiente"
          value={t.gradient}
          min={0} max={1} step={0.05}
          onChange={(v) => setTweak("gradient", v)}
        />

        <TweakSection label="Acciones" />
        <TweakButton
          label="Restablecer defaults"
          onClick={() => {
            Object.entries(TWEAK_DEFAULTS).forEach(([k, v]) => setTweak(k, v));
          }}
        />
      </TweaksPanel>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Side nav

function SideNav() {
  const items = [
    ["color",        "Color"],
    ["tipo",         "Tipografía"],
    ["tokens",       "Tokens"],
    ["componentes",  "Componentes"],
    ["productcard",  "ProductCard"],
    ["layout",       "Layout"],
    ["demo",         "Demo"],
  ];
  const [active, setActive] = useStateA("color");

  useEffectA(() => {
    const ob = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) setActive(e.target.id);
      }
    }, { rootMargin: "-40% 0px -55% 0px" });
    items.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) ob.observe(el);
    });
    return () => ob.disconnect();
  }, []);

  return (
    <aside style={{
      position: "fixed", left: 24, top: "50%", transform: "translateY(-50%) scale(var(--dc-inv-zoom,1))",
      transformOrigin: "left center",
      zIndex: 30, display: "flex", flexDirection: "column", gap: 6,
      background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
      padding: 8, borderRadius: "var(--r-pill)",
      border: "1px solid var(--border)", boxShadow: "var(--sh-sm)",
    }} className="side-nav">
      {items.map(([id, label]) => (
        <a key={id} href={`#${id}`} onClick={() => setActive(id)} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 14px 6px 10px", textDecoration: "none",
          color: active === id ? "var(--text)" : "var(--text-soft)",
          fontFamily: "var(--font-display)", fontWeight: active === id ? 600 : 500,
          fontSize: 12, borderRadius: 999,
          background: active === id ? "var(--surface)" : "transparent",
          boxShadow: active === id ? "var(--sh-xs)" : "none",
          transition: "color var(--t-fast) var(--ease)",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: 999,
            background: active === id ? "var(--brand-500)" : "var(--border-strong)",
          }} />
          {label}
        </a>
      ))}
      <style>{`@media (max-width: 1100px){.side-nav{display:none !important;}}`}</style>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Closing section

function ClosingSection() {
  return (
    <section style={{ padding: "120px 0 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div className="blob" style={{ width: 600, height: 600, background: "var(--grad-from)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      <div className="wrap" style={{ position: "relative" }}>
        <span className="sec-eyebrow" style={{ justifyContent: "center" }}>Listo para integrar</span>
        <h2 style={{
          marginTop: 16, fontSize: "clamp(36px, 6vw, 72px)",
          fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1,
        }}>
          Próximo paso:<br />
          <span className="brand-grad-text">construir páginas</span>.
        </h2>
        <p style={{
          maxWidth: 560, margin: "24px auto 0",
          color: "var(--text-muted)", fontSize: 18, lineHeight: 1.55,
        }}>
          Los tokens y componentes están listos para integrarse en Next.js + Tailwind.
          Encuentra los archivos <code style={{ fontFamily: "var(--font-mono)", background: "var(--surface-2)", padding: "2px 6px", borderRadius: 4 }}>.tsx</code> y el <code style={{ fontFamily: "var(--font-mono)", background: "var(--surface-2)", padding: "2px 6px", borderRadius: 4 }}>tailwind.config.ts</code> en la carpeta <code style={{ fontFamily: "var(--font-mono)", background: "var(--surface-2)", padding: "2px 6px", borderRadius: 4 }}>/code</code> del proyecto.
        </p>
        <div style={{ marginTop: 36, display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Button size="lg" leadingIcon="grid">Index del código</Button>
          <Button size="lg" variant="secondary" trailingIcon="arrR">Diseñar la home</Button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
