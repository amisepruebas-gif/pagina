import { AuthPanelEditorClient } from '@/components/admin/AuthPanelEditorClient';
import { getAuthPanelConfig } from '@/lib/auth-panel';

export const revalidate = 0;

export const metadata = { title: 'Editor de inicio de sesión · admin' };

/** Editor del panel lateral de /login, /register y /forgot-password. */
export default async function AuthPanelEditorPage() {
  const config = await getAuthPanelConfig();
  return <AuthPanelEditorClient initialConfig={config} />;
}
