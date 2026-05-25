'use client';

import { useEffect, useState } from 'react';

interface Remaining {
  d: number;
  h: number;
  m: number;
  s: number;
  done: boolean;
}

function remainingTo(end: number): Remaining {
  const ms = Math.max(0, end - Date.now());
  return {
    d: Math.floor(ms / 86_400_000),
    h: Math.floor((ms / 3_600_000) % 24),
    m: Math.floor((ms / 60_000) % 60),
    s: Math.floor((ms / 1_000) % 60),
    done: ms <= 0
  };
}

const pad = (n: number) => n.toString().padStart(2, '0');

/** Contador regresivo. Se calcula solo en cliente para evitar mismatch SSR. */
export default function PromoCountdown({
  endsAt,
  color
}: {
  endsAt: string;
  color?: string;
}) {
  const end = new Date(endsAt).getTime();
  const [t, setT] = useState<Remaining | null>(null);

  useEffect(() => {
    if (Number.isNaN(end)) return;
    setT(remainingTo(end));
    const id = window.setInterval(() => {
      const r = remainingTo(end);
      setT(r);
      if (r.done) window.clearInterval(id); // detener al terminar
    }, 1000);
    return () => window.clearInterval(id);
  }, [end]);

  if (Number.isNaN(end) || !t) return null;
  if (t.done) {
    return (
      <p className="text-sm font-semibold" style={{ color }}>
        Promoción finalizada
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3" style={{ color }}>
      {[
        { n: t.d, label: 'días' },
        { n: t.h, label: 'hrs' },
        { n: t.m, label: 'min' },
        { n: t.s, label: 'seg' }
      ].map((u) => (
        <div key={u.label} className="text-center">
          <div className="text-2xl md:text-3xl font-bold tabular-nums leading-none">
            {pad(u.n)}
          </div>
          <div className="text-[10px] uppercase tracking-wide opacity-80">
            {u.label}
          </div>
        </div>
      ))}
    </div>
  );
}
