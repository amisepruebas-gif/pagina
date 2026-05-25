'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Icon } from '@/components/ui';
import ProductForm from './ProductForm';
import type { ProductFormValues } from '@/lib/admin/products-admin';
import type { RawProductDoc } from '@/types/product';
import { getProductImages } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { getSubcategories } from '@/lib/subcategories';
import { getMaterials } from '@/lib/materials';
import { getTags } from '@/lib/tags';
import type { Category } from '@/types/category';
import type { Material, Subcategory, Tag } from '@/types/taxonomy';

interface EditProductModalProps {
  productId: string;
  onClose: () => void;
}

interface LoadedData {
  initial: Partial<ProductFormValues> & { id: string };
  initialImages: string[];
  categories: Category[];
  subcategories: Subcategory[];
  materials: Material[];
  tags: Tag[];
}

/**
 * EditProductModal — abre la edición de un producto en un modal full-screen,
 * sin navegar fuera de la lista. Carga el doc + imágenes + taxonomías
 * client-side y monta el `<ProductForm>` con callbacks que cierran el modal
 * en vez de hacer `router.push`.
 */
export default function EditProductModal({
  productId,
  onClose
}: EditProductModalProps) {
  const [data, setData] = useState<LoadedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  // Handle del ProductForm — permite rollback de imágenes y check de cambios
  // al cerrar con X / Esc / Cancelar.
  const formHandle = useRef<{
    rollback: () => Promise<void>;
    isDirty: () => boolean;
  } | null>(null);

  useEffect(() => setMounted(true), []);

  /** Cierra pidiendo confirm si hay cambios y haciendo rollback siempre. */
  const closeWithCleanup = useCallback(async () => {
    if (formHandle.current?.isDirty()) {
      const ok = window.confirm(
        'Tienes cambios sin guardar. ¿Cerrar de todos modos?'
      );
      if (!ok) return;
    }
    try {
      await formHandle.current?.rollback();
    } catch (err) {
      console.error('[EditProductModal] rollback fail', err);
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);

    (async () => {
      try {
        const [snap, categories, subcategories, materials, tags, images] =
          await Promise.all([
            getDoc(doc(db, 'products', productId)),
            getCategories(),
            getSubcategories(),
            getMaterials(),
            getTags(),
            getProductImages(productId)
          ]);
        if (cancelled) return;

        if (!snap.exists()) {
          setError('El producto ya no existe.');
          return;
        }

        const raw = snap.data() as RawProductDoc;
        let price = 0;
        if (typeof raw.price === 'number') {
          price = raw.price;
        } else if (
          raw.price &&
          typeof raw.price === 'object' &&
          typeof (raw.price as { sale?: number }).sale === 'number'
        ) {
          price = (raw.price as { sale: number }).sale;
        }

        setData({
          initial: {
            id: productId,
            name: raw.name ?? '',
            slug: raw.slug,
            sku: raw.sku,
            description: raw.description,
            longDescription: raw.longDescription,
            price,
            originalPrice: raw.originalPrice,
            stock: raw.stock,
            isNew: !!raw.isNew,
            isFeatured: !!raw.isFeatured,
            active: raw.active !== false,
            primaryImageUrl:
              raw.primaryImageUrl ?? raw.imageUrl ?? raw.imagePrincipal,
            categoryId: raw.categoryId,
            subcategoryId: raw.subcategoryId,
            materialId: raw.materialId,
            tagIds: raw.tagIds ?? []
          },
          initialImages: images.map((img) => img.url),
          categories,
          subcategories,
          materials,
          tags
        });
      } catch (err) {
        if (cancelled) return;
        console.error('[EditProductModal] error cargando', err);
        setError('No se pudo cargar el producto. Revisa F12 console.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  // Esc cierra — pasa por closeWithCleanup para preservar imágenes huérfanas
  // y advertir al usuario de cambios sin guardar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWithCleanup();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeWithCleanup]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-stretch justify-center bg-black/55 sm:p-4 sm:items-center"
      role="presentation"
    >
      <div
        className="relative flex max-h-[100vh] w-full max-w-5xl flex-col overflow-hidden bg-surface shadow-2xl sm:max-h-[92vh] sm:rounded-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Editar producto"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-5 py-3.5">
          <h2 className="font-display text-base font-bold">Editar producto</h2>
          <button
            type="button"
            onClick={closeWithCleanup}
            aria-label="Cerrar"
            className="rounded-md p-1.5 text-text-muted transition hover:bg-surface-2 hover:text-text"
          >
            <Icon name="x" size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-surface-2/40">
          {error ? (
            <div className="m-6 rounded-md border border-error/30 bg-error/[0.12] px-4 py-3 text-sm text-error">
              {error}
            </div>
          ) : !data ? (
            <p className="py-16 text-center text-sm text-text-soft">
              Cargando producto…
            </p>
          ) : (
            <ProductForm
              initial={data.initial}
              initialImages={data.initialImages}
              categories={data.categories}
              subcategories={data.subcategories}
              materials={data.materials}
              tags={data.tags}
              hideBreadcrumb
              onSaved={() => onClose()}
              onCancelOverride={closeWithCleanup}
              onMountCleanupHandle={(h) => {
                formHandle.current = h;
              }}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
