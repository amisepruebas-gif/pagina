"use client";
import { useState } from "react";
import { Button, Icon, Input, Select } from "@/components";
import {
  MODULE_TYPES, DEFAULT_VIEW_MODULES, type AdminView, type ViewModule, type ViewModuleType,
} from "@/lib/admin-rest";
import { AdminPageHeader } from "./AdminPageHeader";
import { FormSection, FlagRow } from "./FormSection";
import { ModuleCard } from "./ModuleCard";
import { GradientPicker } from "./GradientPicker";

export interface ViewEditorProps {
  view?: AdminView;
  onBack: () => void;
}

/**
 * ViewEditor — constructor de vistas dinámicas.
 *
 * Layout: lista de módulos reordenables (izq) + ajustes de la vista (der sticky).
 * Cada `<ModuleCard/>` abre su propio panel de edición según el tipo.
 * Barra de guardado sticky abajo.
 */
export function ViewEditor({ view, onBack }: ViewEditorProps) {
  const isNew = !view;
  const [name, setName]       = useState(view?.name ?? "Nueva vista");
  const [slug, setSlug]       = useState(view?.slug ?? "nueva-vista");
  const [active, setActive]   = useState(view?.active ?? false);
  const [modules, setModules] = useState<ViewModule[]>(DEFAULT_VIEW_MODULES);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAdd, setShowAdd]   = useState(false);

  const move = (i: number, delta: number) => {
    if (i + delta < 0 || i + delta >= modules.length) return;
    setModules((arr) => {
      const next = [...arr];
      [next[i], next[i + delta]] = [next[i + delta], next[i]];
      return next;
    });
  };
  const remove = (id: string) => setModules((arr) => arr.filter((m) => m.id !== id));
  const toggleVisible = (id: string) =>
    setModules((arr) => arr.map((m) => m.id === id ? { ...m, visible: !m.visible } : m));
  const addModule = (type: ViewModuleType) => {
    const mt = MODULE_TYPES.find((x) => x.id === type)!;
    setModules((arr) => [...arr, { id: `m${Date.now()}`, type, title: mt.label, visible: true }]);
    setShowAdd(false);
  };

  return (
    <>
      <AdminPageHeader
        breadcrumb={[
          { label: "Admin",  href: "/admin" },
          { label: "Vistas", href: "/admin/vistas" },
          { label: isNew ? "Nueva" : view?.name ?? "Editar" },
        ]}
        title={isNew ? "Nueva vista dinámica" : `Editar — ${view?.name}`}
        description={`URL pública: /v/${slug}`}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" leadingIcon="eye">Vista previa</Button>
            <Button variant="secondary" leadingIcon="arr-left" onClick={onBack}>Volver</Button>
          </div>
        }
      />

      <div className="p-6 pb-[100px] grid gap-5 items-start xl:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex justify-between items-center gap-2.5 flex-wrap">
            <h3 className="font-display font-bold text-lg">Módulos ({modules.length})</h3>
            <Button leadingIcon="plus" onClick={() => setShowAdd(!showAdd)}>
              {showAdd ? "Cancelar" : "Agregar módulo"}
            </Button>
          </div>

          {showAdd && (
            <div className="p-4 bg-brand-50 border-[1.5px] border-dashed border-brand-500 rounded-md">
              <div className="font-mono text-[11px] tracking-[0.06em] uppercase text-brand-700 font-bold mb-2.5">
                Elige un tipo de módulo
              </div>
              <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
                {MODULE_TYPES.map((mt) => (
                  <button key={mt.id} type="button" onClick={() => addModule(mt.id)}
                    className="flex items-center gap-2.5 px-3.5 py-3 min-h-12 bg-surface border border-border
                               rounded-sm cursor-pointer font-display font-semibold text-[13px] text-text
                               transition hover:border-brand-500 hover:bg-white">
                    <Icon name={mt.icon} size={16} strokeWidth={2} className="text-brand-700" />
                    {mt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {modules.map((m, i) => (
            <ModuleCard key={m.id} module={m} index={i}
              expanded={expanded === m.id}
              onToggleExpand={() => setExpanded(expanded === m.id ? null : m.id)}
              onMove={(d) => move(i, d)}
              onToggleVisible={() => toggleVisible(m.id)}
              onRemove={() => remove(m.id)}
              isFirst={i === 0} isLast={i === modules.length - 1}
            >
              <ModuleEditor module={m} />
            </ModuleCard>
          ))}
        </div>

        <aside className="xl:sticky xl:top-6 bg-surface border border-border rounded-lg p-5
                          flex flex-col gap-3.5">
          <h3 className="font-display font-bold text-[15px]">Ajustes de la vista</h3>
          <Input label="Nombre" required value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Slug" leadingIcon="tag" required value={slug} onChange={(e) => setSlug(e.target.value)}
                 hint="Sin espacios. Aparece en la URL." />
          <FlagRow checked={active} onChange={setActive}
                   title="Vista activa" subtitle="Si está inactiva, la URL devuelve 404." />
        </aside>
      </div>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-surface border-t border-border
                      px-6 py-3 flex justify-end gap-2 shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.12)]">
        <Button variant="ghost" onClick={onBack}>Descartar</Button>
        <Button trailingIcon="check">Guardar cambios</Button>
      </div>
    </>
  );
}

function ModuleEditor({ module }: { module: ViewModule }) {
  const t = module.type;
  if (t === "slider") {
    return (
      <div className="flex flex-col gap-3.5">
        <Input label="Título del módulo" defaultValue={module.title} />
        <FlagRow checked onChange={() => {}} title="Autoplay" subtitle="Rotación automática cada 5s." />
        <div className="p-3.5 border border-dashed border-border-strong rounded-sm text-center text-text-soft text-[13px]">
          Slides del carrusel — agrégalos uno por uno con título, subtítulo y CTA.
        </div>
      </div>
    );
  }
  if (t === "products") {
    return (
      <div className="flex flex-col gap-3.5">
        <Input label="Encabezado" defaultValue={module.title} />
        <Input label="Subtítulo" placeholder="Opcional" />
        <Select label="Origen" options={["Manual", "Categoría", "Etiqueta", "Más vendidos"]} />
      </div>
    );
  }
  if (t === "promo") {
    return (
      <div className="flex flex-col gap-3.5">
        <Input label="Título" defaultValue={module.title} />
        <Input label="Badge" placeholder="OFERTA / -50%" />
        <GradientPicker value="g2" onChange={() => {}} label="Fondo" />
        <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
          <Input label="Termina el" type="datetime-local" />
          <Input label="Productos (IDs)" placeholder="Selecciona…" leadingIcon="tag" />
        </div>
      </div>
    );
  }
  if (t === "banners") {
    return (
      <div className="flex flex-col gap-3.5">
        <Select label="Columnas" options={[{ value: "2", label: "2 columnas" }, { value: "3", label: "3 columnas" }]} />
        <div className="p-3.5 border border-dashed border-border-strong rounded-sm text-center text-text-soft text-[13px]">
          Banners — agrega varios, cada uno con título, subtítulo, CTA y fondo.
        </div>
      </div>
    );
  }
  if (t === "categories") {
    return (
      <div className="flex flex-col gap-3.5">
        <Input label="Encabezado" defaultValue={module.title} />
        <Select label="Origen" options={["Todas las categorías", "Selección manual"]} />
      </div>
    );
  }
  if (t === "video") {
    return (
      <div className="flex flex-col gap-3.5">
        <Input label="Título" defaultValue={module.title} />
        <Select label="Proveedor" options={["YouTube", "Vimeo", "Archivo"]} />
        <Input label="URL del video" placeholder="https://…" leadingIcon="eye" />
      </div>
    );
  }
  return null;
}
