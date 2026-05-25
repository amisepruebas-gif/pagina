"use client";
import { type ReactNode } from "react";
import { Button } from "@/components";
import { AdminPageHeader, type AdminCrumb } from "./AdminPageHeader";

export interface FormShellProps {
  title: string;
  description?: string;
  breadcrumb?: AdminCrumb[];
  onSave: () => void;
  saving?: boolean;
  onCancel: () => void;
  children: ReactNode;
}

/**
 * FormShell — wrapper de formularios del admin con header
 * (breadcrumb + título + acciones Save/Cancel) y card de contenido.
 */
export function FormShell({
  title, description, breadcrumb, onSave, saving, onCancel, children,
}: FormShellProps) {
  return (
    <>
      <AdminPageHeader
        title={title} description={description} breadcrumb={breadcrumb}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
            <Button onClick={onSave} loading={saving} trailingIcon="check">Guardar</Button>
          </div>
        }
      />
      <div className="p-6">
        <div className="max-w-4xl bg-surface border border-border rounded-lg px-6 pt-2 pb-6">
          {children}
        </div>
      </div>
    </>
  );
}
