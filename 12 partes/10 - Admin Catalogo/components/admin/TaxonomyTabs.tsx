"use client";
import { useState } from "react";
import { Button, Input, IconButton, Pill, Select } from "@/components";
import {
  ADMIN_CATEGORIES, SUBCATEGORIES_MAP, ADMIN_TAGS, ADMIN_MATERIALS,
  type AdminTag, type AdminMaterial,
} from "@/lib/admin-catalog";
import { InlineEditRow } from "./InlineEditRow";

/**
 * TaxonomyTabs — editor inline de taxonomías:
 * Subcategorías (por categoría), Etiquetas (con color), Materiales.
 */
export function TaxonomyTabs() {
  const [tab, setTab] = useState<"subcategorias" | "etiquetas" | "materiales">("subcategorias");
  return (
    <div className="p-6">
      <div className="inline-flex gap-1.5 mb-4 flex-wrap">
        <Pill active={tab === "subcategorias"} onClick={() => setTab("subcategorias")}>Subcategorías</Pill>
        <Pill active={tab === "etiquetas"}     onClick={() => setTab("etiquetas")}>Etiquetas</Pill>
        <Pill active={tab === "materiales"}    onClick={() => setTab("materiales")}>Materiales</Pill>
      </div>
      {tab === "subcategorias" && <SubcategoriesEditor />}
      {tab === "etiquetas"     && <TagsEditor />}
      {tab === "materiales"    && <MaterialsEditor />}
    </div>
  );
}

function SubcategoriesEditor() {
  const [cat, setCat] = useState("ropa");
  const [items, setItems] = useState<Record<string, string[]>>({ ...SUBCATEGORIES_MAP });
  const [newName, setNewName] = useState("");
  const list = items[cat] ?? [];

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <div className="flex gap-3 items-end flex-wrap mb-4">
        <div className="flex-1 min-w-[200px] max-w-[260px]">
          <Select label="Categoría padre"
                  options={ADMIN_CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))}
                  value={cat} onChange={(e) => setCat(e.target.value)} />
        </div>
        <div className="flex-1 min-w-[200px]">
          <Input label="Nueva subcategoría" value={newName} onChange={(e) => setNewName(e.target.value)}
                 placeholder="Ej: Botines" />
        </div>
        <Button leadingIcon="plus" disabled={!newName} onClick={() => {
          setItems((m) => ({ ...m, [cat]: [...(m[cat] ?? []), newName] }));
          setNewName("");
        }}>Agregar</Button>
      </div>

      <div className="border-t border-border pt-3">
        {list.length === 0 ? (
          <div className="py-6 text-center text-text-soft text-sm">
            Sin subcategorías. Agrega la primera arriba.
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {list.map((s, i) => (
              <InlineEditRow key={`${cat}-${i}-${s}`} value={s}
                onSave={(v) => setItems((m) => ({ ...m, [cat]: (m[cat] ?? []).map((x, j) => j === i ? v : x) }))}
                onDelete={() => setItems((m) => ({ ...m, [cat]: (m[cat] ?? []).filter((_, j) => j !== i) }))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TagsEditor() {
  const [list, setList] = useState<AdminTag[]>(ADMIN_TAGS);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#00C853");

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <div className="flex gap-2.5 items-end flex-wrap mb-4">
        <div className="flex-1 min-w-[200px]">
          <Input label="Nueva etiqueta" value={newName} onChange={(e) => setNewName(e.target.value)}
                 placeholder="Ej: Imperdible" />
        </div>
        <div>
          <div className="font-display font-semibold text-[13px] mb-1.5">Color</div>
          <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)}
                 className="size-12 p-0.5 border-[1.5px] border-border-strong rounded-sm cursor-pointer bg-surface" />
        </div>
        <Button leadingIcon="plus" disabled={!newName} onClick={() => {
          setList((arr) => [...arr, { id: `t${Date.now()}`, name: newName, color: newColor }]);
          setNewName("");
        }}>Agregar</Button>
      </div>

      <div className="border-t border-border pt-3 flex flex-col gap-1">
        {list.map((t) => (
          <div key={t.id} className="flex items-center gap-2.5 p-2 rounded-sm hover:bg-surface-2 transition">
            <span className="size-4 rounded-full shrink-0 border border-border"
                  style={{ background: t.color }} />
            <span className="flex-1 font-display font-medium text-sm">{t.name}</span>
            <span className="font-mono text-[11px] text-text-soft">{t.color}</span>
            <div className="inline-flex gap-0.5">
              <IconButton variant="ghost" icon="grid" label="Editar" size="sm" />
              <IconButton variant="ghost" icon="x"    label="Eliminar" size="sm"
                          onClick={() => setList((arr) => arr.filter((x) => x.id !== t.id))}
                          className="!text-error" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MaterialsEditor() {
  const [list, setList] = useState<AdminMaterial[]>(ADMIN_MATERIALS);
  const [newName, setNewName] = useState("");
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <div className="flex gap-2.5 items-end flex-wrap mb-4">
        <div className="flex-1 min-w-[200px] max-w-[320px]">
          <Input label="Nuevo material" value={newName} onChange={(e) => setNewName(e.target.value)}
                 placeholder="Ej: Bambú" />
        </div>
        <Button leadingIcon="plus" disabled={!newName} onClick={() => {
          setList((arr) => [...arr, { id: `m${Date.now()}`, name: newName }]);
          setNewName("");
        }}>Agregar</Button>
      </div>

      <div className="border-t border-border pt-3
                      grid gap-1.5 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        {list.map((m) => (
          <InlineEditRow key={m.id} value={m.name}
            onSave={(v) => setList((arr) => arr.map((x) => x.id === m.id ? { ...x, name: v } : x))}
            onDelete={() => setList((arr) => arr.filter((x) => x.id !== m.id))}
          />
        ))}
      </div>
    </div>
  );
}
