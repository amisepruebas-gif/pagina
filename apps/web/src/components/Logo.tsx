import Link from 'next/link';

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="pagina — inicio"
      className="font-display text-[22px] md:text-[26px] font-bold tracking-tight shrink-0"
    >
      <span className="bg-brand-grad bg-clip-text text-transparent">pagina</span>
    </Link>
  );
}
