import Link from 'next/link';

const socialLinks = [
  { href: 'https://www.facebook.com', label: 'Facebook', name: 'facebook' },
  { href: 'https://x.com', label: 'X', name: 'x' },
  { href: 'https://www.instagram.com', label: 'Instagram', name: 'instagram' },
  { href: 'https://www.linkedin.com', label: 'LinkedIn', name: 'linkedin' },
  { href: 'https://web.whatsapp.com', label: 'WhatsApp', name: 'whatsapp' }
] as const;

const quickLinks = [
  { href: '/shop?filter=new', label: 'Novedades' },
  { href: '/shop?filter=top', label: 'Lo mejor de hoy' },
  { href: '/shop?filter=deals', label: 'Mejores ofertas' },
  { href: '/shop?filter=sale-50', label: '50% descuento' }
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 flex flex-col items-center gap-6">
        <ul className="flex items-center gap-5">
          {socialLinks.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="text-gray-500 hover:text-accent transition-colors block"
              >
                <SocialIcon name={s.name} />
              </a>
            </li>
          ))}
        </ul>

        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold">
          {quickLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-gray-700 hover:text-accent transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-xs text-gray-500 text-center">
          <span className="font-medium">pagina</span> © {new Date().getFullYear()}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === 'facebook' && (
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      )}
      {name === 'x' && (
        <>
          <path d="M4 4l16 16" />
          <path d="M20 4L4 20" />
        </>
      )}
      {name === 'instagram' && (
        <>
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </>
      )}
      {name === 'linkedin' && (
        <>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </>
      )}
      {name === 'whatsapp' && (
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      )}
    </svg>
  );
}
