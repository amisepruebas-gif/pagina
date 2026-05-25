'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  setActiveOn
} from '@/lib/admin/taxonomies-admin';
import type { Subcategory, RawSubcategoryDoc } from '@/types/taxonomy';
import type { Category } from '@/types/category';
import { Badge, Button, IconButton, Input, Select } from '@/components/ui';
import { Toggle } from '@/components/admin/Toggle';

function normalize(id: string, data: DocumentData): Subcategory {
  const raw = data as RawSubcategoryDoc;
  return {
    id,
    name: raw.name ?? '',
    slug: raw.slug ?? id,
    categoryId: raw.categoryId ?? '',
    description: raw.description,
    order: raw.order ?? 0,
    active: raw.active !== false
  };
}

export default function SubcategoriesManager({ categories }: { categories: Category[] }) {
  const [items, setItems] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCatId, setEditCatId] = useState('');
  const [editOrder, setEditOrder] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'subcategories'),
      (snap) => {
        const list = snap.docs.map((d) => normalize(d.id, d.data()));
        list.sort((a, b) => {
          if (a.order !== b.order) return a.order - b.order;
          return a.name.localeCompare(b.name);
        });
        setItems(list);
        setLoading(false);
      },
      (err) => {
        console.error('[SUBCAT] snapshot error', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  async function handleAdd() {
    if (!newName.trim() || !newCatId) return;
    setAdding(true);
    try {
      await createSubcategory({
        name: newName.trim(),
        categoryId: newCatId,
        order: 0,
        active: true
      });
      setNewName('');
      setNewCatId('');
    } catch (err) {
      console.error('[SUBCAT] create error', err);
      window.alert('Error al crear subcategoría');
    } finally {
      setAdding(false);
    }
  }

  function startEdit(s: Subcategory) {
    setEditingId(s.id);
    setEditName(s.name);
    setEditCatId(s.categoryId);
    setEditOrder(s.order);
  }

  async function saveEdit() {
    if (!editingId || !editName.trim() || !editCatId) return;
    try {
      await updateSubcategory(editingId, {
        name: editName.trim(),
        categoryId: editCatId,
        order: editOrder,
        active: items.find((i) => i.id === editingId)?.active ?? true
      });
      setEditingId(null);
    } catch (err) {
      console.error('[SUBCAT] update error', err);
      window.alert('Error al guardar');
    }
  }

  async function handleDelete(s: Subcategory) {
    if (!window.confirm(`¿Eliminar la subcategoría "${s.name}"?`)) return;
    try {
      await deleteSubcategory(s.id);
    } catch (err) {
      console.error('[SUBCAT] delete error', err);
    }
  }

  async function toggleActive(s: Subcategory) {
    try {
      await setActiveOn('subcategories', s.id, !s.active);
    } catch (err) {
      console.error('[SUBCAT] toggle error', err);
    }
  }

  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;
  const catOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      {/* Alta */}
      <div className="mb-4">
        {categories.length === 0 ? (
          <p className="text-sm text-warning">
            No hay categorías. Crea una en /admin/categorias antes.
          </p>
        ) : (
          <div className="flex gap-2.5 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                label="Nueva subcategoría"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Ej: futbol, beisbol"
              />
            </div>
            <div className="flex-1 min-w-[200px] max-w-[260px]">
              <Select
                label="Categoría padre"
                options={catOptions}
                placeholder="— categoría padre —"
                value={newCatId}
                onChange={(e) => setNewCatId(e.target.value)}
              />
            </div>
            <Button
              leadingIcon="plus"
              loading={adding}
              disabled={adding || !newName.trim() || !newCatId}
              onClick={handleAdd}
            >
              Agregar
            </Button>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-3">
        {loading ? (
          <div className="py-8 text-center text-text-soft text-sm">Cargando…</div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-text-soft text-sm">
            No hay subcategorías todavía.
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {items.map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-2.5 p-2 rounded-sm transition hover:bg-surface-2 ${
                  s.active ? '' : 'opacity-55'
                }`}
              >
                {editingId === s.id ? (
                  <>
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      placeholder="Nombre"
                      className="flex-1 min-w-[120px] h-9 px-2.5 rounded-sm bg-surface border-[1.5px] border-brand-500 outline-none text-sm"
                    />
                    <select
                      value={editCatId}
                      onChange={(e) => setEditCatId(e.target.value)}
                      className="h-9 px-2.5 rounded-sm bg-surface border-[1.5px] border-border-strong outline-none text-sm"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={editOrder}
                      onChange={(e) => setEditOrder(Number(e.target.value) || 0)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      aria-label="Orden"
                      className="w-16 h-9 px-2.5 rounded-sm bg-surface border-[1.5px] border-border-strong outline-none text-sm text-right"
                    />
                    <IconButton
                      variant="primary"
                      icon="check"
                      label="Guardar"
                      size="sm"
                      onClick={saveEdit}
                    />
                    <IconButton
                      variant="ghost"
                      icon="x"
                      label="Cancelar"
                      size="sm"
                      onClick={() => setEditingId(null)}
                    />
                  </>
                ) : (
                  <>
                    <span className="font-display font-medium text-sm shrink-0">{s.name}</span>
                    <span className="flex-1 min-w-0">
                      <Badge tone="neutral" size="xs">
                        {catName(s.categoryId)}
                      </Badge>
                    </span>
                    <span className="font-mono text-[11px] text-text-soft" title="Orden">
                      #{s.order}
                    </span>
                    <Badge tone={s.active ? 'success' : 'neutral'} size="xs">
                      {s.active ? 'Activa' : 'Inactiva'}
                    </Badge>
                    <Toggle
                      checked={s.active}
                      onChange={() => toggleActive(s)}
                      label={`Activar subcategoría ${s.name}`}
                    />
                    <div className="inline-flex gap-0.5">
                      <IconButton
                        variant="ghost"
                        icon="grid"
                        label="Editar"
                        size="sm"
                        onClick={() => startEdit(s)}
                      />
                      <IconButton
                        variant="ghost"
                        icon="x"
                        label="Eliminar"
                        size="sm"
                        onClick={() => handleDelete(s)}
                        className="!text-error"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
