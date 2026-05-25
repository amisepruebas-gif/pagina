'use client';

import { useState } from 'react';
import { Pill } from '@/components/ui';
import TagsManager from './TagsManager';
import MaterialsManager from './MaterialsManager';
import SubcategoriesManager from './SubcategoriesManager';
import type { Category } from '@/types/category';

type Tab = 'etiquetas' | 'materiales' | 'subcategorias';

const TABS: { id: Tab; label: string }[] = [
  { id: 'etiquetas', label: 'Etiquetas' },
  { id: 'materiales', label: 'Materiales' },
  { id: 'subcategorias', label: 'Subcategorías' }
];

export default function TaxonomiesTabs({ categories }: { categories: Category[] }) {
  const [tab, setTab] = useState<Tab>('etiquetas');

  return (
    <div className="p-6">
      <div className="inline-flex gap-1.5 mb-4 flex-wrap">
        {TABS.map((t) => (
          <Pill key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </Pill>
        ))}
      </div>

      {tab === 'etiquetas' && <TagsManager />}
      {tab === 'materiales' && <MaterialsManager />}
      {tab === 'subcategorias' && <SubcategoriesManager categories={categories} />}
    </div>
  );
}
