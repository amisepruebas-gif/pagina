"use client";
import { useRouter, notFound, useParams } from "next/navigation";
import { CategoryForm } from "@/components/admin";
import { ADMIN_CATEGORIES } from "@/lib/admin-catalog";

/** Renombra esta carpeta de `-id-` a `[id]` al integrar. */
export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const category = ADMIN_CATEGORIES.find((c) => c.id === params.id);
  if (!category) return notFound();
  return (
    <CategoryForm
      category={category}
      onCancel={() => router.push("/admin/categorias")}
      onSave={() => router.push("/admin/categorias")}
    />
  );
}
