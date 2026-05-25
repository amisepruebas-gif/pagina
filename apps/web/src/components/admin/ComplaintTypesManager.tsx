'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  createComplaintType,
  updateComplaintType,
  deleteComplaintType,
  setComplaintTypeActive
} from '@/lib/admin/complaint-types-admin';
import type { ComplaintType, RawComplaintTypeDoc } from '@/types/complaint';
import { Badge, Button, IconButton, Input } from '@/components/ui';
import { Toggle } from '@/components/admin/Toggle';

function normalize(id: string, data: DocumentData): ComplaintType {
  const raw = data as RawComplaintTypeDoc;
  return {
    id,
    name: raw.name ?? '',
    description: raw.description,
    active: raw.active !== false
  };
}

export default function ComplaintTypesManager() {
  const [items, setItems] = useState<ComplaintType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'complaintTypes'),
      (snap) => {
        const list = snap.docs.map((d) => normalize(d.id, d.data()));
        list.sort((a, b) => a.name.localeCompare(b.name));
        console.log('[COMPLAINT-TYPES] snapshot', list.length, 'tipos');
        setItems(list);
        setLoading(false);
      },
      (err) => {
        console.error('[COMPLAINT-TYPES] error', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  async function handleAdd() {
    if (!newName.trim()) return;
    setSubmitting(true);
    try {
      console.log('[COMPLAINT-TYPES] create', newName.trim());
      await createComplaintType({
        name: newName.trim(),
        description: newDesc.trim() || undefined,
        active: true
      });
      setNewName('');
      setNewDesc('');
    } catch (err) {
      console.error('[COMPLAINT-TYPES] create error', err);
      window.alert('Error al crear');
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(t: ComplaintType) {
    setEditingId(t.id);
    setEditName(t.name);
    setEditDesc(t.description ?? '');
  }

  async function saveEdit() {
    if (!editingId || !editName.trim()) return;
    try {
      console.log('[COMPLAINT-TYPES] update', editingId);
      await updateComplaintType(editingId, {
        name: editName.trim(),
        description: editDesc.trim() || undefined,
        active: items.find((i) => i.id === editingId)?.active ?? true
      });
      setEditingId(null);
    } catch (err) {
      console.error('[COMPLAINT-TYPES] update error', err);
    }
  }

  async function handleDelete(t: ComplaintType) {
    if (!window.confirm(`¿Eliminar tipo "${t.name}"?`)) return;
    try {
      console.log('[COMPLAINT-TYPES] delete', t.id);
      await deleteComplaintType(t.id);
    } catch (err) {
      console.error('[COMPLAINT-TYPES] delete error', err);
    }
  }

  async function toggleActive(t: ComplaintType) {
    try {
      console.log('[COMPLAINT-TYPES] toggle', t.id, !t.active);
      await setComplaintTypeActive(t.id, !t.active);
    } catch (err) {
      console.error('[COMPLAINT-TYPES] toggle error', err);
    }
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      {/* Alta inline */}
      <div className="flex gap-2.5 items-end flex-wrap mb-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            label="Nombre del tipo"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Ej: Producto defectuoso"
          />
        </div>
        <div className="flex-1 min-w-[240px]" style={{ flex: 2 }}>
          <Input
            label="Descripción (opcional)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Texto de ayuda para el cliente"
          />
        </div>
        <Button
          leadingIcon="plus"
          loading={submitting}
          disabled={submitting || !newName.trim()}
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
            No hay tipos todavía. Agrega al menos uno para que tus clientes puedan
            clasificar quejas.
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {items.map((t) => (
              <div
                key={t.id}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-sm transition hover:bg-surface-2 ${
                  t.active ? '' : 'opacity-55'
                }`}
              >
                {editingId === t.id ? (
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
                      className="w-[220px] h-9 px-2.5 rounded-sm bg-surface border-[1.5px] border-brand-500 outline-none text-sm shrink-0"
                    />
                    <input
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      placeholder="Descripción"
                      className="flex-1 min-w-[160px] h-9 px-2.5 rounded-sm bg-surface border-[1.5px] border-border-strong outline-none text-sm"
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
                    <span className="w-[220px] font-display font-semibold text-sm shrink-0 truncate">
                      {t.name}
                    </span>
                    <span className="flex-1 min-w-0 text-xs text-text-soft truncate">
                      {t.description || (
                        <em className="opacity-60">sin descripción</em>
                      )}
                    </span>
                    <Badge tone={t.active ? 'success' : 'neutral'} size="xs">
                      {t.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Toggle
                      checked={t.active}
                      onChange={() => toggleActive(t)}
                      label={`Activar tipo ${t.name}`}
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
