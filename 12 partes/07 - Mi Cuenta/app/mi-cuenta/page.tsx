import { AccountPageClient, type AccountTab } from "@/components/account";

interface AccountPageProps {
  searchParams: { tab?: string };
}

const VALID_TABS: AccountTab[] = ["profile", "orders", "favorites", "addresses", "complaints"];

/**
 * /mi-cuenta — Área del cliente. Lee `?tab=` para preseleccionar la sección.
 */
export default function MiCuentaPage({ searchParams }: AccountPageProps) {
  const tab = searchParams.tab as AccountTab;
  const initialTab = VALID_TABS.includes(tab) ? tab : "profile";
  return <AccountPageClient initialTab={initialTab} />;
}

export const metadata = {
  title: "Mi cuenta — página/",
};
