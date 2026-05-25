'use client';
import { useEffect, useState } from 'react';
import { IconButton } from '@/components/ui';

export interface InlineEditRowProps {
  value: string;
  onSave: (v: string) => void;
  onDelete: () => void;
}

/** InlineEditRow — fila con valor visible + botones editar/borrar inline. */
export function InlineEditRow({ value, onSave, onDelete }: InlineEditRowProps) {
  const [edit, setEdit] = useState(false);
  const [v, setV] = useState(value);
  useEffect(() => {
    setV(value);
  }, [value]);

  if (edit) {
    return (
      <div className="flex items-center gap-2.5 p-1.5 rounded-sm">
        <input
          autoFocus
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSave(v);
              setEdit(false);
            }
            if (e.key === 'Escape') {
              setV(value);
              setEdit(false);
            }
          }}
          className="flex-1 h-9 px-2.5 rounded-sm bg-surface border-[1.5px] border-brand-500 outline-none text-sm"
        />
        <IconButton
          variant="primary"
          icon="check"
          label="Guardar"
          size="sm"
          onClick={() => {
            onSave(v);
            setEdit(false);
          }}
        />
        <IconButton
          variant="ghost"
          icon="x"
          label="Cancelar"
          size="sm"
          onClick={() => {
            setV(value);
            setEdit(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 p-1.5 rounded-sm hover:bg-surface-2 transition">
      <span className="flex-1 text-sm">{value}</span>
      <div className="inline-flex gap-0.5">
        <IconButton
          variant="ghost"
          icon="grid"
          label="Editar"
          size="sm"
          onClick={() => setEdit(true)}
        />
        <IconButton
          variant="ghost"
          icon="x"
          label="Eliminar"
          size="sm"
          onClick={onDelete}
          className="!text-error"
        />
      </div>
    </div>
  );
}
