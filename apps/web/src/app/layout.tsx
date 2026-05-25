import type { Metadata } from 'next';
import { Space_Grotesk, Sora, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap'
});

const body = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap'
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap'
});

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'http://localhost:3030';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'pagina',
    template: '%s'
  },
  description: 'Accesorios y llaveros personalizados',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: 'pagina',
    url: '/'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' }
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="antialiased font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
