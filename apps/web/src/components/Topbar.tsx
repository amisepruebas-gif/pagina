interface TopbarProps {
  message?: string;
}

export default function Topbar({
  message = 'ENVÍO GRATIS SOBRE $599'
}: TopbarProps) {
  return (
    <div className="bg-accent text-black">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-center gap-2 flex-wrap text-center">
        <svg
          width="20"
          height="20"
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
        <span className="text-[11px] sm:text-sm font-semibold tracking-wide">
          {message}
        </span>
      </div>
    </div>
  );
}
