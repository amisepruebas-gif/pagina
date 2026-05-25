import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { getAuthPanelConfig } from '@/lib/auth-panel';

export const metadata = { title: 'Recuperar contraseña · pagina' };

export const revalidate = 300;

export default async function ForgotPasswordPage() {
  const panel = await getAuthPanelConfig();
  return <ForgotPasswordForm panel={panel} />;
}
