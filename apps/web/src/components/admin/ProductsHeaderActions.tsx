'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import BatchProductModal from './BatchProductModal';
import type { Category } from '@/types/category';
import type { Subcategory, Material } from '@/types/taxonomy';

/**
 * ProductsHeaderActions — par de botones del header de productos:
 * "Crear lote" (modal de carga masiva) + "Nuevo producto" (form normal).
 */
export default function ProductsHeaderActions({
  categories,
  subcategories,
  materials
}: {
  categories: Category[];
  subcategories: Subcategory[];
  materials: Material[];
}) {
  const [batchOpen, setBatchOpen] = useState(false);
  return (
    <div className="inline-flex flex-wrap gap-2">
      <Button
        variant="secondary"
        leadingIcon="bolt"
        onClick={() => setBatchOpen(true)}
      >
        Crear lote
      </Button>
      <Link href="/admin/productos/nuevo">
        <Button leadingIcon="plus">Nuevo producto</Button>
      </Link>
      {batchOpen && (
        <BatchProductModal
          onClose={() => setBatchOpen(false)}
          categories={categories}
          subcategories={subcategories}
          materials={materials}
        />
      )}
    </div>
  );
}
