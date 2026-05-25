import UsersClient from '@/components/admin/UsersClient';

export const metadata = {
  title: 'Usuarios · admin'
};

// Página thin: el listado real vive en el cliente (rules de /users requieren
// isStaff(), y el SDK server no está autenticado).
export default function AdminUsersPage() {
  return <UsersClient />;
}
