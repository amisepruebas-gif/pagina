"use client";
import { useState } from "react";
import { Button, Icon, Input, Textarea } from "@/components";

interface ReviewFormProps {
  onCancel: () => void;
  onSubmit?: (data: { rating: number; title: string; body: string }) => void;
}

/**
 * ReviewForm — formulario para escribir reseña.
 * Selector de estrellas (tap target 44px), título, body y placeholder de fotos.
 */
export function ReviewForm({ onCancel, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody]   = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="p-6 rounded-lg bg-brand-50 border border-brand-200 mb-5 text-center">
        <Icon name="check" size={28} strokeWidth={2.4} className="text-brand-700 mb-2 mx-auto" />
        <div className="font-display font-bold text-lg text-brand-700">¡Gracias por tu reseña!</div>
        <div className="mt-1.5 text-sm text-text-muted">La publicaremos en cuanto pase moderación.</div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit?.({ rating, title, body }); setSubmitted(true); }}
      className="p-6 mb-5 bg-surface border border-border rounded-lg flex flex-col gap-4"
    >
      <h4 className="font-display font-bold text-lg">Escribe tu reseña</h4>
      <div>
        <div className="text-[13px] font-semibold mb-1.5 font-display">Tu calificación</div>
        <div className="inline-flex gap-1">
          {[1,2,3,4,5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} estrellas`}
              className={`size-11 p-0 border-0 bg-transparent cursor-pointer transition
                          ${n <= rating ? "text-accent" : "text-border-strong"}`}>
              <Icon name={n <= rating ? "star-filled" : "star"} size={28} strokeWidth={1.4} />
            </button>
          ))}
        </div>
      </div>
      <Input label="Título de tu reseña" placeholder="Por ejemplo: muy buena compra"
             value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Textarea label="Tu reseña" rows={4} placeholder="¿Qué te pareció el producto?"
                value={body} onChange={(e) => setBody(e.target.value)} required />
      <div className="p-3.5 rounded-md bg-surface-2 border border-dashed border-border-strong flex items-center gap-3">
        <Icon name="plus" size={18} strokeWidth={2} className="text-text-soft" />
        <span className="flex-1 text-[13px] text-text-muted">Agregar fotos (opcional)</span>
        <Button size="sm" variant="secondary">Seleccionar</Button>
      </div>
      <div className="flex gap-2.5 justify-end">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" trailingIcon="arr-right" disabled={rating === 0}>Publicar reseña</Button>
      </div>
    </form>
  );
}
