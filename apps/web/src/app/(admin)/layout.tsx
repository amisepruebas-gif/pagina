// Layout raíz del route group (admin). Es server component; la protección
// vive en el layout anidado /admin (debajo) que envuelve children con <AdminGate>.
export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
