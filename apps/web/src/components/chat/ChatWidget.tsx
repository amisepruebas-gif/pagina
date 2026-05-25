'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  type DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
  createCustomerChat,
  sendCustomerMessage,
  markChatReadByCustomer
} from '@/lib/client/chats-client';
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
    subject: raw.subject ?? '',
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

export default function ChatWidget() {
  const { user, profile, loading: authLoading } = useAuth();
  const [panelOpen, setPanelOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatsLoaded, setChatsLoaded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [subject, setSubject] = useState('');
  const [firstMsg, setFirstMsg] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // No mostrar widget hasta saber auth state
  const hideWidget = authLoading;

  // Suscripción a chats del usuario (todos, filtramos en memoria)
  useEffect(() => {
    if (!user) {
      setChats([]);
      setChatsLoaded(true);
      return;
    }
    const q = query(collection(db, 'chats'), where('userId', '==', user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => normalizeChat(d.id, d.data()));
        list.sort(
          (a, b) =>
            (b.lastMessageAt?.getTime() ?? 0) - (a.lastMessageAt?.getTime() ?? 0)
        );
        setChats(list);
        setChatsLoaded(true);
      },
      (err) => {
        console.error('[WIDGET] chats error', err);
        setChatsLoaded(true);
      }
    );
    return () => unsub();
  }, [user]);

  // Elegir chat activo: el más reciente abierto, o el más reciente sin importar status
  const activeChat = useMemo(() => {
    return chats.find((c) => c.status === 'open') ?? chats[0] ?? null;
  }, [chats]);

  // Suscripción a mensajes del chat activo
  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }
    const q = query(
      collection(db, 'chats', activeChat.id, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setMessages(snap.docs.map((d) => normalizeMessage(d.id, d.data())));
      },
      (err) => console.error('[WIDGET] messages error', err)
    );
    return () => unsub();
  }, [activeChat?.id]);

  // Auto-scroll cuando llegan mensajes y panel está abierto
  useEffect(() => {
    if (panelOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, panelOpen]);

  // Marcar leído cuando el cliente abre el panel
  useEffect(() => {
    if (panelOpen && activeChat && activeChat.unreadCustomer > 0) {
      markChatReadByCustomer(activeChat.id).catch((err) =>
        console.error('[WIDGET] markRead error', err)
      );
    }
  }, [panelOpen, activeChat]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user || submitting || !firstMsg.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createCustomerChat({
        uid: user.uid,
        email: user.email ?? '',
        displayName: profile?.displayName ?? user.displayName ?? '',
        subject,
        firstMessage: firstMsg
      });
      setSubject('');
      setFirstMsg('');
    } catch (err) {
      console.error('[WIDGET] create error', err);
      setError(err instanceof Error ? err.message : 'Error al iniciar chat');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !activeChat || submitting || !text.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await sendCustomerMessage(activeChat.id, user.uid, text);
      setText('');
    } catch (err) {
      console.error('[WIDGET] send error', err);
      setError(err instanceof Error ? err.message : 'Error al enviar');
    } finally {
      setSubmitting(false);
    }
  }

  if (hideWidget) return null;

  const showNewChatForm =
    user && chatsLoaded && (chats.length === 0 || (activeChat && activeChat.status === 'closed'));
  const showThread = user && activeChat && activeChat.status === 'open';
  const unreadCount = activeChat?.unreadCustomer ?? 0;

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => setPanelOpen((o) => !o)}
        aria-label={panelOpen ? 'Cerrar chat' : 'Abrir chat'}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-accent text-white shadow-lg hover:bg-accent-600 hover:scale-105 transition-all flex items-center justify-center"
      >
        {panelOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-accent text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center border-2 border-accent">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Panel */}
      {panelOpen && (
        <div className="fixed bottom-24 right-5 z-40 w-[calc(100vw-2.5rem)] sm:w-96 max-w-md h-[500px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-accent text-white px-4 py-3 shrink-0">
            <h2 className="font-display font-bold text-base">¿Necesitas ayuda?</h2>
            <p className="text-xs opacity-90">
              Te respondemos en cuanto un agente esté disponible.
            </p>
          </header>

          {/* Body */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!user ? (
              <div className="flex-1 flex items-center justify-center p-6 text-center">
                <div>
                  <p className="text-sm text-gray-700 font-semibold">
                    Inicia sesión para chatear
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Necesitamos saber quién eres para responderte.
                  </p>
                  <Link
                    href="/login"
                    onClick={() => setPanelOpen(false)}
                    className="mt-4 inline-block rounded-full bg-accent text-white px-5 py-2 text-sm font-bold hover:bg-accent-600"
                  >
                    Iniciar sesión
                  </Link>
                </div>
              </div>
            ) : !chatsLoaded ? (
              <p className="flex-1 flex items-center justify-center text-sm text-gray-500">
                Cargando…
              </p>
            ) : showNewChatForm ? (
              <form onSubmit={handleCreate} className="flex-1 flex flex-col p-4 space-y-3 overflow-y-auto">
                {activeChat?.status === 'closed' && (
                  <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600">
                    Tu chat anterior <strong>{activeChat.subject}</strong> está cerrado.
                    Abre uno nuevo para seguir hablando.
                  </div>
                )}
                <label className="block">
                  <span className="block text-xs font-semibold text-gray-700 mb-1">
                    Asunto
                  </span>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Pregunta sobre mi pedido"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </label>
                <label className="block flex-1 flex flex-col">
                  <span className="block text-xs font-semibold text-gray-700 mb-1">
                    Tu mensaje *
                  </span>
                  <textarea
                    required
                    value={firstMsg}
                    onChange={(e) => setFirstMsg(e.target.value)}
                    placeholder="¿En qué te ayudamos?"
                    className="w-full flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                  />
                </label>
                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting || !firstMsg.trim()}
                  className="w-full rounded-full bg-accent text-white px-5 py-2 text-sm font-bold hover:bg-accent-600 disabled:bg-gray-300"
                >
                  {submitting ? 'Enviando…' : 'Enviar'}
                </button>
              </form>
            ) : showThread && activeChat ? (
              <>
                <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-500 shrink-0">
                  <span className="font-semibold text-gray-700">{activeChat.subject}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {messages.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">
                      Cargando mensajes…
                    </p>
                  ) : (
                    messages.map((m) => {
                      const isMine = m.from === 'customer';
                      return (
                        <div
                          key={m.id}
                          className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                              isMine
                                ? 'bg-accent text-white rounded-br-sm'
                                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                            <p
                              className={`text-[9px] mt-1 ${
                                isMine ? 'text-white/70' : 'text-gray-500'
                              }`}
                            >
                              {m.createdAt?.toLocaleTimeString('es-MX', {
                                hour: '2-digit',
                                minute: '2-digit'
                              }) ?? '...'}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>
                <form
                  onSubmit={handleSend}
                  className="border-t border-gray-200 p-3 flex gap-2 shrink-0"
                >
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Escribe…"
                    className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !text.trim()}
                    className="rounded-full bg-accent text-white px-4 py-2 text-sm font-bold hover:bg-accent-600 disabled:bg-gray-300"
                  >
                    →
                  </button>
                </form>
                {error && (
                  <div className="px-3 pb-2 text-xs text-red-600">{error}</div>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
