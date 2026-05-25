'use client';
import { useState, type ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

/**
 * AdminShell — marco del admin: sidebar + topbar + main.
 * El sidebar colapsa en desktop y se vuelve cajón overlay en móvil.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-bg">
      <div className="hidden lg:block">
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-[100] bg-black/45 animate-[mm-fade_200ms_cubic-bezier(.22,1,.36,1)]"
          />
          <AdminSidebar mobile onClose={() => setMobileOpen(false)} />
        </>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <AdminTopbar onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
