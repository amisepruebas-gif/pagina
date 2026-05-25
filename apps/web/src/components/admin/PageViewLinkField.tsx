'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui';
import { TextInput } from './home-editor/editor-widgets';
import PageViewPickerModal from './PageViewPickerModal';

interface Props {
  value: string;
  onChange: (href: string) => void;
  placeholder?: string;
}

/**
 * PageViewLinkField — entrada de enlace dual: text input para URL libre
 * (cualquier path o URL externa) + botón "Seleccionar página creada" que
 * abre un modal con las vistas activas y, al confirmar, escribe `/v/<slug>`
 * en el mismo campo. El texto sigue siendo editable después de la
 * selección — el modal solo es un atajo.
 */
export default function PageViewLinkField({
  value,
  onChange,
  placeholder
}: Props) {
  const [open, setOpen] = useState(false);

  // Extrae el slug si el valor actual ya apunta a /v/<slug>; el picker lo
  // usa para preseleccionar la vista al abrir. Tolera espacios y trailing
  // slash que un admin pudo dejar al escribir a mano.
  const currentSlug = value.startsWith('/v/')
    ? value.slice(3).split(/[?#]/)[0].trim().replace(/\/+$/, '') || null
    : null;

  return (
    <div className="flex flex-col gap-1.5">
      <TextInput
        value={value}
        onChange={onChange}
        placeholder={placeholder ?? '/'}
      />
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border-strong bg-surface px-3 py-2 text-[12px] font-display font-semibold text-text transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
      >
        <Icon name="grid" size={13} strokeWidth={2.2} />
        Seleccionar página creada
      </button>
      <PageViewPickerModal
        open={open}
        onClose={() => setOpen(false)}
        selectedSlug={currentSlug}
        onConfirm={(href) => onChange(href)}
      />
    </div>
  );
}
