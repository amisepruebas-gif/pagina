import Link from 'next/link';
import { getConfig } from '@/lib/config';

const COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: 'Comprar',
    links: [
      { href: '/shop', label: 'Tienda' },
      { href: '/shop?sale=true', label: 'Ofertas' }
    ]
  },
  {
    title: 'Ayuda',
    links: [
      { href: '/envios', label: 'Envíos y entregas' },
      { href: '/devoluciones', label: 'Devoluciones' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { href: '/terminos', label: 'Términos' },
      { href: '/privacidad', label: 'Privacidad' }
    ]
  }
];

export default async function Footer() {
  const config = await getConfig();
  const social = config.social;

  const socialLinks = [
    social.facebook && { href: social.facebook, name: 'facebook', label: 'Facebook' },
    social.x && { href: social.x, name: 'x', label: 'X' },
    social.instagram && { href: social.instagram, name: 'instagram', label: 'Instagram' },
    social.linkedin && { href: social.linkedin, name: 'linkedin', label: 'LinkedIn' },
    social.whatsapp && { href: social.whatsapp, name: 'whatsapp', label: 'WhatsApp' }
  ].filter(Boolean) as { href: string; name: string; label: string }[];

  return (
    <footer className="bg-surface-2 border-t border-border mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 grid-cols-2 md:grid-cols-4 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-2xl font-bold">
              <span className="bg-brand-grad bg-clip-text text-transparent">
                pagina
              </span>
            </span>
            <p className="mt-4 text-text-muted text-sm leading-relaxed max-w-xs">
              Accesorios y productos personalizados. Envío rápido y devoluciones
              fáciles.
            </p>
            {socialLinks.length > 0 && (
              <ul className="mt-5 flex items-center gap-3">
                {socialLinks.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="inline-flex items-center justify-center size-9 rounded-pill bg-surface border border-border text-text-muted hover:text-brand-600 hover:border-brand-500 transition"
                    >
                      <SocialIcon name={s.name} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {COLS.map((c) => (
            <div key={c.title}>
              <h5 className="font-display font-bold uppercase tracking-wider text-[13px] mb-3.5">
                {c.title}
              </h5>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-text-muted text-sm hover:text-brand-700 transition"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-text-soft text-[13px]">
          <span>
            <span className="font-medium text-text">
              {config.branding.siteName}
            </span>{' '}
            © {new Date().getFullYear()}. Todos los derechos reservados.
          </span>
          {(config.contact.email || config.contact.phone) && (
            <span className="inline-flex flex-wrap gap-x-4 gap-y-1">
              {config.contact.email && (
                <a
                  href={`mailto:${config.contact.email}`}
                  className="hover:text-text"
                >
                  {config.contact.email}
                </a>
              )}
              {config.contact.phone && <span>{config.contact.phone}</span>}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  return (
    <svg
      width="18"
      height="18"
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
