'use client';
import Link from 'next/link';
import { Button, IconButton } from '@/components/ui';

export interface AdminTopbarProps {
  onOpenMobileMenu: () => void;
}

/** AdminTopbar — barra superior del admin con accesos. */
export function AdminTopbar({ onOpenMobileMenu }: AdminTopbarProps) {
  return (
    <header className="h-14 bg-surface border-b border-border flex items-center gap-3 px-4 sticky top-0 z-20">
      <IconButton
        variant="ghost"
        icon="menu"
        label="Menú"
        size="sm"
        className="lg:!hidden"
        onClick={onOpenMobileMenu}
      />
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="sm" leadingIcon="eye">
            <span className="hidden sm:inline">Ver tienda</span>
          </Button>
        </Link>
        <Link href="/mi-cuenta">
          <IconButton variant="ghost" icon="user" label="Mi cuenta" size="sm" />
        </Link>
      </div>
    </header>
  );
}
