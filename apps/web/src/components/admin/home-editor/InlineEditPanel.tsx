'use client';

import type { IconName } from '@/components/ui';
import {
  HOME_SECTION_LABELS,
  isNativeBlock,
  type HomeSectionId
} from '@/types/home-config';
import ImageInput from '../ImageInput';
import ProductPickerButton from '../ProductPickerButton';
import CategoryMultiPicker from '../CategoryMultiPicker';
import { useHomeEdit } from './HomeEditContext';
import { FIELD_REGISTRY, type FieldDef } from './field-registry';
import { ModuleEditor } from './ModuleEditor';
import {
  ColorInput,
  Field,
  IconSelect,
  NumberInput,
  RangeInput,
  SelectInput,
  TextAreaInput,
  TextInput
} from './editor-widgets';

/** Editor de un campo array (estadísticas, tarjetas, beneficios…). */
function ArrayEditor({ field }: { field: FieldDef }) {
  const {
    getField,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
    onImageUploaded,
    onImageReplaced
  } = useHomeEdit();
  const items = getField(field.path);
  const itemFields = field.itemFields ?? [];

  if (!Array.isArray(items)) return null;

  /** Antes de quitar un item, anota las imágenes que se perderán. */
  const removeItem = (index: number) => {
    const item = (items[index] ?? {}) as Record<string, unknown>;
    for (const sub of itemFields) {
      if (sub.type === 'image' && typeof item[sub.key] === 'string') {
        onImageReplaced(item[sub.key] as string);
      }
    }
    removeArrayItem(field.path, index);
  };

  return (
    <div>
      <span className="mb-2 block text-[12px] font-semibold text-gray-600">
        {field.label}
      </span>
      <div className="space-y-3">
        {items.map((item, index) => {
          const record = (item ?? {}) as Record<string, unknown>;
          return (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-gray-50/60 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {field.itemNoun ?? 'Elemento'} {index + 1}
                </span>
                {field.addable && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    Quitar
                  </button>
                )}
              </div>
              <div className="space-y-2.5">
                {itemFields.map((sub) => {
                  const subValue = record[sub.key];
                  if (sub.type === 'image') {
                    return (
                      <Field key={sub.key} label={sub.label}>
                        <ImageInput
                          value={String(subValue ?? '')}
                          onChange={(url) =>
                            updateArrayItem(field.path, index, sub.key, url)
                          }
                          onUploaded={onImageUploaded}
                          onReplace={onImageReplaced}
                        />
                      </Field>
                    );
                  }
                  if (sub.type === 'icon') {
                    return (
                      <Field key={sub.key} label={sub.label}>
                        <IconSelect
                          value={(subValue as IconName) ?? 'spark'}
                          onChange={(v) =>
                            updateArrayItem(field.path, index, sub.key, v)
                          }
                        />
                      </Field>
                    );
                  }
                  if (sub.type === 'color') {
                    return (
                      <Field key={sub.key} label={sub.label}>
                        <ColorInput
                          value={String(subValue ?? '')}
                          onChange={(v) =>
                            updateArrayItem(field.path, index, sub.key, v)
                          }
                        />
                      </Field>
                    );
                  }
                  if (sub.type === 'textarea') {
                    return (
                      <Field key={sub.key} label={sub.label}>
                        <TextAreaInput
                          value={String(subValue ?? '')}
                          placeholder={sub.placeholder}
                          onChange={(v) =>
                            updateArrayItem(field.path, index, sub.key, v)
                          }
                        />
                      </Field>
                    );
                  }
                  return (
                    <Field key={sub.key} label={sub.label}>
                      <TextInput
                        value={String(subValue ?? '')}
                        placeholder={sub.placeholder}
                        onChange={(v) =>
                          updateArrayItem(field.path, index, sub.key, v)
                        }
                      />
                    </Field>
                  );
                })}
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="rounded-lg border border-dashed border-gray-200 py-3 text-center text-[12px] text-gray-400">
            Sin elementos todavía.
          </p>
        )}
      </div>
      {field.addable && (
        <button
          type="button"
          onClick={() => addArrayItem(field.path, field.newItem ?? {})}
          className="mt-2 w-full rounded-lg border border-dashed border-blue-300 py-2 text-[13px] font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          + Agregar {(field.itemNoun ?? 'elemento').toLowerCase()}
        </button>
      )}
    </div>
  );
}

/** Enruta cada definición de campo a su control de edición. */
function FieldWidget({ field }: { field: FieldDef }) {
  const { getField, setField, onImageUploaded, onImageReplaced } =
    useHomeEdit();
  const value = getField(field.path);

  if (field.type === 'array') {
    return <ArrayEditor field={field} />;
  }
  if (field.type === 'image') {
    return (
      <Field label={field.label}>
        <ImageInput
          value={String(value ?? '')}
          onChange={(url) => setField(field.path, url)}
          onUploaded={onImageUploaded}
          onReplace={onImageReplaced}
        />
      </Field>
    );
  }
  if (field.type === 'products') {
    return (
      <Field label={field.label}>
        <ProductPickerButton
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={(ids) => setField(field.path, ids)}
        />
      </Field>
    );
  }
  if (field.type === 'categories') {
    return (
      <Field label={field.label}>
        <CategoryMultiPicker
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={(ids) => setField(field.path, ids)}
        />
      </Field>
    );
  }
  if (field.type === 'number') {
    return (
      <Field label={field.label}>
        <NumberInput
          value={Number(value ?? 0)}
          min={field.min}
          max={field.max}
          onChange={(v) => setField(field.path, v)}
        />
      </Field>
    );
  }
  if (field.type === 'range') {
    return (
      <Field label={field.label}>
        <RangeInput
          value={Number(value ?? 0)}
          min={field.min}
          max={field.max}
          onChange={(v) => setField(field.path, v)}
        />
      </Field>
    );
  }
  if (field.type === 'color') {
    return (
      <Field label={field.label}>
        <ColorInput
          value={String(value ?? '')}
          onChange={(v) => setField(field.path, v)}
        />
      </Field>
    );
  }
  if (field.type === 'select') {
    return (
      <Field label={field.label}>
        <SelectInput
          value={String(value ?? '')}
          options={field.options ?? []}
          onChange={(v) => setField(field.path, v)}
        />
      </Field>
    );
  }
  if (field.type === 'textarea') {
    return (
      <Field label={field.label}>
        <TextAreaInput
          value={String(value ?? '')}
          placeholder={field.placeholder}
          onChange={(v) => setField(field.path, v)}
        />
      </Field>
    );
  }
  return (
    <Field label={field.label}>
      <TextInput
        value={String(value ?? '')}
        placeholder={field.placeholder}
        onChange={(v) => setField(field.path, v)}
      />
    </Field>
  );
}

/** ¿El campo cumple su condición de visibilidad? Si no tiene, siempre se muestra. */
function shouldShow(field: FieldDef, getField: (path: string) => unknown): boolean {
  if (!field.showIf) return true;
  const value = getField(field.showIf.path);
  if ('equals' in field.showIf) return value === field.showIf.equals;
  if (field.showIf.truthy) return Boolean(value);
  return true;
}

/** Editor de una sección nativa del Home (Hero, barra de confianza, …). */
function NativeSectionEditor({ sectionId }: { sectionId: HomeSectionId }) {
  const { getField } = useHomeEdit();
  const fields = FIELD_REGISTRY[sectionId];
  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 border-b border-gray-200 px-4 py-3">
        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-500">
          Sección
        </div>
        <h2 className="text-[15px] font-bold text-gray-900">
          {HOME_SECTION_LABELS[sectionId]}
        </h2>
      </header>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {fields.map((field) =>
          shouldShow(field, getField) ? (
            <FieldWidget key={field.path} field={field} />
          ) : null
        )}
      </div>
    </div>
  );
}

function EmptyHint() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-blue-50 text-2xl">
        👆
      </div>
      <p className="text-sm font-semibold text-gray-700">
        Selecciona un bloque
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
        Haz clic en una sección del preview o en un bloque de la lista de
        Estructura para editar su contenido aquí.
      </p>
    </div>
  );
}

/**
 * InlineEditPanel — panel derecho del editor. Muestra los campos del bloque
 * seleccionado: una sección nativa o un módulo agregado.
 */
export function InlineEditPanel() {
  const { selectedRef, form } = useHomeEdit();

  if (!selectedRef) return <EmptyHint />;

  if (selectedRef === 'hero' || isNativeBlock(selectedRef)) {
    return <NativeSectionEditor sectionId={selectedRef as HomeSectionId} />;
  }

  const module = form.modules.find((m) => m.id === selectedRef);
  if (module) return <ModuleEditor module={module} />;

  return <EmptyHint />;
}
