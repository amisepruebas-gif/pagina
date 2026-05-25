"use client";
import { useState } from "react";
import { Badge, Input, Pill } from "@/components";
import type { ChatThread } from "@/lib/admin-ops";
import { cn } from "@/lib/cn";

export interface ChatInboxProps {
  chats: ChatThread[];
  selectedId: string;
  onSelect: (chat: ChatThread) => void;
}

/** ChatInbox — lista lateral de conversaciones con búsqueda y filtros. */
export function ChatInbox({ chats, selectedId, onSelect }: ChatInboxProps) {
  const [filter, setFilter] = useState<"all" | "open" | "unread" | "closed">("all");
  const filtered = chats.filter((c) => {
    if (filter === "open")   return c.open;
    if (filter === "closed") return !c.open;
    if (filter === "unread") return c.unread > 0;
    return true;
  });

  return (
    <aside className="bg-surface border border-border rounded-lg flex flex-col overflow-hidden min-w-0">
      <div className="p-3 border-b border-border">
        <Input leadingIcon="search" placeholder="Buscar…" className="!h-9" />
        <div className="inline-flex gap-1.5 mt-2.5 flex-wrap">
          <Pill active={filter === "all"}    onClick={() => setFilter("all")}>Todos</Pill>
          <Pill active={filter === "open"}   onClick={() => setFilter("open")}>Abiertos</Pill>
          <Pill active={filter === "unread"} onClick={() => setFilter("unread")}>Sin leer</Pill>
          <Pill active={filter === "closed"} onClick={() => setFilter("closed")}>Cerrados</Pill>
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        {filtered.map((c) => {
          const active = selectedId === c.id;
          return (
            <button key={c.id} type="button" onClick={() => onSelect(c)}
              className={cn(
                "w-full px-3.5 py-3 border-0 cursor-pointer text-left border-b border-border",
                "transition-colors duration-fast ease-out flex gap-3 items-start",
                active ? "bg-brand-50" : "bg-transparent hover:bg-surface-2",
              )}>
              <span className="size-9 rounded-full shrink-0 bg-brand-grad text-white inline-flex items-center justify-center
                               font-display font-bold text-xs">{c.customer.initials}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-display font-semibold text-[13px] truncate">{c.customer.name}</span>
                  <span className="text-[10px] text-text-soft font-mono shrink-0">{c.at}</span>
                </div>
                <div className="mt-0.5 text-xs text-text-muted line-clamp-1">{c.last}</div>
                <div className="mt-1.5 inline-flex gap-1.5 items-center">
                  {!c.open && <Badge tone="neutral" size="xs">Cerrado</Badge>}
                  {c.unread > 0 && (
                    <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-secondary text-white
                                     text-[10px] font-display font-bold inline-flex items-center justify-center">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
