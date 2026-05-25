"use client";
import Link from "next/link";
import { Button, IconButton, Input } from "@/components";

export interface AdminTopbarProps {
  onOpenMobileMenu: () => void;
}

/**
 * AdminTopbar — barra superior con búsqueda global, "Ver tienda" y accesos.
 * En móvil aparece el botón hamburguesa que abre el cajón del sidebar.
 */
export function AdminTopbar({ onOpenMobileMenu }: AdminTopbarProps) {
  return (
    <header className="h-14 bg-surface border-b border-border flex items-center gap-3 px-4
                       sticky top-0 z-20">
      <IconButton
        variant="ghost" icon="menu" label="Menú" size="sm"
        className="lg:!hidden"
        onClick={onOpenMobileMenu}
      />
      <div className="flex-1 max-w-md">
        <Input leadingIcon="search" placeholder="Buscar pedidos, productos, clientes…" className="!h-9" />
      </div>
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="sm" leadingIcon="eye">
            <span className="hidden sm:inline">Ver tienda</span>
          </Button>
        </Link>
        <IconButton variant="ghost" icon="info" label="Notificaciones" size="sm" />
        <IconButton variant="ghost" icon="user" label="Mi cuenta" size="sm" />
      </div>
    </header>
  );
}
