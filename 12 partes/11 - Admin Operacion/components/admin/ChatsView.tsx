"use client";
import { useState } from "react";
import { AdminPageHeader } from "./AdminPageHeader";
import { ChatInbox } from "./ChatInbox";
import { ChatThread as ChatThreadView } from "./ChatThread";
import { ADMIN_CHATS, type ChatThread } from "@/lib/admin-ops";

/**
 * ChatsView — composición Inbox + Thread.
 * Layout 320px + 1fr en desktop; en móvil se apila (thread debajo).
 */
export function ChatsView() {
  const [selected, setSelected] = useState<ChatThread>(ADMIN_CHATS[0]);

  const unread = ADMIN_CHATS.reduce((s, c) => s + c.unread, 0);

  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Chats" }]}
        title="Chats"
        description={`${ADMIN_CHATS.length} conversaciones · ${unread} sin leer`}
      />
      <div className="p-6 grid gap-4 min-h-[480px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]
                      lg:h-[calc(100vh-56px-110px)]">
        <div className="max-h-[320px] lg:max-h-none lg:h-auto">
          <ChatInbox chats={ADMIN_CHATS} selectedId={selected.id} onSelect={setSelected} />
        </div>
        <div className="min-h-[480px]">
          <ChatThreadView thread={selected} />
        </div>
      </div>
    </>
  );
}
