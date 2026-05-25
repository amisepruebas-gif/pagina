import ChatThreadClient from '@/components/admin/ChatThreadClient';

export const metadata = {
  title: 'Chat · admin'
};

export default async function AdminChatThreadPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChatThreadClient id={id} />;
}
