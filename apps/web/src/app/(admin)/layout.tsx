// Layout para rutas /admin/*.
// Guard real (verificación de custom claim role=admin) se agrega en Fase E.
// Por ahora solo pasa children — la página /admin/page.tsx muestra un placeholder.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
