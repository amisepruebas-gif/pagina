import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import ComplaintTypesManager from '@/components/admin/ComplaintTypesManager';

export const metadata = { title: 'Tipos de queja · admin' };

export default function AdminComplaintTypesPage() {
  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Tipos de queja' }]}
        title="Tipos de queja"
        description="Catálogo que aparece en el dropdown del formulario de quejas del cliente."
      />
      <div className="p-6">
        <ComplaintTypesManager />
      </div>
    </>
  );
}
