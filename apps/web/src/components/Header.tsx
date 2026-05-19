import Link from 'next/link';
import Logo from './Logo';
import SearchBar from './SearchBar';
import AccountMenu from './auth/AccountMenu';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 py-3 flex flex-wrap items-center gap-3 md:gap-6">
        {/* Hamburger — mobile only (placeholder; menú real cuando lleguen categorías) */}
        <button
          type="button"
          aria-label="Abrir menú"
          className="md:hidden p-1 text-gray-900"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <Logo />

        <div className="order-3 md:order-2 w-full md:flex-1 md:max-w-xl md:mx-auto">
          <SearchBar />
        </div>

        <div className="order-2 md:order-3 ml-auto flex items-center gap-3 md:gap-5">
          <AccountMenu />

          <Link
            href="/cart"
            aria-label="Mi bolsa"
            className="relative flex flex-col items-center text-gray-900 hover:text-accent transition-colors"
          >
            <span className="relative inline-block">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-accent text-black text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center">
                0
              </span>
            </span>
            <span className="hidden lg:block text-[11px] mt-0.5">Mi bolsa</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
