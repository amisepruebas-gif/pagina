import PageViewEditor from '@/components/admin/PageViewEditor';

export const metadata = { title: 'Editar vista · admin' };

export default async function AdminViewEditorPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PageViewEditor id={id} />;
}
