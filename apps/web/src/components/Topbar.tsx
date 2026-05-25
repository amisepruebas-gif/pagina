import { getActiveTopbar } from '@/lib/site-content';

export default async function Topbar() {
  const topbar = await getActiveTopbar();

  const message =
    topbar?.message ??
    'Envío gratis en compras desde $599 · Devoluciones 30 días';
  const customBg = topbar?.backgroundColor;
  const customFg = topbar?.textColor;
  const hasCustom = Boolean(customBg);

  return (
    <div
      className={
        hasCustom
          ? ''
          : 'bg-gradient-to-r from-brand-600 via-brand-500 to-accent-2 text-white'
      }
      style={
        hasCustom
          ? { backgroundColor: customBg, color: customFg || '#ffffff' }
          : undefined
      }
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-9 flex items-center justify-center gap-2 text-center">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
          aria-hidden
        >
          <path d="M20 7H4L2 21H22L20 7Z" />
          <path d="M8 7V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V7" />
        </svg>
        <span className="text-[11px] sm:text-xs font-medium tracking-wide">
          {message}
        </span>
      </div>
    </div>
  );
}
