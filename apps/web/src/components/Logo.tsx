import Link from 'next/link';

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="pagina — inicio"
      className="font-display text-2xl md:text-3xl font-bold tracking-tight text-gray-900 hover:text-accent transition-colors"
    >
      pagina
    </Link>
  );
}
