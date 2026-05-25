"use client";
import { notFound, useParams, useRouter } from "next/navigation";
import { ViewEditor } from "@/components/admin";
import { ADMIN_VIEWS } from "@/lib/admin-rest";

/** /admin/vistas/[id] — Renombrar carpeta a `[id]` al integrar. */
export default function EditViewPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const view = ADMIN_VIEWS.find((v) => v.id === params.id);
  if (!view) return notFound();
  return <ViewEditor view={view} onBack={() => router.push("/admin/vistas")} />;
}
