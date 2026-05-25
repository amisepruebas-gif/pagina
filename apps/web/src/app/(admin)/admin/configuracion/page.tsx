import { getConfig } from '@/lib/config';
import ConfigForm from '@/components/admin/ConfigForm';

export const revalidate = 0;
export const metadata = {
  title: 'Configuración · admin'
};

export default async function AdminConfigPage() {
  const config = await getConfig();
  return <ConfigForm initial={config} />;
}
