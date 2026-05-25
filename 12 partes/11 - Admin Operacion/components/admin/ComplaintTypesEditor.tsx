"use client";
import { useState } from "react";
import { Button, IconButton, Input } from "@/components";
import { COMPLAINT_TYPES, type ComplaintType } from "@/lib/admin-ops";

/**
 * ComplaintTypesEditor — editor inline del catálogo de tipos de queja.
 *
 * Cada tipo tiene nombre + auto-respuesta opcional usada como plantilla
 * cuando el cliente abre un ticket de ese tipo.
 */
export function ComplaintTypesEditor() {
  const [list, setList] = useState<ComplaintType[]>(COMPLAINT_TYPES);
  const [name, setName] = useState("");
  const [reply, setReply] = useState("");

  return (
    <div className="p-6">
      <div className="bg-surface border border-border rounded-lg p-5">
        <div className="flex gap-2.5 items-end flex-wrap mb-4">
          <div className="flex-1 min-w-[200px]">
            <Input label="Nombre del tipo" placeholder="Ej: Producto defectuoso"
                   value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex-1 min-w-[240px]" style={{ flex: 2 }}>
            <Input label="Auto-respuesta (opcional)"
                   placeholder="Mensaje sugerido al cliente al abrir este tipo"
                   value={reply} onChange={(e) => setReply(e.target.value)} />
          </div>
          <Button leadingIcon="plus" disabled={!name}
                  onClick={() => {
                    setList((arr) => [...arr, { id: `ct${Date.now()}`, name, autoReply: reply }]);
                    setName(""); setReply("");
                  }}>Agregar</Button>
        </div>

        <div className="border-t border-border pt-2 flex flex-col gap-1">
          {list.map((t) => (
            <div key={t.id}
                 className="grid gap-3 grid-cols-[220px_1fr_auto] px-3 py-2.5 rounded-sm hover:bg-surface-2 transition">
              <span className="font-display font-semibold text-sm">{t.name}</span>
              <span className="text-xs text-text-soft truncate">
                {t.autoReply || <em className="opacity-60">sin auto-respuesta</em>}
              </span>
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
    </div>
  );
}
