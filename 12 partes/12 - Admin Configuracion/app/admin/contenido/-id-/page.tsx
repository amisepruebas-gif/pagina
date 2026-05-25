"use client";
import { notFound, useParams, useRouter } from "next/navigation";
import { SiteContentForm } from "@/components/admin";
import { SITE_CONTENT } from "@/lib/admin-rest";

/** /admin/contenido/[id] — Renombrar carpeta a `[id]` al integrar. */
export default function EditContentPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const block = SITE_CONTENT.find((b) => b.id === params.id);
  if (!block) return notFound();
  return (
    <SiteContentForm
      block={block}
      onCancel={() => router.push("/admin/contenido")}
      onSave={() => router.push("/admin/contenido")}
    />
  );
}
