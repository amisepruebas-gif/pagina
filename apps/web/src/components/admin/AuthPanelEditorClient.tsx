'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Icon } from '@/components/ui';
import ImageInput from './ImageInput';
import { saveAuthPanelConfig } from '@/lib/auth-panel';
import {
  DEFAULT_AUTH_PANEL_CONFIG,
  type AuthPanelConfig
} from '@/types/auth-panel';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useImageCleanup } from '@/lib/admin/use-image-cleanup';

/**
 * AuthPanelEditorClient — formulario simple con preview en vivo del panel
 * lateral de /login, /register y /forgot-password. Mismas reglas que el
 * resto del sistema: imagen al fondo, capa de color encima, dos blobs
 * decorativos con color y opacidad editables.
 */
export function AuthPanelEditorClient({
  initialConfig
}: {
  initialConfig: AuthPanelConfig;
}) {
  const router = useRouter();
  const [form, setForm] = useState<AuthPanelConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const { onUploaded, onReplace, commit, rollback } = useImageCleanup();

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialConfig);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  function update<K extends keyof AuthPanelConfig>(
    key: K,
    value: AuthPanelConfig[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveAuthPanelConfig(form);
      await commit(form.bgImageUrl ? [form.bgImageUrl] : []);
      setSavedAt(new Date());
      console.log('[AUTH-PANEL] guardado');
    } catch (err) {
      console.error('[AUTH-PANEL] error al guardar', err);
      window.alert('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  async function handleBack() {
    if (
      isDirty &&
      !window.confirm('Tienes cambios sin guardar. ¿Salir de todos modos?')
    ) {
      return;
    }
    await rollback();
    router.push('/admin/vistas');
  }

  function handleReset() {
    if (!window.confirm('¿Restablecer al diseño por defecto?')) return;
    setForm(DEFAULT_AUTH_PANEL_CONFIG);
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-gray-100">
      {/* Toolbar */}
      <header className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            <Icon name="arr-left" size={16} />
            Volver
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <h1 className="font-display font-bold text-sm">
            Editor — Inicio de sesión
          </h1>
          {isDirty && (
            <span className="font-mono text-[11px] tracking-widest uppercase text-amber-600">
              · Sin guardar
            </span>
          )}
          {!isDirty && savedAt && (
            <span className="font-mono text-[11px] tracking-widest uppercase text-success">
              · Guardado
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            disabled={saving}
          >
            Restablecer
          </Button>
          <Button
            size="sm"
            leadingIcon="check"
            onClick={handleSave}
            disabled={!isDirty || saving}
            loading={saving}
          >
            Guardar
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Preview */}
        <div className="min-w-0 flex-1 overflow-y-auto bg-white">
          <div className="pointer-events-none">
            <AuthLayout
              panel={form}
              title="Bienvenido de vuelta"
              subtitle="Inicia sesión para acceder a tus pedidos, favoritos y direcciones."
            >
              <div className="rounded-lg border border-dashed border-border bg-surface-2 p-6 text-center text-sm text-text-soft">
                (Vista previa del formulario)
              </div>
            </AuthLayout>
          </div>
        </div>

        {/* Panel de propiedades */}
        <aside className="w-[360px] shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-5">
          <h2 className="font-display font-bold text-sm mb-1">Propiedades</h2>
          <p className="text-xs text-gray-500 mb-5">
            El orden es: imagen al fondo, capa de color encima, blobs decorativos
            sobre la capa.
          </p>

          <Section title="Imagen de fondo">
            <ImageInput
              value={form.bgImageUrl ?? ''}
              onChange={(url) =>
                setForm((f) => ({ ...f, bgImageUrl: url || undefined }))
              }
              onUploaded={onUploaded}
              onReplace={onReplace}
              hint="Opcional. Si no se sube, solo se ve la capa de color."
            />
            {form.bgImageUrl && (
              <RangeRow
                label="Imagen — opacidad"
                value={form.bgImageOpacity}
                onChange={(v) => update('bgImageOpacity', v)}
              />
            )}
          </Section>

          <Section title="Capa de color">
            <SelectRow
              label="Tipo"
              value={form.coverType}
              onChange={(v) => update('coverType', v as 'gradient' | 'solid')}
              options={[
                { value: 'gradient', label: 'Gradiente (2 colores)' },
                { value: 'solid', label: 'Color sólido' }
              ]}
            />
            <ColorRow
              label={
                form.coverType === 'gradient'
                  ? 'Color inicial'
                  : 'Color sólido'
              }
              value={form.coverFrom}
              onChange={(v) => update('coverFrom', v)}
            />
            {form.coverType === 'gradient' && (
              <ColorRow
                label="Color final"
                value={form.coverTo}
                onChange={(v) => update('coverTo', v)}
              />
            )}
            <RangeRow
              label="Capa — opacidad"
              value={form.coverOpacity}
              onChange={(v) => update('coverOpacity', v)}
            />
          </Section>

          <Section title="Mancha decorativa — superior derecha">
            <ColorRow
              label="Color"
              value={form.blob1Color}
              onChange={(v) => update('blob1Color', v)}
            />
            <RangeRow
              label="Opacidad"
              value={form.blob1Opacity}
              onChange={(v) => update('blob1Opacity', v)}
            />
          </Section>

          <Section title="Mancha decorativa — inferior izquierda">
            <ColorRow
              label="Color"
              value={form.blob2Color}
              onChange={(v) => update('blob2Color', v)}
            />
            <RangeRow
              label="Opacidad"
              value={form.blob2Opacity}
              onChange={(v) => update('blob2Opacity', v)}
            />
          </Section>
        </aside>
      </div>
    </div>
  );
}

function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5 pb-5 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
      <h3 className="font-mono text-[10px] tracking-widest uppercase text-gray-500 mb-3">
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function ColorRow({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-xs">
      <span className="text-gray-700">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-12 cursor-pointer rounded border border-gray-200"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 rounded border border-gray-200 px-2 py-1 font-mono text-[11px]"
        />
      </span>
    </label>
  );
}

function RangeRow({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="flex items-center justify-between text-gray-700">
        {label}
        <span className="font-mono text-[11px] text-gray-500">{value}%</span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-brand-500"
      />
    </label>
  );
}

function SelectRow({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-gray-200 px-2 py-1.5 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
