import ComplaintDetailClient from '@/components/admin/ComplaintDetailClient';

export const metadata = { title: 'Queja · admin' };

export default async function AdminComplaintDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ComplaintDetailClient id={id} />;
}
