'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ProductDoc {
  id: string;
  name?: string;
  price?: number;
}

export default function TestPage() {
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[TEST] requesting products collection from Firestore');
    getDocs(collection(db, 'products'))
      .then((snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ProductDoc, 'id'>) }));
        console.log('[TEST] products received:', list.length, list);
        setProducts(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[TEST] firestore error:', err);
        setError(err?.message ?? String(err));
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-accent">Smoke test — Firestore</h1>
        <p className="mt-2 text-sm text-gray-600">
          Lee la colección <code className="rounded bg-gray-100 px-1">products</code> del proyecto{' '}
          <code className="rounded bg-gray-100 px-1">pgina-48477</code>.
        </p>

        <div className="mt-8">
          {loading && <p className="text-gray-500">Cargando…</p>}

          {error && (
            <div className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              <strong>Error:</strong> {error}
              <p className="mt-2 text-xs text-red-600">
                Revisa la consola del navegador (F12) para más detalle.
              </p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Conexión OK — colección vacía.</p>
              <p className="mt-2">
                Para probar la lectura:
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>
                  Abre la{' '}
                  <a
                    className="text-accent underline"
                    href="https://console.firebase.google.com/project/pgina-48477/firestore/data"
                    target="_blank"
                    rel="noreferrer"
                  >
                    consola Firestore
                  </a>
                </li>
                <li>Crea colección <code className="rounded bg-white px-1">products</code></li>
                <li>
                  Agrega un documento con campos:
                  <ul className="ml-5 list-disc">
                    <li><code className="rounded bg-white px-1">name</code> (string)</li>
                    <li><code className="rounded bg-white px-1">price</code> (number)</li>
                  </ul>
                </li>
                <li>Recarga esta página</li>
              </ol>
            </div>
          )}

          {!loading && products.length > 0 && (
            <ul className="space-y-2">
              {products.map((p) => (
                <li key={p.id} className="rounded border border-gray-200 p-4">
                  <div className="font-semibold text-gray-900">{p.name ?? '(sin nombre)'}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    id: {p.id} · ${p.price ?? '?'} MXN
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
