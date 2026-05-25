"use client";
import { useState } from "react";
import { Topbar, Header, CategoryNav, Footer } from "@/components";
import {
  AccountNav, ProfileTab, OrdersTab, FavoritesTab, AddressesTab, ComplaintsTab,
  type AccountTab,
} from "./";
import {
  PROFILE, ACCOUNT_ORDERS, ACCOUNT_FAVORITES, ACCOUNT_ADDRESSES, ACCOUNT_COMPLAINTS,
} from "@/lib/sample-account";

export interface AccountPageClientProps {
  initialTab?: AccountTab;
}

/**
 * AccountPageClient — composición de la página "Mi cuenta".
 *
 * Greeting + layout grid (sidebar desktop / pills sticky mobile) + tab activo.
 * El estado vive en el cliente; cambiar de tab no recarga la página.
 */
export function AccountPageClient({ initialTab = "profile" }: AccountPageClientProps) {
  const [tab, setTab] = useState<AccountTab>(initialTab);
  const [activeCat, setActiveCat] = useState("Novedades");

  const counts = {
    orders:     ACCOUNT_ORDERS.length,
    favorites:  ACCOUNT_FAVORITES.length,
    addresses:  ACCOUNT_ADDRESSES.length,
    complaints: ACCOUNT_COMPLAINTS.length,
  };

  return (
    <>
      <Topbar />
      <Header cartCount={3} />
      <CategoryNav active={activeCat} onChange={setActiveCat} />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-6 pb-20">
        <div className="mb-6">
          <h1 className="font-display font-bold leading-none tracking-[-0.035em]
                         text-3xl sm:text-5xl lg:text-[clamp(32px,5vw,56px)]">
            Hola, <span className="bg-brand-grad bg-clip-text text-transparent">
              {PROFILE.name.split(" ")[0]}
            </span>.
          </h1>
          <p className="mt-2.5 text-text-muted text-[15px]">
            Gestiona tu perfil, pedidos y datos de envío desde aquí.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] items-start">
          <AccountNav active={tab} onChange={setTab} counts={counts} />

          <div className="min-w-0">
            {tab === "profile"    && <ProfileTab    />}
            {tab === "orders"     && <OrdersTab     />}
            {tab === "favorites"  && <FavoritesTab  />}
            {tab === "addresses"  && <AddressesTab  />}
            {tab === "complaints" && <ComplaintsTab />}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
