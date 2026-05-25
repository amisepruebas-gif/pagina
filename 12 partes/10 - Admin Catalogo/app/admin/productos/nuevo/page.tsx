"use client";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin";

export default function NewProductPage() {
  const router = useRouter();
  return (
    <ProductForm
      onCancel={() => router.push("/admin/productos")}
      onSave={() => router.push("/admin/productos")}
    />
  );
}
