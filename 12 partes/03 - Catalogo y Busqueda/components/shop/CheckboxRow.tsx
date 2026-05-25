interface CheckboxRowProps {
  label: string;
  count?: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** Fila checkbox con label y conteo opcional. Tap target 36px. */
export function CheckboxRow({ label, count, checked, onChange }: CheckboxRowProps) {
  return (
    <label className="flex items-center gap-2.5 py-2 min-h-9 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-[18px] accent-brand-500 cursor-pointer shrink-0"
      />
      <span className="flex-1 text-sm text-text">{label}</span>
      {count != null && <span className="text-xs text-text-soft">({count})</span>}
    </label>
  );
}
