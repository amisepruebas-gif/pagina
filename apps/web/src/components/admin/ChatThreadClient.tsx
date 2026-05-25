'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  type DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
  sendStaffMessage,
  markChatReadByStaff,
  setChatStatus
} from '@/lib/admin/chats-admin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Badge, Button, Textarea } from '@/components/ui';
import type {
  Chat,
  ChatMessage,
  RawChatDoc,
  RawChatMessageDoc
} from '@/types/chat';

function normalizeChat(id: string, data: DocumentData): Chat {
  const raw = data as RawChatDoc;
  return {
    id,
    userId: raw.userId,
    guestName: raw.guestName,
    guestEmail: raw.guestEmail,
    subject: raw.subject ?? '(sin asunto)',
    status: raw.status ?? 'open',
    assignedTo: raw.assignedTo,
    lastMessageAt: raw.lastMessageAt?.toDate(),
    lastMessagePreview: raw.lastMessagePreview,
    unreadStaff: raw.unreadStaff ?? 0,
    unreadCustomer: raw.unreadCustomer ?? 0,
    createdAt: raw.createdAt?.toDate()
  };
}

function normalizeMessage(id: string, data: DocumentData): ChatMessage {
  const raw = data as RawChatMessageDoc;
  return {
    id,
    from: raw.from ?? 'customer',
    uid: raw.uid,
    text: raw.text ?? '',
    createdAt: raw.createdAt?.toDate()
  };
}

function getInitials(name?: string, email?: string): string {
  const src = (name || email || '?').trim();
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return src.slice(0, 2).toUpperCase();
}

export default function ChatThreadClient({ id }: { id: string }) {
  const { user } = useAuth();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFoundError] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubChat = onSnapshot(
      doc(db, 'chats', id),
      (snap) => {
        if (!snap.exists()) {
          console.warn('[CHAT] chat no encontrado', id);
          setNotFoundError(true);
          setLoading(false);
          return;
        }
        console.log('[CHAT] snapshot chat', id);
        setChat(normalizeChat(snap.id, snap.data()));
        setLoading(false);
      },
      (err) => {
        console.error('[CHAT] snapshot error', err);
        setLoading(false);
      }
    );

    const unsubMessages = onSnapshot(
      query(collection(db, 'chats', id, 'messages'), orderBy('createdAt', 'asc')),
      (snap) => {
        console.log('[CHAT] messages snapshot', snap.size);
        setMessages(snap.docs.map((d) => normalizeMessage(d.id, d.data())));
      },
      (err) => console.error('[CHAT] messages error', err)
    );

    return () => {
      unsubChat();
      unsubMessages();
    };
  }, [id]);

  // Marcar leído cuando staff abre y hay unread
  useEffect(() => {
    if (chat && chat.unreadStaff > 0) {
      console.log('[CHAT] marcando leído por staff', id);
      markChatReadByStaff(id).catch((err) =>
        console.error('[CHAT] markRead error', err)
      );
    }
  }, [chat, id]);

  // Auto-scroll al fondo cuando llegan nuevos mensajes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!user || sending || !text.trim()) return;
    setSending(true);
    try {
      console.log('[CHAT] enviando mensaje staff', id);
      await sendStaffMessage(id, text, user.uid);
      setText('');
    } catch (err) {
      console.error('[CHAT] send error', err);
      window.alert('Error al enviar mensaje');
    } finally {
      setSending(false);
    }
  }

  async function toggleStatus() {
    if (!chat) return;
    const next = chat.status === 'open' ? 'closed' : 'open';
    if (
      !window.confirm(
        next === 'closed' ? '¿Cerrar este chat?' : '¿Reabrir este chat?'
      )
    )
      return;
    try {
      console.log('[CHAT] cambiando estado a', next, id);
      await setChatStatus(id, next);
    } catch (err) {
      console.error('[CHAT] status error', err);
      window.alert('Error al cambiar estado');
    }
  }

  if (loading) {
    return (
      <>
        <AdminPageHeader
          breadcrumb={[
            { label: 'Admin', href: '/admin' },
            { label: 'Chats', href: '/admin/chats' },
            { label: 'Conversación' }
          ]}
          title="Chat"
        />
        <div className="p-6">
          <div className="rounded-lg border border-border bg-surface px-6 py-12 text-center text-sm text-text-soft">
            Cargando…
          </div>
        </div>
      </>
    );
  }

  if (notFound || !chat) {
    return (
      <>
        <AdminPageHeader
          breadcrumb={[
            { label: 'Admin', href: '/admin' },
            { label: 'Chats', href: '/admin/chats' },
            { label: 'Conversación' }
          ]}
          title="Chat no encontrado"
        />
        <div className="p-6">
          <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center">
            <p className="font-display font-semibold text-text">
              Chat no encontrado.
            </p>
            <Link
              href="/admin/chats"
              className="mt-3 inline-block text-sm font-display font-semibold text-brand-700 hover:underline"
            >
              ← Volver a chats
            </Link>
          </div>
        </div>
      </>
    );
  }

  const contact = chat.guestEmail || chat.userId || '(sin contacto)';

  return (
    <>
      <AdminPageHeader
        breadcrumb={[
          { label: 'Admin', href: '/admin' },
          { label: 'Chats', href: '/admin/chats' },
          { label: chat.subject }
        ]}
        title={chat.subject}
        description={`${chat.guestName || '(sin nombre)'} · ${contact}`}
        action={
          <div className="flex items-center gap-2">
            {chat.status === 'open' ? (
              <Badge tone="success" size="md">
                Abierto
              </Badge>
            ) : (
              <Badge tone="neutral" size="md">
                Cerrado
              </Badge>
            )}
            <Button
              size="sm"
              variant={chat.status === 'open' ? 'secondary' : 'primary'}
              leadingIcon={chat.status === 'open' ? 'x' : 'check'}
              onClick={toggleStatus}
            >
              {chat.status === 'open' ? 'Cerrar chat' : 'Reabrir chat'}
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <section className="bg-surface border border-border rounded-lg flex flex-col min-h-0 h-[calc(100vh-56px-130px-3rem)]">
          {/* Encabezado del hilo */}
          <div className="p-3.5 flex items-center gap-2.5 border-b border-border">
            <span className="size-9 rounded-full shrink-0 bg-brand-grad text-white inline-flex items-center justify-center font-display font-bold text-xs">
              {getInitials(chat.guestName, chat.guestEmail)}
            </span>
            <div className="min-w-0">
              <div className="font-display font-semibold text-sm truncate">
                {chat.guestName || '(sin nombre)'}
              </div>
              <div className="text-[11px] text-text-soft truncate">
                {chat.status === 'open' ? 'Chat abierto' : 'Chat cerrado'} ·{' '}
                {messages.length} mensaje{messages.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-[18px] flex flex-col gap-2.5">
            {messages.length === 0 ? (
              <div className="m-auto text-text-soft text-[13px] text-center max-w-sm">
                Sin mensajes aún. Cuando el cliente escriba o tú respondas,
                aparecerán aquí.
              </div>
            ) : (
              messages.map((m) => {
                const isStaff = m.from === 'staff';
                return (
                  <div
                    key={m.id}
                    className={`max-w-[75%] flex flex-col ${
                      isStaff ? 'self-end items-end' : 'self-start items-start'
                    }`}
                  >
                    <div
                      className={`px-3.5 py-2.5 rounded-[14px] text-sm leading-relaxed whitespace-pre-wrap ${
                        isStaff
                          ? 'bg-brand-500 text-white rounded-br-[4px]'
                          : 'bg-surface-2 text-text rounded-bl-[4px]'
                      }`}
                    >
                      {m.text}
                    </div>
                    <div className="mt-1 text-[10px] text-text-soft font-mono">
                      {m.createdAt?.toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) ?? '...'}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Área de respuesta */}
          {chat.status === 'open' ? (
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-border flex gap-2 items-end"
            >
              <div className="flex-1 min-w-0">
                <Textarea
                  rows={1}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escribe tu respuesta…"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e as unknown as React.FormEvent);
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                leadingIcon="arr-right"
                loading={sending}
                disabled={sending || !text.trim()}
              >
                Enviar
              </Button>
            </form>
          ) : (
            <div className="p-3 border-t border-border text-center text-xs text-text-soft">
              Chat cerrado. Reábrelo para responder.
            </div>
          )}
        </section>
      </div>
    </>
  );
}
