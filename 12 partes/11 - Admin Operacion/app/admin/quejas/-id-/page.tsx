"use client";
import { notFound, useParams } from "next/navigation";
import { ComplaintDetail } from "@/components/admin";
import { ADMIN_COMPLAINTS } from "@/lib/admin-ops";

/** /admin/quejas/[id] — Renombrar carpeta a `[id]` al integrar. */
export default function ComplaintDetailPage() {
  const params = useParams<{ id: string }>();
  const c = ADMIN_COMPLAINTS.find((x) => x.id === params.id);
  if (!c) return notFound();
  return <ComplaintDetail complaint={c} />;
}
