# Sistema de Diseño — `pagina/`

Componentes y tokens listos para Next.js 16 + React 19 + TypeScript + Tailwind 3.

## Estructura

```
code/
├── tailwind.config.ts        # theme.extend con todos los tokens
├── styles/
│   └── globals.css           # variables CSS, fuentes, reset
├── lib/
│   ├── cn.ts                 # helper className (clsx + tailwind-merge)
│   └── types.ts              # tipos compartidos (Product, etc)
└── components/
    ├── Icon.tsx
    ├── Button.tsx
    ├── IconButton.tsx
    ├── Input.tsx
    ├── Select.tsx
    ├── Textarea.tsx
    ├── Badge.tsx
    ├── Tag.tsx
    ├── Pill.tsx
    ├── Stars.tsx
    ├── Skeleton.tsx
    ├── ProductCard.tsx       # 5 variantes en un solo componente
    ├── Topbar.tsx
    ├── Header.tsx
    ├── CategoryNav.tsx
    └── Footer.tsx
```

## Instalación

```bash
pnpm add clsx tailwind-merge
```

Importa `globals.css` desde `app/layout.tsx`:

```tsx
import "@/styles/globals.css";
```

Carga las Google Fonts en `app/layout.tsx`:

```tsx
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

## Dark mode

Cambia el tema añadiendo `data-theme="dark"` en `<html>`. Los tokens neutros y sombras se reasignan automáticamente.

## Modo de uso de `ProductCard`

```tsx
<ProductCard variant="canonical"     product={p} />
<ProductCard variant="full-bleed"    product={p} />
<ProductCard variant="discount"      product={p} />
<ProductCard variant="quick-actions" product={p} />
<ProductCard variant="minimal"       product={p} />
```
