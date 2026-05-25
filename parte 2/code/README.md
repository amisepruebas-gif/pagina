# Sistema de Diseño + Home — `pagina/`

Componentes y página de inicio listos para Next.js 16 + React 19 + TypeScript + Tailwind 3.

## Estructura

```
code/
├── tailwind.config.ts        # theme.extend con todos los tokens
├── styles/
│   └── globals.css           # variables CSS, fuentes, reset
├── lib/
│   ├── cn.ts                 # helper className (clsx + tailwind-merge)
│   ├── types.ts              # tipos compartidos (Product, etc)
│   └── sample-products.ts    # datos placeholder de la home
├── app/
│   └── page.tsx              # HomePage — composición completa
└── components/
    ├── index.ts                  ← barrel del sistema
    ├── Icon.tsx
    ├── Button.tsx
    ├── IconButton.tsx
    ├── Input.tsx
    ├── Select.tsx
    ├── Textarea.tsx
    ├── FormField.tsx
    ├── Badge.tsx
    ├── Tag.tsx
    ├── Pill.tsx
    ├── Stars.tsx
    ├── Skeleton.tsx
    ├── ProductImage.tsx
    ├── ProductCard.tsx           ← 5 variantes en un componente
    ├── Topbar.tsx
    ├── Logo.tsx
    ├── Header.tsx
    ├── CategoryNav.tsx
    ├── Footer.tsx
    └── home/
        ├── index.ts              ← barrel de la home
        ├── HeroSection.tsx
        ├── TrustBar.tsx
        ├── CategoryGrid.tsx
        ├── FeaturedProducts.tsx
        ├── PromoBanner.tsx
        ├── NewArrivals.tsx
        ├── FlashSale.tsx
        ├── BestSellers.tsx
        └── Newsletter.tsx
```

## Instalación

```bash
pnpm add clsx tailwind-merge
```

Importa `globals.css` desde `app/layout.tsx` y carga las Google Fonts:

```tsx
import "@/styles/globals.css";
import { Space_Grotesk, Sora, JetBrains_Mono } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const body    = Sora({ subsets: ["latin"], variable: "--font-body" });
const mono    = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-bg text-text font-body antialiased">{children}</body>
    </html>
  );
}
```

## La home

`app/page.tsx` arma la secuencia:

1. `Topbar` · `Header` · `CategoryNav`  (sistema)
2. `HeroSection`        — bloque de impacto con collage + sticker animado
3. `TrustBar`            — 4 beneficios con icono
4. `CategoryGrid`        — 6 cards de categoría
5. `FeaturedProducts`    — grid con filtros (variante `canonical`)
6. `PromoBanner`         — banner ancho con gradiente de marca
7. `NewArrivals`         — carrusel horizontal scroll-snap (variante `minimal`)
8. `FlashSale`           — countdown + 4 cards (variante `discount`)
9. `BestSellers`         — grid (variante `quick-actions`)
10. `Newsletter`         — captura de email con success state
11. `Footer`             — (sistema)

## Dark mode

Cambia el tema añadiendo `data-theme="dark"` en `<html>`. Los tokens neutros y sombras se reasignan automáticamente.

## ProductCard

```tsx
<ProductCard variant="canonical"     product={p} />
<ProductCard variant="full-bleed"    product={p} />
<ProductCard variant="discount"      product={p} />
<ProductCard variant="quick-actions" product={p} onAddToCart={…} />
<ProductCard variant="minimal"       product={p} />
```

Tipos en `@/lib/types`.
