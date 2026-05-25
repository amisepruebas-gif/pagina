'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  createMaterial,
  updateMaterial,
  deleteMaterial,
  setActiveOn
} from '@/lib/admin/taxonomies-admin';
import type { Material, RawMaterialDoc } from '@/types/taxonomy';
import { Badge, Button, IconButton, Input } from '@/components/ui';
import { Toggle } from '@/components/admin/Toggle';

function normalize(id: string, data: DocumentData): Material {
  const raw = data as RawMaterialDoc;
  return {
    id,
    name: raw.name ?? '',
    slug: raw.slug ?? id,
    description: raw.description,
    active: raw.active !== false
  };
}

export default function MaterialsManager() {
  const [items, setItems] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'materials'),
      (snap) => {
        const list = snap.docs.map((d) => normalize(d.id, d.data()));
        list.sort((a, b) => a.name.localeCompare(b.name));
        setItems(list);
        setLoading(false);
      },
      (err) => {
        console.error('[MATERIALS] snapshot error', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  async function handleAdd() {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      await createMaterial({
        name: newName.trim(),
        description: newDesc.trim() || undefined,
        active: true
      });
      setNewName('');
      setNewDesc('');
    } catch (err) {
      console.error('[MATERIALS] create error', err);
      window.alert('Error al crear material');
    } finally {
      setAdding(false);
    }
  }

  function startEdit(m: Material) {
    setEditingId(m.id);
    setEditName(m.name);
    setEditDesc(m.description ?? '');
  }

  async function saveEdit() {
    if (!editingId || !editName.trim()) return;
    try {
      await updateMaterial(editingId, {
        name: editName.trim(),
        description: editDesc.trim() || undefined,
        active: items.find((i) => i.id === editingId)?.active ?? true
      });
      setEditingId(null);
    } catch (err) {
      console.error('[MATERIALS] update error', err);
      window.alert('Error al guardar');
    }
  }

  async function handleDelete(m: Material) {
    if (!window.confirm(`¿Eliminar el material "${m.name}"?`)) return;
    try {
      await deleteMaterial(m.id);
    } catch (err) {
      console.error('[MATERIALS] delete error', err);
    }
  }

  async function toggleActive(m: Material) {
    try {
      await setActiveOn('materials', m.id, !m.active);
    } catch (err) {
      console.error('[MATERIALS] toggle error', err);
    }
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      {/* Alta */}
      <div className="flex gap-2.5 items-end flex-wrap mb-4">
        <div className="flex-1 min-w-[200px] max-w-[280px]">
          <Input
            label="Nuevo material"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Ej: acrílico, metal, plástico"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <Input
            label="Descripción (opcional)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Notas internas"
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
            No hay materiales todavía. Agrega el primero arriba.
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {items.map((m) => (
              <div
                key={m.id}
                className={`flex items-center gap-2.5 p-2 rounded-sm transition hover:bg-surface-2 ${
                  m.active ? '' : 'opacity-55'
                }`}
              >
                {editingId === m.id ? (
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
                    <input
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      placeholder="Descripción"
                      className="flex-1 min-w-[120px] h-9 px-2.5 rounded-sm bg-surface border-[1.5px] border-border-strong outline-none text-sm"
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
                    <span className="font-display font-medium text-sm shrink-0">{m.name}</span>
                    <span className="flex-1 text-[13px] text-text-muted truncate">
                      {m.description ?? '—'}
                    </span>
                    <Badge tone={m.active ? 'success' : 'neutral'} size="xs">
                      {m.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Toggle
                      checked={m.active}
                      onChange={() => toggleActive(m)}
                      label={`Activar material ${m.name}`}
                    />
                    <div className="inline-flex gap-0.5">
                      <IconButton
                        variant="ghost"
                        icon="grid"
                        label="Editar"
                        size="sm"
                        onClick={() => startEdit(m)}
                      />
                      <IconButton
                        variant="ghost"
                        icon="x"
                        label="Eliminar"
                        size="sm"
                        onClick={() => handleDelete(m)}
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
