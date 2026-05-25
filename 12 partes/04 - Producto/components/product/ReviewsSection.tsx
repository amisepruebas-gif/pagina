"use client";
import { useState } from "react";
import { Button, Icon, Pill } from "@/components";
import { SAMPLE_REVIEWS, SAMPLE_DISTRIBUTION, type Review } from "@/lib/sample-product";
import { SectionTitle } from "./SectionTitle";
import { RatingDistribution } from "./RatingDistribution";
import { ReviewItem } from "./ReviewItem";
import { ReviewForm } from "./ReviewForm";

export interface ReviewsSectionProps {
  avg: number;
  total: number;
  /** Si lo dejas, sobreescribe los reviews de ejemplo */
  reviews?: Review[];
}

/**
 * ReviewsSection — sección completa de reseñas:
 * - `<RatingDistribution/>` con barras filtrables
 * - filter pills (calificación + "con foto")
 * - listado de `<ReviewItem/>`
 * - `<ReviewForm/>` colapsado, abre con "Escribir reseña"
 */
export function ReviewsSection({
  avg, total, reviews = SAMPLE_REVIEWS,
}: ReviewsSectionProps) {
  const [filter, setFilter] = useState<string>("all");
  const [withPhoto, setWithPhoto] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const filtered = reviews.filter((r) =>
    (filter === "all" || r.rating === Number(filter)) &&
    (!withPhoto || r.hasPhoto));

  return (
    <section id="reviews" className="py-12 border-t border-border scroll-mt-20">
      <SectionTitle eyebrow="04 / Reseñas">Lo que dicen los clientes</SectionTitle>

      <RatingDistribution
        avg={avg} total={total} buckets={SAMPLE_DISTRIBUTION}
        filter={filter} onFilterChange={setFilter}
      />

      <div className="flex justify-between items-center gap-3 flex-wrap mb-5">
        <div className="flex gap-2 flex-wrap">
          <Pill active={filter === "all"} onClick={() => setFilter("all")}>Todas</Pill>
          {[5, 4, 3, 2, 1].map((s) => (
            <Pill key={s} active={filter === String(s)} onClick={() => setFilter(String(s))}>
              {s}★
            </Pill>
          ))}
          <Pill active={withPhoto} onClick={() => setWithPhoto(!withPhoto)}>
            <Icon name="eye" size={13} strokeWidth={2} /> Con foto
          </Pill>
        </div>
        <Button variant="secondary" leadingIcon="plus" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Escribir reseña"}
        </Button>
      </div>

      {showForm && <ReviewForm onCancel={() => setShowForm(false)} />}

      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="py-8 px-6 text-center border border-dashed border-border rounded-lg text-text-soft text-sm">
            No hay reseñas con esos filtros.
          </div>
        ) : (
          filtered.map((r) => <ReviewItem key={r.id} r={r} />)
        )}
      </div>

      <div className="mt-6 text-center">
        <Button variant="secondary" trailingIcon="arr-right">Ver todas las reseñas</Button>
      </div>
    </section>
  );
}
