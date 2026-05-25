'use client';

import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/ui';
import { ICON_OPTIONS } from './field-registry';

const inputCls =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ' +
  'outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

/** Field — etiqueta + control, bloque base de cada campo del panel. */
export function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-gray-600">
        {label}
      </span>
      {children}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  );
}

export function TextAreaInput({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      rows={3}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputCls} resize-y leading-relaxed`}
    />
  );
}

export function NumberInput({
  value,
  onChange,
  min,
  max
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : 0}
      min={min}
      max={max}
      onChange={(e) => {
        const n = Number(e.target.value);
        if (Number.isNaN(n)) return;
        let clamped = n;
        if (typeof min === 'number') clamped = Math.max(min, clamped);
        if (typeof max === 'number') clamped = Math.min(max, clamped);
        onChange(clamped);
      }}
      className={inputCls}
    />
  );
}

export function ColorInput({
  value,
  onChange
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const safe = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000';
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={safe}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-12 shrink-0 cursor-pointer rounded border border-gray-300 bg-white p-0.5"
        aria-label="Selector de color"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className={`${inputCls} font-mono`}
      />
    </div>
  );
}

export function IconSelect({
  value,
  onChange
}: {
  value: IconName;
  onChange: (v: IconName) => void;
}) {
  const options = ICON_OPTIONS.includes(value)
    ? ICON_OPTIONS
    : [value, ...ICON_OPTIONS];
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded border border-gray-300 bg-gray-50 text-gray-700">
        <Icon name={value} size={18} />
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as IconName)}
        className={inputCls}
      >
        {options.map((ic) => (
          <option key={ic} value={ic}>
            {ic}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SelectInput({
  value,
  options,
  onChange
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function RangeInput({
  value,
  onChange,
  min = 0,
  max = 100
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  const safe = Number.isFinite(value) ? value : 0;
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        value={safe}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 flex-1 cursor-pointer accent-blue-600"
      />
      <span className="w-10 shrink-0 text-right font-mono text-xs text-gray-600">
        {safe}
      </span>
    </div>
  );
}
