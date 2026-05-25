// home-app.jsx — Composición de la página Home + Tweaks.

const { useState: useStateHA, useEffect: useEffectHA } = React;

// Reuses PALETTES / FONT_PAIRS / DENSITIES / RADIUS_PRESETS / applyTokens from app.jsx
// → app.jsx is NOT loaded here. Re-define what we need (or share via a separate file).

const PALETTES_H = {
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

const FONT_PAIRS_H = {
  "space-sora":      { display: "'Space Grotesk', system-ui, sans-serif", body: "'Sora', system-ui, sans-serif",         label: "Space + Sora" },
  "bricolage-inter": { display: "'Bricolage Grotesque', system-ui, sans-serif", body: "'Inter Tight', system-ui, sans-serif", label: "Bricolage + Inter Tight" },
  "space-mono":      { display: "'Space Grotesk', system-ui, sans-serif", body: "'JetBrains Mono', monospace",          label: "Space + JetBrains" },
};
const DENSITIES_H = { compact: 12, comfy: 16, wide: 22 };
const RADIUS_H = {
  sharp:  { xs: 0,  sm: 0,  md: 2,  lg: 4,  xl: 6,  xxl: 8  },
  soft:   { xs: 2,  sm: 4,  md: 8,  lg: 12, xl: 16, xxl: 22 },
  round:  { xs: 4,  sm: 8,  md: 12, lg: 18, xl: 28, xxl: 40 },
  pillow: { xs: 8,  sm: 14, md: 20, lg: 28, xl: 40, xxl: 56 },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "palette": "verde",
  "fontPair": "space-sora",
  "density": "comfy",
  "radius": "round",
  "gradient": 1
}/*EDITMODE-END*/;

function applyTokensH(t) {
  const r = document.documentElement;
  r.setAttribute("data-theme", t.theme);
  const p = PALETTES_H[t.palette] || PALETTES_H.verde;
  Object.entries(p.brand).forEach(([k, v]) => r.style.setProperty(`--brand-${k}`, v));
  r.style.setProperty("--secondary", p.secondary);
  r.style.setProperty("--secondary-600", p.secondary600);
  r.style.setProperty("--accent", p.accent);
  r.style.setProperty("--accent-2", p.accent2);
  r.style.setProperty("--grad-from", p.gradFrom);
  r.style.setProperty("--grad-to", p.gradTo);
  r.style.setProperty("--sh-brand", p.shBrand);

  const fp = FONT_PAIRS_H[t.fontPair] || FONT_PAIRS_H["space-sora"];
  r.style.setProperty("--font-display", fp.display);
  r.style.setProperty("--font-body",    fp.body);

  const d = DENSITIES_H[t.density] ?? 16;
  r.style.setProperty("--pad", d + "px");
  r.style.setProperty("--gap", d + "px");

  const rad = RADIUS_H[t.radius] || RADIUS_H.round;
  r.style.setProperty("--r-xs", rad.xs + "px");
  r.style.setProperty("--r-sm", rad.sm + "px");
  r.style.setProperty("--r-md", rad.md + "px");
  r.style.setProperty("--r-lg", rad.lg + "px");
  r.style.setProperty("--r-xl", rad.xl + "px");
  r.style.setProperty("--r-2xl", rad.xxl + "px");

  r.style.setProperty("--grad-intensity", String(t.gradient));
}

// ─────────────────────────────────────────────────────────────────────────────

function HomeApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [cat, setCat] = useStateHA("Novedades");
  useEffectHA(() => { applyTokensH(t); }, [t]);

  return (
    <>
      <Topbar />
      <Header cartCount={3} onSearch={() => {}} />
      <CategoryNav active={cat} onChange={setCat} />

      <main>
        <HeroSection />
        <TrustBar />
        <CategoryGrid />
        <FeaturedProducts />
        <PromoBanner />
        <NewArrivals />
        <FlashSale />
        <BestSellers />
        <Newsletter />
      </main>

      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Tema" />
        <TweakRadio label="Modo" value={t.theme} options={["light","dark"]} onChange={(v) => setTweak("theme", v)} />
        <TweakSelect
          label="Paleta"
          value={t.palette}
          options={Object.entries(PALETTES_H).map(([k, p]) => ({ value: k, label: p.label }))}
          onChange={(v) => setTweak("palette", v)}
        />
        <TweakSection label="Tipografía" />
        <TweakSelect
          label="Familia"
          value={t.fontPair}
          options={Object.entries(FONT_PAIRS_H).map(([k, p]) => ({ value: k, label: p.label }))}
          onChange={(v) => setTweak("fontPair", v)}
        />

        <TweakSection label="Forma" />
        <TweakRadio label="Radio"    value={t.radius}  options={["sharp","soft","round","pillow"]} onChange={(v) => setTweak("radius", v)} />
        <TweakRadio label="Densidad" value={t.density} options={["compact","comfy","wide"]} onChange={(v) => setTweak("density", v)} />
        <TweakSlider label="Intensidad gradiente" value={t.gradient} min={0} max={1} step={0.05} onChange={(v) => setTweak("gradient", v)} />

        <TweakSection label="Acciones" />
        <TweakButton
          label="Restablecer defaults"
          onClick={() => { Object.entries(TWEAK_DEFAULTS).forEach(([k, v]) => setTweak(k, v)); }}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<HomeApp />);
