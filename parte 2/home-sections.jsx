// home-sections.jsx — Secciones específicas de la página de inicio.
// Reutiliza components.jsx (Button, Header, etc.) y product-cards.jsx.

const { useState: useStateH, useEffect: useEffectH, useMemo: useMemoH, useRef: useRefH } = React;

// ─────────────────────────────────────────────────────────────────────────────
// Datos de ejemplo

const HOME_PRODUCTS = [
  { id: 101, brand: "ATELIER",  label: "PRODUCTO · A", name: "Producto destacado de catálogo general", price: 1299, oldPrice: 1899, rating: 4.7, reviews: 248, tag: "Nuevo",    accent: "#00D97A", sizes: ["XS","S","M","L","XL"] },
  { id: 102, brand: "STUDIO",   label: "PRODUCTO · B", name: "Otra referencia del marketplace",        price:  599, oldPrice:  999, rating: 4.4, reviews: 132, tag: "Top",      accent: "#FF5C8A", sizes: ["UNI"] },
  { id: 103, brand: "MAKER",    label: "PRODUCTO · C", name: "Tercer producto del listado",            price:  349, oldPrice:  499, rating: 4.9, reviews: 891,                  accent: "#FFD23F" },
  { id: 104, brand: "BRAND",    label: "PRODUCTO · D", name: "Cuarta entrada en el grid",              price: 2199, oldPrice: 2899, rating: 4.6, reviews: 401, tag: "Trending", accent: "#7C3AED" },
  { id: 105, brand: "FORMA",    label: "PRODUCTO · E", name: "Quinto artículo destacado",              price:  789, oldPrice: 1099, rating: 4.5, reviews:  56,                  accent: "#00BFFF" },
  { id: 106, brand: "LINEA",    label: "PRODUCTO · F", name: "Sexto producto de la galería",           price: 1499, oldPrice: 1999, rating: 4.8, reviews: 312, tag: "Premium",  accent: "#F472B6" },
  { id: 107, brand: "GAMA",     label: "PRODUCTO · G", name: "Séptima opción del catálogo",            price:  259, oldPrice:  349, rating: 4.3, reviews:  78,                  accent: "#84CC16" },
  { id: 108, brand: "PUNTO",    label: "PRODUCTO · H", name: "Octavo ítem en oferta",                  price:  189, oldPrice:  259, rating: 4.6, reviews: 144,                  accent: "#FF6B35" },
];

const FLASH_PRODUCTS = [
  { id: 201, brand: "ATELIER", label: "OFERTA · A", name: "Producto en oferta flash hoy",   price: 449, oldPrice: 899,  rating: 4.7, reviews: 248, accent: "#FF5C8A", stock: 4 },
  { id: 202, brand: "STUDIO",  label: "OFERTA · B", name: "Segunda oferta del día relámpago",price: 299, oldPrice: 599,  rating: 4.5, reviews: 312, accent: "#FFD23F", stock: 8 },
  { id: 203, brand: "MAKER",   label: "OFERTA · C", name: "Tercer artículo con descuento",  price: 799, oldPrice: 1599, rating: 4.8, reviews: 561, accent: "#7C3AED", stock: 3 },
  { id: 204, brand: "FORMA",   label: "OFERTA · D", name: "Cuarto producto rebajado",       price: 199, oldPrice: 399,  rating: 4.4, reviews:  92, accent: "#00BFFF", stock: 11 },
];

const CATEGORIES = [
  { name: "Ropa",         count: 1248, accent: "#FF5C8A", to: "#" },
  { name: "Calzado",      count:  672, accent: "#00D97A", to: "#" },
  { name: "Accesorios",   count:  483, accent: "#FFD23F", to: "#" },
  { name: "Electrónica",  count:  314, accent: "#7C3AED", to: "#" },
  { name: "Hogar",        count:  219, accent: "#00BFFF", to: "#" },
  { name: "Deporte",      count:  187, accent: "#FF6B35", to: "#" },
];

// ─────────────────────────────────────────────────────────────────────────────
// HeroSection

function HeroSection() {
  return (
    <section style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(120deg, var(--brand-50) 0%, #FFF9E6 55%, #FFE7EF 100%)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div className="blob" style={{ width: 520, height: 520, background: "var(--grad-from)", top: -160, right: -100 }} />
      <div className="blob" style={{ width: 380, height: 380, background: "var(--secondary)", bottom: -160, left: -60, opacity: 0.4 }} />
      <div className="blob" style={{ width: 280, height: 280, background: "var(--accent-2)", top: "30%", left: "55%", opacity: 0.18 }} />

      <div className="wrap hero-section" style={{ position: "relative", padding: "72px 24px 96px" }}>
        <div style={{
          display: "grid", gap: 56, alignItems: "center",
          gridTemplateColumns: "1.2fr 1fr",
        }} className="hero-grid">
          <div>
            <Badge tone="gradient" leadingIcon="bolt">Temporada 2026</Badge>
            <h1 className="hero-title" style={{
              marginTop: 20, fontSize: "clamp(48px, 8vw, 104px)",
              fontWeight: 700, lineHeight: 0.92, letterSpacing: "-0.04em",
            }}>
              Encuentra <span className="brand-grad-text">lo que sea</span>,<br />
              en un solo lugar.
            </h1>
            <p style={{
              marginTop: 24, maxWidth: 540, fontSize: 19, lineHeight: 1.55,
              color: "var(--text-muted)",
            }}>
              Miles de productos curados de todas las categorías. Envío rápido, devoluciones fáciles y la mejor relación calidad-precio del marketplace.
            </p>
            <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }} className="hero-ctas">
              <Button size="lg" trailingIcon="arrR">Explorar catálogo</Button>
              <Button size="lg" variant="secondary" leadingIcon="bolt">Ver ofertas del día</Button>
            </div>

            {/* mini stats */}
            <div style={{
              marginTop: 56, display: "flex", gap: 40, flexWrap: "wrap",
            }} className="hero-stats">
              {[
                ["50K+", "Productos"],
                ["2K+",  "Marcas"],
                ["98%",  "Compradores felices"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>{n}</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: "var(--text-soft)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* visual collage */}
          <div style={{
            position: "relative", aspectRatio: "4/5", minHeight: 460,
          }} className="hero-visual">
            <div style={{
              position: "absolute", top: "10%", left: 0, width: "55%", aspectRatio: "3/4",
              transform: "rotate(-5deg)",
              borderRadius: "var(--r-xl)", boxShadow: "var(--sh-lg)", overflow: "hidden",
            }}>
              <ProductImage label="HERO · A" accent="#00D97A" aspect="3/4" rounded="0" />
            </div>
            <div style={{
              position: "absolute", top: 0, right: 0, width: "55%", aspectRatio: "3/4",
              transform: "rotate(4deg) translateY(8%)",
              borderRadius: "var(--r-xl)", boxShadow: "var(--sh-lg)", overflow: "hidden",
            }}>
              <ProductImage label="HERO · B" accent="#FF5C8A" aspect="3/4" rounded="0" />
            </div>
            <div style={{
              position: "absolute", bottom: 0, left: "20%", width: "55%", aspectRatio: "1/1",
              transform: "rotate(-3deg)",
              borderRadius: "var(--r-xl)", boxShadow: "var(--sh-lg)", overflow: "hidden",
            }}>
              <ProductImage label="HERO · C" accent="#FFD23F" aspect="1/1" rounded="0" />
            </div>

            {/* floating badge */}
            <div className="sticker" style={{
              position: "absolute", top: "5%", right: "-8%",
              width: 96, height: 96, borderRadius: 999,
              background: "linear-gradient(135deg, var(--secondary), var(--accent))",
              color: "#1A1A14", boxShadow: "var(--sh-lg)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display)", fontWeight: 800, textAlign: "center",
              border: "4px solid var(--surface)",
            }}>
              <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>Hasta</span>
              <span style={{ fontSize: 28, lineHeight: 0.9, letterSpacing: "-0.04em" }}>-50%</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-visual { min-height: 300px !important; max-width: 380px; margin: 0 auto; }
        }
        @media (max-width: 720px) {
          .hero-section { padding-top: 32px !important; padding-bottom: 48px !important; }
          .hero-title { font-size: clamp(40px, 12vw, 56px) !important; }
          .hero-ctas { flex-direction: column !important; align-items: stretch !important; }
          .hero-ctas > button { width: 100% !important; }
          .hero-visual { min-height: 240px !important; max-width: 320px; }
          .hero-stats { gap: 24px !important; margin-top: 36px !important; }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TrustBar

function TrustBar() {
  const items = [
    { icon: "truck",   title: "Envío rápido",       sub: "24–48h en ciudades principales" },
    { icon: "shield",  title: "Pago seguro",        sub: "Encriptación bancaria SSL" },
    { icon: "refresh", title: "Devoluciones",       sub: "30 días sin preguntas" },
    { icon: "spark",   title: "Soporte 24/7",       sub: "Chat, email y teléfono" },
  ];
  return (
    <section style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
      <div className="wrap" style={{
        padding: "32px 24px", display: "grid", gap: 24,
        gridTemplateColumns: "repeat(4, 1fr)",
      }} className="trust-grid">
        {items.map((it) => (
          <div key={it.title} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{
              flexShrink: 0,
              width: 44, height: 44, borderRadius: "var(--r-md)",
              background: "var(--brand-50)", color: "var(--brand-700)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={it.icon} size={22} stroke={1.8} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>{it.title}</div>
              <div style={{ marginTop: 2, fontSize: 12, color: "var(--text-soft)", lineHeight: 1.4 }}>{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 880px) {.trust-grid { grid-template-columns: repeat(2,1fr) !important; }}
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CategoryGrid

function CategoryGrid() {
  return (
    <section style={{ padding: "96px 0 64px" }}>
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 36, flexWrap: "wrap" }}>
          <div>
            <span className="sec-eyebrow">Categorías</span>
            <h2 style={{
              marginTop: 14, fontSize: "clamp(32px, 4.5vw, 52px)",
              fontWeight: 700, lineHeight: 1, letterSpacing: "-0.03em",
            }}>
              Comprar por <span className="brand-grad-text">categoría</span>
            </h2>
          </div>
          <Button variant="ghost" trailingIcon="arrR">Ver todas</Button>
        </div>

        <div style={{
          display: "grid", gap: 16,
          gridTemplateColumns: "repeat(6, 1fr)",
        }} className="cat-grid">
          {CATEGORIES.map((c, i) => (
            <a key={c.name} href={c.to} className="cat-card" style={{
              position: "relative", aspectRatio: "3/4",
              borderRadius: "var(--r-xl)", overflow: "hidden", textDecoration: "none",
              border: "1px solid var(--border)",
              transition: "transform var(--t-base) var(--ease), box-shadow var(--t-base) var(--ease)",
              cursor: "pointer", display: "block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "var(--sh-lg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }}>
              <ProductImage label={`CAT ${String.fromCharCode(65 + i)}`} accent={c.accent} aspect="3/4" rounded="0" style={{ position: "absolute", inset: 0 }} />
              {/* dark gradient */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 70%)",
              }} />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: 20,
                color: "#fff",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 8 }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{c.name}</h3>
                    <div style={{ marginTop: 4, fontSize: 12, opacity: 0.85 }}>{c.count} productos</div>
                  </div>
                  <span style={{
                    width: 36, height: 36, borderRadius: 999,
                    background: "rgba(255,255,255,0.95)", color: "var(--text)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    transition: "all var(--t-base) var(--ease)",
                  }} className="cat-arrow">
                    <Icon name="arrR" size={16} stroke={2} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1080px) {.cat-grid { grid-template-columns: repeat(3,1fr) !important; }}
        @media (max-width: 560px)  {.cat-grid { grid-template-columns: repeat(2,1fr) !important; }}
        .cat-card:hover .cat-arrow { background: var(--brand-500) !important; color: #fff !important; }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FeaturedProducts (canonical)

function FeaturedProducts() {
  return (
    <section style={{ padding: "64px 0", background: "var(--surface-2)" }}>
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 36, flexWrap: "wrap" }}>
          <div>
            <span className="sec-eyebrow">Editores · selección</span>
            <h2 style={{
              marginTop: 14, fontSize: "clamp(32px, 4.5vw, 52px)",
              fontWeight: 700, lineHeight: 1, letterSpacing: "-0.03em",
            }}>
              Productos <span className="brand-grad-text">destacados</span>
            </h2>
            <p style={{ marginTop: 12, color: "var(--text-muted)", maxWidth: 520 }}>
              Curada cada semana por nuestro equipo: lo más interesante que está pasando ahora mismo en el catálogo.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Pill active>Todo</Pill>
            <Pill>Mujer</Pill>
            <Pill>Hombre</Pill>
            <Pill>Hogar</Pill>
          </div>
        </div>

        <div style={{
          display: "grid", gap: 20,
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        }}>
          {HOME_PRODUCTS.slice(0, 4).map((p) => <ProductCardCanonical key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PromoBanner

function PromoBanner() {
  return (
    <section style={{ padding: "64px 0" }}>
      <div className="wrap">
        <div style={{
          position: "relative", overflow: "hidden",
          borderRadius: "var(--r-2xl)",
          background: "linear-gradient(120deg, var(--brand-500), var(--brand-700) 50%, var(--accent-2))",
          color: "#fff",
          padding: "64px 56px",
          boxShadow: "var(--sh-lg)",
        }} className="promo">
          {/* decorative shapes */}
          <div style={{
            position: "absolute", top: -80, right: -60,
            width: 320, height: 320, borderRadius: 999,
            background: "rgba(255, 210, 63, 0.4)", filter: "blur(40px)",
          }} />
          <div style={{
            position: "absolute", bottom: -60, left: "30%",
            width: 240, height: 240, borderRadius: 999,
            background: "rgba(255, 92, 138, 0.4)", filter: "blur(40px)",
          }} />
          <div style={{
            position: "absolute", inset: 0, opacity: 0.08,
            backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }} />

          <div style={{
            position: "relative", display: "grid", gap: 32,
            gridTemplateColumns: "1.5fr 1fr", alignItems: "center",
          }} className="promo-grid">
            <div>
              <Badge tone="accent" leadingIcon="bolt">Solo este fin de semana</Badge>
              <h2 style={{
                marginTop: 20, fontSize: "clamp(36px, 6vw, 72px)",
                fontWeight: 700, lineHeight: 0.95, letterSpacing: "-0.035em",
                color: "#fff",
              }}>
                40% off en<br />tu segunda compra.
              </h2>
              <p style={{ marginTop: 16, fontSize: 17, opacity: 0.9, maxWidth: 460 }}>
                Agrega cualquier dos productos al carrito y aplicamos el descuento automáticamente al pagar.
              </p>
              <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Button size="lg" variant="secondary" trailingIcon="arrR">Comprar ahora</Button>
                <Button size="lg" variant="ghost" style={{ color: "#fff" }}>Términos</Button>
              </div>
            </div>
            <div style={{ position: "relative" }} className="promo-visual">
              <div style={{
                position: "absolute", top: "-20%", right: 0, width: "70%", aspectRatio: "1/1",
                transform: "rotate(-5deg)",
                borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--sh-lg)",
              }}>
                <ProductImage label="PROMO · A" accent="#FFD23F" aspect="1/1" rounded="0" />
              </div>
              <div style={{
                position: "absolute", bottom: "-20%", left: 0, width: "60%", aspectRatio: "1/1",
                transform: "rotate(7deg)",
                borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--sh-lg)",
              }}>
                <ProductImage label="PROMO · B" accent="#FF5C8A" aspect="1/1" rounded="0" />
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .promo-grid { grid-template-columns: 1fr !important; }
            .promo-visual { display: none !important; }
            .promo { padding: 40px 28px !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NewArrivals — horizontal carousel-ish

function NewArrivals() {
  const scrollRef = useRefH(null);
  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section style={{ padding: "64px 0" }}>
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          <div>
            <span className="sec-eyebrow">Esta semana</span>
            <h2 style={{
              marginTop: 14, fontSize: "clamp(32px, 4.5vw, 52px)",
              fontWeight: 700, lineHeight: 1, letterSpacing: "-0.03em",
            }}>
              Recién <span className="brand-grad-text">llegados</span>
            </h2>
          </div>
          <div className="newarr-arrows" style={{ display: "flex", gap: 8 }}>
            <IconButton variant="secondary" icon="arrL" label="Anterior" onClick={() => scroll(-1)} />
            <IconButton variant="secondary" icon="arrR" label="Siguiente" onClick={() => scroll(1)} />
          </div>
        </div>
      </div>

      {/* edge-to-edge horizontal scroller */}
      <div ref={scrollRef} style={{
        overflowX: "auto", scrollbarWidth: "none",
        scrollSnapType: "x mandatory",
        paddingLeft: "max(24px, calc((100vw - 1280px)/2 + 24px))",
        paddingRight: "max(24px, calc((100vw - 1280px)/2 + 24px))",
        paddingBottom: 16,
      }} className="newarr-scroll">
        <style>{`
          .newarr-scroll::-webkit-scrollbar { display: none; }
          .newarr-row { display: flex; gap: 20px; }
          .newarr-row > * { flex: 0 0 240px; scroll-snap-align: start; }
          @media (min-width: 640px) { .newarr-row > * { flex-basis: 260px; } }
          @media (max-width: 720px) {
            .newarr-arrows { display: none !important; }
            .newarr-row > * { flex-basis: 200px; }
          }
        `}</style>
        <div className="newarr-row">
          {HOME_PRODUCTS.map((p) => <ProductCardMinimal key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FlashSale — with countdown

function useCountdown(hours = 6, minutes = 42, seconds = 18) {
  const target = useRefH(Date.now() + (hours * 3600 + minutes * 60 + seconds) * 1000);
  const [now, setNow] = useStateH(Date.now());
  useEffectH(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  let diff = Math.max(0, target.current - now);
  const h = Math.floor(diff / 3_600_000); diff %= 3_600_000;
  const m = Math.floor(diff / 60_000);    diff %= 60_000;
  const s = Math.floor(diff / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, "0"));
}

function CountdownUnit({ value, label }) {
  return (
    <div className="cd-unit" style={{
      minWidth: 64, padding: "12px 14px",
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.25)",
      borderRadius: "var(--r-md)",
      textAlign: "center", color: "#fff",
    }}>
      <div className="cd-num" style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32,
        letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums",
      }}>{value}</div>
      <div style={{ marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.85 }}>{label}</div>
    </div>
  );
}

function FlashSale() {
  const [h, m, s] = useCountdown(6, 42, 18);
  return (
    <section style={{ padding: "64px 0" }}>
      <div className="wrap">
        <div style={{
          position: "relative", overflow: "hidden",
          borderRadius: "var(--r-2xl)",
          background: "linear-gradient(120deg, #FF5C8A 0%, #ED3A6E 50%, #7C3AED 100%)",
          padding: "48px 40px",
          color: "#fff",
        }} className="flash">
          <div style={{
            position: "absolute", top: -120, left: -80,
            width: 400, height: 400, borderRadius: 999,
            background: "rgba(255,210,63,0.35)", filter: "blur(40px)",
          }} />

          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
            <div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 12px", borderRadius: 999,
                background: "rgba(0,0,0,0.18)", color: "#FFD23F",
                fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
              }}>
                <Icon name="bolt" size={13} stroke={2.4} /> Oferta relámpago
              </span>
              <h2 style={{
                marginTop: 16, fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 700, lineHeight: 0.95, letterSpacing: "-0.035em",
                color: "#fff",
              }}>
                Termina en…
              </h2>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "nowrap" }}>
              <CountdownUnit value={h} label="Horas" />
              <span className="cd-sep" style={{ fontSize: 32, fontFamily: "var(--font-display)", fontWeight: 700, opacity: 0.6 }}>:</span>
              <CountdownUnit value={m} label="Min" />
              <span className="cd-sep" style={{ fontSize: 32, fontFamily: "var(--font-display)", fontWeight: 700, opacity: 0.6 }}>:</span>
              <CountdownUnit value={s} label="Seg" />
            </div>
          </div>

          <div style={{
            position: "relative",
            display: "grid", gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}>
            {FLASH_PRODUCTS.map((p) => <ProductCardDiscount key={p.id} p={p} />)}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width: 720px) {
          .flash { padding: 28px 20px !important; }
          .cd-unit { min-width: 48px !important; padding: 8px 10px !important; }
          .cd-num { font-size: 24px !important; }
          .cd-sep { font-size: 22px !important; }
        }
        @media(max-width: 380px) {
          .cd-unit { min-width: 42px !important; padding: 6px 8px !important; }
          .cd-num { font-size: 20px !important; }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BestSellers

function BestSellers() {
  return (
    <section style={{ padding: "64px 0" }}>
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 36, flexWrap: "wrap" }}>
          <div>
            <span className="sec-eyebrow">Top de la comunidad</span>
            <h2 style={{
              marginTop: 14, fontSize: "clamp(32px, 4.5vw, 52px)",
              fontWeight: 700, lineHeight: 1, letterSpacing: "-0.03em",
            }}>
              Más <span className="brand-grad-text">vendidos</span>
            </h2>
          </div>
          <Button variant="ghost" trailingIcon="arrR">Ver ranking completo</Button>
        </div>

        <div style={{
          display: "grid", gap: 20,
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        }}>
          {HOME_PRODUCTS.slice(2, 6).map((p) => <ProductCardQuickActions key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Newsletter

function Newsletter() {
  const [email, setEmail] = useStateH("");
  const [done, setDone] = useStateH(false);

  return (
    <section style={{ padding: "96px 0", position: "relative", overflow: "hidden" }}>
      <div className="blob" style={{ width: 500, height: 500, background: "var(--grad-from)", top: "20%", left: -120 }} />
      <div className="blob" style={{ width: 420, height: 420, background: "var(--secondary)", top: "10%", right: -100, opacity: 0.35 }} />

      <div className="wrap" style={{ position: "relative" }}>
        <div style={{
          maxWidth: 720, margin: "0 auto", textAlign: "center",
          background: "var(--surface)", borderRadius: "var(--r-2xl)",
          padding: "64px 48px", border: "1px solid var(--border)",
          boxShadow: "var(--sh-md)",
        }} className="news-card">
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            width: 56, height: 56, borderRadius: 999,
            background: "var(--brand-grad)",
            justifyContent: "center", color: "#fff",
            boxShadow: "var(--sh-brand)",
          }}>
            <Icon name="spark" size={26} stroke={2} />
          </span>
          <h2 style={{
            marginTop: 24, fontSize: "clamp(28px, 4.5vw, 44px)",
            fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em",
          }}>
            Antes que nadie.
          </h2>
          <p style={{ marginTop: 12, fontSize: 17, color: "var(--text-muted)", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            Suscríbete y recibe primero las ofertas, lanzamientos y selecciones del equipo editorial.
          </p>

          {done ? (
            <div style={{ marginTop: 28, padding: "16px 24px", display: "inline-flex", alignItems: "center", gap: 10,
                          background: "var(--brand-50)", color: "var(--brand-700)",
                          borderRadius: "var(--r-pill)", fontFamily: "var(--font-display)", fontWeight: 600 }}>
              <Icon name="check" size={18} stroke={2.4} /> ¡Listo! Revisa tu correo para confirmar.
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
              style={{ marginTop: 28, display: "flex", gap: 8, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}
              className="news-form"
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leadingIcon="user"
                  required
                />
              </div>
              <Button type="submit" size="lg" trailingIcon="arrR">Suscribirme</Button>
            </form>
          )}
          <p style={{ marginTop: 16, fontSize: 12, color: "var(--text-soft)" }}>
            Sin spam. Cancela cuando quieras.
          </p>
        </div>
      </div>
      <style>{`
        @media(max-width: 560px){
          .news-card { padding: 40px 24px !important; }
          .news-form { flex-direction: column !important; }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

Object.assign(window, {
  HeroSection, TrustBar, CategoryGrid, FeaturedProducts,
  PromoBanner, NewArrivals, FlashSale, BestSellers, Newsletter,
  HOME_PRODUCTS, FLASH_PRODUCTS, CATEGORIES,
});
