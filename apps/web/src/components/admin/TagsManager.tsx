'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  createTag,
  updateTag,
  deleteTag,
  setActiveOn
} from '@/lib/admin/taxonomies-admin';
import type { Tag, RawTagDoc } from '@/types/taxonomy';
import { Badge, Button, IconButton, Input } from '@/components/ui';
import { Toggle } from '@/components/admin/Toggle';

function normalize(id: string, data: DocumentData): Tag {
  const raw = data as RawTagDoc;
  return {
    id,
    name: raw.name ?? '',
    slug: raw.slug ?? id,
    color: raw.color,
    active: raw.active !== false
  };
}

export default function TagsManager() {
  const [items, setItems] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#FF69B4');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#FF69B4');

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'tags'),
      (snap) => {
        const list = snap.docs.map((d) => normalize(d.id, d.data()));
        list.sort((a, b) => a.name.localeCompare(b.name));
        setItems(list);
        setLoading(false);
      },
      (err) => {
        console.error('[TAGS] snapshot error', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  async function handleAdd() {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      await createTag({ name: newName.trim(), color: newColor.trim() || undefined, active: true });
      setNewName('');
      setNewColor('#FF69B4');
    } catch (err) {
      console.error('[TAGS] create error', err);
      window.alert('Error al crear etiqueta');
    } finally {
      setAdding(false);
    }
  }

  function startEdit(t: Tag) {
    setEditingId(t.id);
    setEditName(t.name);
    setEditColor(t.color ?? '#FF69B4');
  }

  async function saveEdit() {
    if (!editingId || !editName.trim()) return;
    try {
      await updateTag(editingId, {
        name: editName.trim(),
        color: editColor.trim() || undefined,
        active: items.find((i) => i.id === editingId)?.active ?? true
      });
      setEditingId(null);
    } catch (err) {
      console.error('[TAGS] update error', err);
      window.alert('Error al guardar');
    }
  }

  async function handleDelete(t: Tag) {
    if (!window.confirm(`¿Eliminar la etiqueta "${t.name}"? No se puede deshacer.`)) return;
    try {
      await deleteTag(t.id);
    } catch (err) {
      console.error('[TAGS] delete error', err);
      window.alert('Error al eliminar');
    }
  }

  async function toggleActive(t: Tag) {
    try {
      await setActiveOn('tags', t.id, !t.active);
    } catch (err) {
      console.error('[TAGS] toggle error', err);
    }
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      {/* Alta */}
      <div className="flex gap-2.5 items-end flex-wrap mb-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            label="Nueva etiqueta"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Ej: navidad, deportivo"
          />
        </div>
        <div>
          <div className="font-display font-semibold text-[13px] mb-1.5">Color</div>
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="size-12 p-0.5 border-[1.5px] border-border-strong rounded-md cursor-pointer bg-surface"
          />
        </div>
        <Button
          leadingIcon="plus"
          loading={adding}
          disabled={adding || !newName.trim()}
          onClick={handleAdd}
        >
          Agregar
        </Button>
      </div>

      <div className="border-t border-border pt-3">
        {loading ? (
          <div className="py-8 text-center text-text-soft text-sm">Cargando…</div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-text-soft text-sm">
            No hay etiquetas todavía. Agrega la primera arriba.
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {items.map((t) => (
              <div
                key={t.id}
                className={`flex items-center gap-2.5 p-2 rounded-sm transition hover:bg-surface-2 ${
                  t.active ? '' : 'opacity-55'
                }`}
              >
                {editingId === t.id ? (
                  <>
                    <input
                      type="color"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="size-9 p-0.5 border-[1.5px] border-border-strong rounded-sm cursor-pointer bg-surface shrink-0"
                    />
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="flex-1 h-9 px-2.5 rounded-sm bg-surface border-[1.5px] border-brand-500 outline-none text-sm"
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
                    <span
                      className="size-4 rounded-full shrink-0 border border-border"
                      style={{ background: t.color || 'var(--surface-2)' }}
                    />
                    <span className="flex-1 font-display font-medium text-sm">{t.name}</span>
                    <span className="font-mono text-[11px] text-text-soft hidden sm:inline">
                      {t.slug}
                    </span>
                    {t.color && (
                      <span className="font-mono text-[11px] text-text-soft hidden md:inline">
                        {t.color}
                      </span>
                    )}
                    <Badge tone={t.active ? 'success' : 'neutral'} size="xs">
                      {t.active ? 'Activa' : 'Inactiva'}
                    </Badge>
                    <Toggle
                      checked={t.active}
                      onChange={() => toggleActive(t)}
                      label={`Activar etiqueta ${t.name}`}
                    />
                    <div className="inline-flex gap-0.5">
                      <IconButton
                        variant="ghost"
                        icon="grid"
                        label="Editar"
                        size="sm"
                        onClick={() => startEdit(t)}
                      />
                      <IconButton
                        variant="ghost"
                        icon="x"
                        label="Eliminar"
                        size="sm"
                        onClick={() => handleDelete(t)}
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
