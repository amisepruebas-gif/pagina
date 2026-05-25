"use client";
import { useState } from "react";
import { Input } from "./Input";
import { IconButton } from "./IconButton";
import { Logo } from "./Logo";

export interface HeaderProps {
  /** Contador del carrito (badge) */
  cartCount?: number;
  /** Callback al enviar la búsqueda */
  onSearch?: (q: string) => void;
}

/**
 * Header — barra principal con logo + buscador + accesos.
 *
 * @example <Header cartCount={3} onSearch={(q) => router.push(`/buscar?q=${q}`)} />
 */
export function Header({ cartCount = 0, onSearch }: HeaderProps) {
  const [q, setQ] = useState("");
  return (
    <header className="bg-surface border-b border-border relative z-10">
      <div className="max-w-screen-xl mx-auto px-6 h-[72px] flex items-center gap-6">
        <Logo />
        <form
          className="flex-1 max-w-xl"
          onSubmit={(e) => { e.preventDefault(); onSearch?.(q); }}
        >
          <Input
            leadingIcon="search"
            placeholder="Buscar productos, marcas y categorías…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
        <nav className="inline-flex items-center gap-2">
          <IconButton variant="ghost" icon="user" label="Mi cuenta" />
          <IconButton variant="ghost" icon="heart" label="Favoritos" />
          <div className="relative">
            <IconButton variant="ghost" icon="cart" label="Carrito" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1.5 rounded-full
                               bg-secondary text-white text-[10px] font-bold
                               inline-flex items-center justify-center border-2 border-surface">
                {cartCount}
              </span>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
