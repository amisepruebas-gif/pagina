import type { Timestamp } from 'firebase/firestore';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  gradient?: string; // Tailwind gradient classes: "from-pink-500 to-purple-500"
  order: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RawCategoryDoc {
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  gradient?: string;
  order?: number;
  active?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Paleta de fallback cuando una categoría no tiene gradient guardado.
 * Determinista por hash del id, así misma categoría = mismo color siempre.
 */
const FALLBACK_GRADIENTS = [
  'from-purple-500 to-pink-500',
  'from-blue-400 to-cyan-400',
  'from-rose-400 to-amber-300',
  'from-slate-700 to-slate-400',
  'from-yellow-400 to-orange-500',
  'from-emerald-400 to-teal-500',
  'from-fuchsia-400 to-pink-300',
  'from-indigo-500 to-purple-400'
];

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function gradientFor(cat: Pick<Category, 'id' | 'gradient'>): string {
  if (cat.gradient && cat.gradient.trim()) return cat.gradient;
  return FALLBACK_GRADIENTS[hashCode(cat.id) % FALLBACK_GRADIENTS.length] ?? FALLBACK_GRADIENTS[0]!;
}

export const GRADIENT_PRESETS: { label: string; value: string }[] = [
  { label: 'Purple → Pink',    value: 'from-purple-500 to-pink-500' },
  { label: 'Blue → Cyan',      value: 'from-blue-400 to-cyan-400' },
  { label: 'Rose → Amber',     value: 'from-rose-400 to-amber-300' },
  { label: 'Slate',            value: 'from-slate-700 to-slate-400' },
  { label: 'Yellow → Orange',  value: 'from-yellow-400 to-orange-500' },
  { label: 'Emerald → Teal',   value: 'from-emerald-400 to-teal-500' },
  { label: 'Fuchsia → Pink',   value: 'from-fuchsia-400 to-pink-300' },
  { label: 'Indigo → Purple',  value: 'from-indigo-500 to-purple-400' }
];
