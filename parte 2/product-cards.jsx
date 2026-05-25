// product-cards.jsx — 5 variants of ProductCard
// 1. Canónico        — image top, info below, heart, badge, rating
// 2. Full-bleed      — image fills card, info overlaid bottom on gradient
// 3. Descuento       — huge discount stamp + slashed prices + urgency
// 4. Quick actions   — hover reveals add-to-cart + quick view
// 5. Minimal         — sin chrome, solo imagen + nombre + precio

const { useState: useStateP } = React;

function priceFmt(n) {
  return "$" + n.toLocaleString("es-MX", { maximumFractionDigits: 0 });
}

function FavButton({ active, onClick, size = 36 }) {
  return (
    <button
      className="fav-btn"
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
      aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
      style={{
        width: size, height: size, borderRadius: 999, border: "0",
        background: "rgba(255,255,255,0.92)",
        boxShadow: "var(--sh-sm)",
        color: active ? "var(--secondary-600)" : "var(--text)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", backdropFilter: "blur(8px)",
        transition: "transform var(--t-base) var(--ease), color var(--t-base) var(--ease)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.12)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      <Icon name={active ? "heartF" : "heart"} size={size * 0.5} stroke={2} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1) Canónico

function ProductCardCanonical({ p }) {
  const [fav, setFav] = useStateP(p.fav ?? false);
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  return (
    <article className="lift" style={{
      background: "var(--surface)", borderRadius: "var(--r-xl)",
      border: "1px solid var(--border)", padding: 14, position: "relative",
      transition: "transform var(--t-base) var(--ease), box-shadow var(--t-base) var(--ease), border-color var(--t-base) var(--ease)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = "var(--sh-lg)";
      e.currentTarget.style.borderColor = "var(--brand-200)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "var(--border)";
    }}>
      <div style={{ position: "relative" }}>
        <ProductImage label={p.label} accent={p.accent} aspect="1/1" rounded="var(--r-lg)" />
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {discount > 0 && <Badge tone="secondary" size="sm" leadingIcon="bolt">-{discount}%</Badge>}
          {p.tag && <Badge tone="accent" size="sm">{p.tag}</Badge>}
        </div>
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <FavButton active={fav} onClick={() => setFav(!fav)} />
        </div>
      </div>

      <div style={{ padding: "14px 4px 4px", display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 11, color: "var(--text-soft)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {p.brand}
        </span>
        <h3 style={{
          fontSize: 16, fontWeight: 600, lineHeight: 1.3,
          fontFamily: "var(--font-display)",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          minHeight: 42,
        }}>
          {p.name}
        </h3>
        <Stars value={p.rating} reviews={p.reviews} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
            {priceFmt(p.price)}
          </span>
          {p.oldPrice && (
            <span style={{ fontSize: 14, color: "var(--text-soft)", textDecoration: "line-through" }}>
              {priceFmt(p.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2) Full-bleed

function ProductCardFullBleed({ p }) {
  const [fav, setFav] = useStateP(p.fav ?? false);
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  return (
    <article className="lift" style={{
      position: "relative", borderRadius: "var(--r-xl)", overflow: "hidden",
      aspectRatio: "3/4", cursor: "pointer",
      boxShadow: "var(--sh-sm)",
      transition: "transform var(--t-base) var(--ease), box-shadow var(--t-base) var(--ease)",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--sh-lg)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--sh-sm)"; }}>
      <ProductImage label={p.label} accent={p.accent} aspect="3/4" rounded="0" style={{ position: "absolute", inset: 0 }} />

      {/* gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.18) 45%, transparent 60%)",
      }} />

      {/* top row */}
      <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
          {discount > 0 && <Badge tone="gradient" size="sm" leadingIcon="bolt">-{discount}%</Badge>}
          {p.tag && <Badge tone="accent" size="sm">{p.tag}</Badge>}
        </div>
        <FavButton active={fav} onClick={() => setFav(!fav)} />
      </div>

      {/* bottom info */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        padding: 20, color: "#fff",
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        <span style={{ fontSize: 11, opacity: 0.85, fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {p.brand}
        </span>
        <h3 style={{
          fontSize: 20, fontWeight: 700, lineHeight: 1.2,
          fontFamily: "var(--font-display)", color: "#fff",
        }}>
          {p.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)" }}>{priceFmt(p.price)}</span>
            {p.oldPrice && (
              <span style={{ fontSize: 13, opacity: 0.7, textDecoration: "line-through" }}>{priceFmt(p.oldPrice)}</span>
            )}
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, opacity: 0.9 }}>
            <Icon name="starF" size={13} stroke={1.4} style={{ color: "var(--accent)" }} /> {p.rating?.toFixed(1)}
          </span>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3) Descuento prominente

function ProductCardDiscount({ p }) {
  const [fav, setFav] = useStateP(p.fav ?? false);
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 30;
  const stock = p.stock ?? 7;

  return (
    <article className="lift" style={{
      background: "var(--surface)", borderRadius: "var(--r-xl)",
      border: "2px solid var(--secondary)", padding: 14, position: "relative",
      boxShadow: "var(--sh-secondary)",
      transition: "transform var(--t-base) var(--ease), box-shadow var(--t-base) var(--ease)",
    }}>
      {/* corner ribbon */}
      <div className="sticker" style={{
        position: "absolute", top: -18, right: -10, zIndex: 2,
        width: 78, height: 78, borderRadius: 999,
        background: "linear-gradient(135deg, var(--secondary), #FF8FB1)",
        color: "#fff",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontWeight: 800,
        boxShadow: "var(--sh-secondary)",
        border: "3px solid var(--surface)",
      }}>
        <span style={{ fontSize: 24, lineHeight: 1, letterSpacing: "-0.04em" }}>-{discount}%</span>
        <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>OFF</span>
      </div>

      <div style={{ position: "relative" }}>
        <ProductImage label={p.label} accent={p.accent} aspect="1/1" rounded="var(--r-lg)" />
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <Badge tone="error" size="sm" leadingIcon="bolt">Última oportunidad</Badge>
        </div>
        <div style={{ position: "absolute", bottom: 10, left: 10 }}>
          <FavButton active={fav} onClick={() => setFav(!fav)} size={32} />
        </div>
      </div>

      <div style={{ padding: "14px 4px 4px", display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 11, color: "var(--text-soft)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {p.brand}
        </span>
        <h3 style={{
          fontSize: 16, fontWeight: 600, lineHeight: 1.3, fontFamily: "var(--font-display)",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          minHeight: 42,
        }}>
          {p.name}
        </h3>
        <Stars value={p.rating} reviews={p.reviews} />

        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 4 }}>
          <span style={{
            fontSize: 28, fontWeight: 800, color: "var(--secondary-600)",
            fontFamily: "var(--font-display)", letterSpacing: "-0.03em", lineHeight: 1,
          }}>
            {priceFmt(p.price)}
          </span>
          <span style={{ display: "flex", flexDirection: "column", marginBottom: 2 }}>
            <span style={{ fontSize: 13, color: "var(--text-soft)", textDecoration: "line-through" }}>
              {priceFmt(p.oldPrice)}
            </span>
            <span style={{ fontSize: 11, color: "var(--secondary-600)", fontWeight: 600 }}>
              Ahorras {priceFmt(p.oldPrice - p.price)}
            </span>
          </span>
        </div>

        {/* stock urgency */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
            <span style={{ color: "var(--secondary-600)", fontWeight: 600 }}>¡Solo quedan {stock}!</span>
            <span style={{ color: "var(--text-soft)" }}>Vendidos {100 - stock * 4}</span>
          </div>
          <div style={{ height: 6, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{
              width: `${100 - stock * 4}%`, height: "100%",
              background: "linear-gradient(90deg, var(--secondary), var(--accent))",
              borderRadius: 999,
            }} />
          </div>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4) Quick actions on hover

function ProductCardQuickActions({ p }) {
  const [fav, setFav] = useStateP(p.fav ?? false);
  const [hover, setHover] = useStateP(false);
  const [added, setAdded] = useStateP(false);
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  return (
    <article className="lift"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--surface)", borderRadius: "var(--r-xl)",
        border: "1px solid var(--border)", padding: 14, position: "relative",
        transition: "transform var(--t-base) var(--ease), box-shadow var(--t-base) var(--ease), border-color var(--t-base) var(--ease)",
        boxShadow: hover ? "var(--sh-lg)" : "none",
        borderColor: hover ? "var(--brand-300)" : "var(--border)",
      }}>
      <div style={{ position: "relative", overflow: "hidden", borderRadius: "var(--r-lg)" }}>
        <ProductImage label={p.label} accent={p.accent} aspect="1/1" rounded="var(--r-lg)" />
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {discount > 0 && <Badge tone="secondary" size="sm" leadingIcon="bolt">-{discount}%</Badge>}
        </div>
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <FavButton active={fav} onClick={() => setFav(!fav)} />
        </div>

        {/* hover overlay (desktop only — hidden on touch) */}
        <div className="qa-hover-only" style={{
          position: "absolute", left: 12, right: 12, bottom: 12,
          display: "flex", gap: 6, flexDirection: "column",
          transform: hover ? "translateY(0)" : "translateY(calc(100% + 12px))",
          opacity: hover ? 1 : 0,
          transition: "transform var(--t-base) var(--ease), opacity var(--t-base) var(--ease)",
        }}>
          {p.sizes && (
            <div style={{
              display: "flex", gap: 6, padding: 6,
              background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)",
              borderRadius: "var(--r-pill)", boxShadow: "var(--sh-sm)",
              justifyContent: "center",
            }}>
              {p.sizes.map((s) => (
                <button key={s} style={{
                  width: 32, height: 32, borderRadius: 999, border: 0, cursor: "pointer",
                  background: "transparent", color: "var(--text)",
                  fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12,
                  transition: "all var(--t-fast) var(--ease)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--brand-500)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text)";
                }}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 6 }}>
            <Button
              size="md"
              leadingIcon={added ? "check" : "cart"}
              onClick={(e) => { e.stopPropagation(); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
              style={{ flex: 1, height: 44 }}
            >
              {added ? "¡Agregado!" : "Agregar al carrito"}
            </Button>
            <IconButton variant="secondary" icon="eye" label="Vista rápida" />
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 4px 4px", display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 11, color: "var(--text-soft)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {p.brand}
        </span>
        <h3 style={{
          fontSize: 16, fontWeight: 600, lineHeight: 1.3, fontFamily: "var(--font-display)",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          minHeight: 42,
        }}>{p.name}</h3>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
              {priceFmt(p.price)}
            </span>
            {p.oldPrice && (
              <span style={{ fontSize: 13, color: "var(--text-soft)", textDecoration: "line-through" }}>
                {priceFmt(p.oldPrice)}
              </span>
            )}
          </div>
          <Stars value={p.rating} showValue={false} size={12} />
        </div>

        {/* touch-only CTA (mobile / coarse pointer) */}
        <div className="qa-touch-only" style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <Button
            size="md"
            leadingIcon={added ? "check" : "cart"}
            onClick={(e) => { e.stopPropagation(); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
            style={{ flex: 1 }}
          >
            {added ? "¡Agregado!" : "Agregar"}
          </Button>
          <IconButton variant="secondary" icon="eye" label="Vista rápida" />
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5) Minimal — sin chrome

function ProductCardMinimal({ p }) {
  const [fav, setFav] = useStateP(p.fav ?? false);
  return (
    <article style={{ position: "relative", cursor: "pointer" }}
      onMouseEnter={(e) => {
        const img = e.currentTarget.querySelector(".min-img");
        if (img) img.style.transform = "scale(1.04)";
      }}
      onMouseLeave={(e) => {
        const img = e.currentTarget.querySelector(".min-img");
        if (img) img.style.transform = "scale(1)";
      }}>
      <div style={{ position: "relative", overflow: "hidden", borderRadius: "var(--r-lg)" }}>
        <div className="min-img" style={{ transition: "transform var(--t-slow) var(--ease)" }}>
          <ProductImage label={p.label} accent={p.accent} aspect="1/1" rounded="var(--r-lg)" />
        </div>
        <button onClick={(e) => { e.stopPropagation(); setFav(!fav); }} aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="fav-btn"
          style={{
          position: "absolute", top: 6, right: 6,
          width: 36, height: 36, border: 0, background: "rgba(255,255,255,0.85)",
          borderRadius: 999, backdropFilter: "blur(6px)",
          color: fav ? "var(--secondary-600)" : "var(--text)",
          cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          transition: "transform var(--t-fast) var(--ease)",
        }}>
          <Icon name={fav ? "heartF" : "heart"} size={20} stroke={2} />
        </button>
      </div>
      <div style={{ padding: "10px 2px 0", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
        <h3 style={{ fontSize: 14, fontWeight: 500, fontFamily: "var(--font-body)", lineHeight: 1.35,
          display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{p.name}</h3>
        <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)", whiteSpace: "nowrap" }}>
          {priceFmt(p.price)}
        </span>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton variant of the canonical card

function ProductCardSkeleton() {
  return (
    <article style={{
      background: "var(--surface)", borderRadius: "var(--r-xl)",
      border: "1px solid var(--border)", padding: 14,
    }}>
      <Skeleton h={null} w="100%" r={18} style={{ aspectRatio: "1/1" }} />
      <div style={{ padding: "14px 4px 4px", display: "flex", flexDirection: "column", gap: 10 }}>
        <Skeleton w="40%" h={11} r={4} />
        <Skeleton w="90%" h={14} r={4} />
        <Skeleton w="70%" h={14} r={4} />
        <Skeleton w="40%" h={20} r={6} style={{ marginTop: 4 }} />
      </div>
    </article>
  );
}

Object.assign(window, {
  ProductCardCanonical, ProductCardFullBleed,
  ProductCardDiscount, ProductCardQuickActions,
  ProductCardMinimal, ProductCardSkeleton, FavButton, priceFmt,
});
