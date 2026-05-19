export default function SearchBar() {
  return (
    <form action="/search" className="relative flex items-center w-full">
      <input
        type="search"
        name="q"
        placeholder="Buscar productos…"
        aria-label="Buscar productos"
        className="w-full rounded-full border border-gray-200 bg-gray-50 px-5 py-2 pr-12 text-sm placeholder:text-gray-400 focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="absolute right-2 p-1.5 text-gray-500 hover:text-accent transition-colors"
      >
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
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>
  );
}
