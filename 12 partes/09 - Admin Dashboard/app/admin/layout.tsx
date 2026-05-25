import { type ReactNode } from "react";
import { AdminLayout } from "@/components/admin";

export const metadata = {
  title: { template: "%s — Admin · página/", default: "Admin · página/" },
};

/**
 * `/admin/*` layout. Aplica el shell con sidebar + topbar a TODAS las páginas del admin.
 *
 * Para proteger por rol, envuelve `<AdminLayout/>` con tu auth helper:
 *
 * ```tsx
 * const user = await getCurrentUser();
 * if (!user?.isAdmin) return <AdminGate />;
 * ```
 */
export default function Layout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
