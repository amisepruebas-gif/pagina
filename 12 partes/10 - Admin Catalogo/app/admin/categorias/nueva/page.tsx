"use client";
import { useRouter } from "next/navigation";
import { CategoryForm } from "@/components/admin";

export default function NewCategoryPage() {
  const router = useRouter();
  return (
    <CategoryForm
      onCancel={() => router.push("/admin/categorias")}
      onSave={() => router.push("/admin/categorias")}
    />
  );
}
