"use client";
import { useState } from "react";
import { Badge, Button, IconButton, Input, Select } from "@/components";
import { ADMIN_USERS, ROLE_LABEL, type AdminUser, type UserRole } from "@/lib/admin-rest";
import { DataTable } from "./DataTable";

/** UsersTable — listado de usuarios con cambio inline de rol + filtros. */
export function UsersTable({ users = ADMIN_USERS }: { users?: AdminUser[] }) {
  const [list, setList] = useState<AdminUser[]>(users);
  const [filter, setFilter] = useState<{ q: string; role: UserRole | "all"; status: "all" | "active" | "inactive" }>({
    q: "", role: "all", status: "all",
  });

  const filtered = list.filter((u) => {
    if (filter.q) {
      const q = filter.q.toLowerCase();
      if (!u.email.toLowerCase().includes(q) && !u.name.toLowerCase().includes(q)) return false;
    }
    if (filter.role !== "all"   && u.role !== filter.role) return false;
    if (filter.status === "active"   && !u.active) return false;
    if (filter.status === "inactive" &&  u.active) return false;
    return true;
  });

  const changeRole   = (id: string, role: UserRole) => setList((arr) => arr.map((u) => u.id === id ? { ...u, role } : u));
  const toggleActive = (id: string) => setList((arr) => arr.map((u) => u.id === id ? { ...u, active: !u.active } : u));

  return (
    <div className="p-6 flex flex-col gap-3.5">
      <div className="flex gap-2.5 flex-wrap items-center p-3 bg-surface border border-border rounded-md">
        <div className="flex-1 min-w-[200px] max-w-[320px]">
          <Input leadingIcon="search" placeholder="Buscar por nombre o email…"
                 value={filter.q} onChange={(e) => setFilter({ ...filter, q: e.target.value })}
                 className="!h-9" />
        </div>
        <div className="w-[180px]">
          <Select value={filter.role}
                  onChange={(e) => setFilter({ ...filter, role: e.target.value as any })}
                  options={[{ value: "all", label: "Todos los roles" },
                            ...(Object.entries(ROLE_LABEL) as [UserRole, { label: string; tone: any }][]).map(
                              ([k, v]) => ({ value: k, label: v.label }))]}
                  className="!h-9" />
        </div>
        <div className="w-[160px]">
          <Select value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value as any })}
                  options={[
                    { value: "all",      label: "Todos los estados" },
                    { value: "active",   label: "Activos" },
                    { value: "inactive", label: "Inactivos" },
                  ]} className="!h-9" />
        </div>
      </div>

      <DataTable<AdminUser>
        columns={[
          { key: "name", label: "Usuario", render: (r) => (
            <div className="flex items-center gap-2.5">
              <span className="size-9 rounded-full shrink-0 bg-brand-grad text-white inline-flex items-center justify-center
                               font-display font-bold text-xs">{r.initials}</span>
              <div>
                <div className="font-display font-semibold inline-flex items-center gap-1.5">
                  {r.name}
                  {r.isMe && <Badge tone="brand" size="xs">tú</Badge>}
                </div>
                <div className="text-xs text-text-soft">{r.email}</div>
              </div>
            </div>
          )},
          { key: "role", label: "Rol", width: "160px", render: (r) => (
            <select value={r.role} disabled={r.isMe}
                    onChange={(e) => changeRole(r.id, e.target.value as UserRole)}
                    className="px-3 py-1 pr-8 bg-surface border border-border-strong rounded-pill
                               text-xs font-display font-semibold text-text cursor-pointer
                               disabled:opacity-60 disabled:cursor-not-allowed">
              {(Object.entries(ROLE_LABEL) as [UserRole, { label: string; tone: any }][]).map(
                ([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          )},
          { key: "methods", label: "Acceso", render: (r) => (
            <div className="inline-flex gap-1 flex-wrap">
              {r.methods.map((m) => (
                <span key={m} className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold
                                         bg-surface-2 text-text-muted uppercase tracking-wider">
                  {m}
                </span>
              ))}
            </div>
          )},
          { key: "lastSeen", label: "Última vez", render: (r) => <span className="text-xs text-text-soft">{r.lastSeen}</span> },
          { key: "active", label: "Estado", render: (r) =>
            r.active ? <Badge tone="success" size="xs">Activo</Badge> : <Badge tone="neutral" size="xs">Inactivo</Badge> },
          { key: "actions", label: "", align: "right", width: "180px", render: (r) => (
            <div className="inline-flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => toggleActive(r.id)} disabled={r.isMe}>
                {r.active ? "Desactivar" : "Activar"}
              </Button>
              <IconButton variant="ghost" icon="grid" label="Ver perfil" size="sm" />
            </div>
          )},
        ]}
        rows={filtered}
      />
    </div>
  );
}
