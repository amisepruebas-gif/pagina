import { getSiteContents } from '@/lib/site-content';
import SiteContentTable from '@/components/admin/SiteContentTable';

export const revalidate = 0;

export const metadata = { title: 'Contenido · admin' };

export default async function AdminSiteContentPage() {
  const items = await getSiteContents({ includeInactive: true });
  return <SiteContentTable items={items} />;
}
