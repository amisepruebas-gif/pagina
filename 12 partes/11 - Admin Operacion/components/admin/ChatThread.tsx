"use client";
import { useState } from "react";
import { Button, Textarea } from "@/components";
import type { ChatThread as ChatThreadType } from "@/lib/admin-ops";

export interface ChatThreadProps {
  thread: ChatThreadType;
  onToggleOpen?: (id: string) => void;
  onSendReply?: (id: string, text: string) => void;
}

/** ChatThread — conversación abierta con burbujas + área de respuesta + acciones. */
export function ChatThread({ thread, onToggleOpen, onSendReply }: ChatThreadProps) {
  const [reply, setReply] = useState("");
  return (
    <section className="bg-surface border border-border rounded-lg flex flex-col min-h-0 min-w-0">
      <div className="p-3.5 flex justify-between items-center border-b border-border gap-2.5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="size-9 rounded-full shrink-0 bg-brand-grad text-white inline-flex items-center justify-center
                           font-display font-bold text-xs">{thread.customer.initials}</span>
          <div>
            <div className="font-display font-semibold text-sm">{thread.customer.name}</div>
            <div className="text-[11px] text-text-soft">
              {thread.open ? "Chat abierto" : "Chat cerrado"} · {thread.messages.length} mensajes
            </div>
          </div>
        </div>
        <div className="flex gap-1.5">
          <Button size="sm" variant="ghost" leadingIcon="user">Ver perfil</Button>
          <Button size="sm" variant={thread.open ? "secondary" : "primary"}
                  leadingIcon={thread.open ? "x" : "check"}
                  onClick={() => onToggleOpen?.(thread.id)}>
            {thread.open ? "Cerrar chat" : "Reabrir chat"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-[18px] flex flex-col gap-2.5">
        {thread.messages.length === 0 ? (
          <div className="m-auto text-text-soft text-[13px] text-center">
            No hay mensajes en esta conversación todavía.
          </div>
        ) : (
          thread.messages.map((m) => {
            const isStaff = m.from === "staff";
            return (
              <div key={m.id}
                   className={`max-w-[75%] flex flex-col ${isStaff ? "self-end items-end" : "self-start items-start"}`}>
                <div
                  className={`px-3.5 py-2.5 rounded-[14px] text-sm leading-relaxed
                              ${isStaff
                                ? "bg-brand-500 text-white rounded-br-[4px]"
                                : "bg-surface-2 text-text rounded-bl-[4px]"}`}>
                  {m.text}
                </div>
                <div className="mt-1 text-[10px] text-text-soft font-mono">{m.at}</div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-3 border-t border-border flex gap-2 items-end">
        <div className="flex-1 min-w-0">
          <Textarea rows={1} value={reply} onChange={(e) => setReply(e.target.value)}
                    placeholder="Escribe tu respuesta…" />
        </div>
        <Button leadingIcon="arr-right" disabled={!reply.trim()}
                onClick={() => { onSendReply?.(thread.id, reply); setReply(""); }}>
          Enviar
        </Button>
      </div>
    </section>
  );
}
