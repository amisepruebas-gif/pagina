// Categorías placeholder mientras no migramos `categories` a Firestore.
// Cuando estén en Firestore, este archivo desaparece.

export interface PlaceholderCategory {
  id: string;
  name: string;
  gradient: string;
  href: string;
}

export const placeholderCategories: PlaceholderCategory[] = [
  { id: 'llaveros',       name: 'Llaveros',        gradient: 'from-purple-500 to-pink-500',   href: '/shop?cat=llaveros' },
  { id: 'deportivos',     name: 'Deportivos',      gradient: 'from-blue-400 to-cyan-400',     href: '/shop?cat=deportivos' },
  { id: 'personalizados', name: 'Personalizados',  gradient: 'from-rose-400 to-amber-300',    href: '/shop?cat=personalizados' },
  { id: 'corporativos',   name: 'Corporativos',    gradient: 'from-slate-700 to-slate-400',   href: '/shop?cat=corporativos' },
  { id: 'animados',       name: 'Animados',        gradient: 'from-yellow-400 to-orange-500', href: '/shop?cat=animados' },
  { id: 'promocionales',  name: 'Promocionales',   gradient: 'from-emerald-400 to-teal-500',  href: '/shop?cat=promocionales' },
  { id: 'mini',           name: 'Mini',            gradient: 'from-fuchsia-400 to-pink-300',  href: '/shop?cat=mini' },
  { id: 'premium',        name: 'Premium',         gradient: 'from-indigo-500 to-purple-400', href: '/shop?cat=premium' }
];
