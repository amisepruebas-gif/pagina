"use client";
import { useState } from "react";
import { Icon, Pill } from "@/components";
import { ADMIN_REVIEWS, type AdminReview } from "@/lib/admin-ops";
import { AdminPageHeader } from "./AdminPageHeader";
import { ReviewModerationRow } from "./ReviewModerationRow";

/** ReviewsModeration — lista filtrable de reseñas con acciones ocultar/mostrar/eliminar. */
export function ReviewsModeration() {
  const [list, setList] = useState<AdminReview[]>(ADMIN_REVIEWS);
  const [filter, setFilter] = useState<"all" | "visible" | "hidden" | "flagged">("all");

  const shown = list.filter((r) => {
    if (filter === "visible") return r.visible;
    if (filter === "hidden")  return !r.visible;
    if (filter === "flagged") return r.flagged;
    return true;
  });

  const toggleVisible = (id: string) =>
    setList((arr) => arr.map((r) => r.id === id ? { ...r, visible: !r.visible } : r));
  const remove = (id: string) =>
    setList((arr) => arr.filter((r) => r.id !== id));

  const flaggedCount = list.filter((r) => r.flagged).length;

  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Reseñas" }]}
        title="Reseñas"
        description={`${list.length} reseñas · ${flaggedCount} requieren revisión`}
      />
      <div className="p-6 flex flex-col gap-4">
        <div className="inline-flex gap-1.5 flex-wrap">
          <Pill active={filter === "all"}     onClick={() => setFilter("all")}>Todas</Pill>
          <Pill active={filter === "visible"} onClick={() => setFilter("visible")}>Visibles</Pill>
          <Pill active={filter === "hidden"}  onClick={() => setFilter("hidden")}>Ocultas</Pill>
          <Pill active={filter === "flagged"} onClick={() => setFilter("flagged")}>
            <Icon name="warn" size={13} strokeWidth={2.4} /> Marcadas
          </Pill>
        </div>

        <div className="flex flex-col gap-3">
          {shown.map((r) => (
            <ReviewModerationRow key={r.id} review={r}
              onToggleVisible={toggleVisible} onDelete={remove} />
          ))}
        </div>
      </div>
    </>
  );
}
