import Logo from './Logo';
import SearchBar from './SearchBar';
import AccountMenu from './auth/AccountMenu';
import CartButton from './cart/CartButton';
import MobileMenuButton from './MobileMenuButton';
import CategoryNav from './CategoryNav';

export default function Header() {
  return (
    <header className="bg-surface border-b border-border sticky top-[var(--demo-banner-h,0px)] z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3 md:gap-6">
        <MobileMenuButton />

        <Logo />

        <div className="order-3 md:order-2 w-full md:flex-1 md:max-w-xl md:mx-auto">
          <SearchBar />
        </div>

        <div className="order-2 md:order-3 ml-auto flex items-center gap-1.5 sm:gap-2.5">
          <AccountMenu />
          <CartButton />
        </div>
      </div>

      <CategoryNav />
    </header>
  );
}
