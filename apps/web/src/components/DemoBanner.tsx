/**
 * Banda fija arriba de todo el sitio público que aclara que esto es una
 * demo. Va antes del Topbar promocional para no chocar con su contenido
 * editable desde el admin.
 */
export default function DemoBanner() {
  return (
    <div className="bg-amber-400 text-amber-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-8 flex items-center justify-center gap-1.5 text-center text-[11px] sm:text-xs font-semibold tracking-wide">
        <span>Página demostrativa · info</span>
        <a
          href="tel:+527473570112"
          className="underline underline-offset-2 hover:no-underline"
        >
          747 357 0112
        </a>
      </div>
    </div>
  );
}
