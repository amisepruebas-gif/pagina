/**
 * CheckPulse — círculo de check animado para la pantalla de éxito.
 *
 * - El halo exterior pulsa (`@keyframes ck-pulse`).
 * - El path del check se dibuja con `stroke-dashoffset`.
 */
export function CheckPulse() {
  return (
    <div className="relative inline-flex items-center justify-center size-28">
      <span aria-hidden
            className="absolute inset-0 rounded-full animate-[ck-pulse_2.2s_ease-out_infinite]
                       bg-brand-grad" />
      <span aria-hidden className="absolute inset-2 rounded-full shadow-brand bg-brand-grad" />
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="relative text-white">
        <path
          d="m4 12 5 5L20 6"
          stroke="currentColor" strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: "ck-draw 700ms 200ms forwards cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <style jsx global>{`
        @keyframes ck-pulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes ck-draw { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}
