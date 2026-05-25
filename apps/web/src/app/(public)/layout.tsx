import Topbar from '@/components/Topbar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/chat/ChatWidget';
import WhatsAppFab from '@/components/WhatsAppFab';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Topbar />
      <Header />
      <main id="contenido" className="min-h-[60vh]">
        {children}
      </main>
      <Footer />
      <ChatWidget />
      <WhatsAppFab />
    </>
  );
}
