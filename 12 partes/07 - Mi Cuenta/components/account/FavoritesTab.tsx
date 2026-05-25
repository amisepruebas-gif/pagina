"use client";
import { ProductCard } from "@/components";
import { ACCOUNT_FAVORITES } from "@/lib/sample-account";
import { SectionHeader } from "./SectionHeader";
import { AccountEmptyState } from "./EmptyState";

/** FavoritesTab — productos guardados. */
export function FavoritesTab() {
  if (ACCOUNT_FAVORITES.length === 0) {
    return (
      <AccountEmptyState
        icon="heart" title="Aún no tienes favoritos"
        body="Toca el corazón en cualquier producto para guardarlo aquí."
        cta="Explorar tienda"
      />
    );
  }

  return (
    <div>
      <SectionHeader title="Tus favoritos" subtitle={`${ACCOUNT_FAVORITES.length} productos guardados`} />
      <div className="grid gap-3 sm:gap-3.5 grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        {ACCOUNT_FAVORITES.map((p) => (
          <ProductCard key={p.id} variant="canonical" product={p} />
        ))}
      </div>
    </div>
  );
}
