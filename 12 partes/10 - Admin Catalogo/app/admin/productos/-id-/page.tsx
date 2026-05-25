"use client";
import { useRouter } from "next/navigation";
import { notFound, useParams } from "next/navigation";
import { ProductForm } from "@/components/admin";
import { ADMIN_PRODUCTS } from "@/lib/admin-catalog";

/**
 * /admin/productos/[id] — Editar producto.
 *
 * > Renombra esta carpeta de `-id-` a `[id]` en tu proyecto Next.js
 * > (el exportador no permite brackets en nombres de carpeta).
 */
export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const product = ADMIN_PRODUCTS.find((p) => String(p.id) === params.id);
  if (!product) return notFound();
  return (
    <ProductForm
      product={product}
      onCancel={() => router.push("/admin/productos")}
      onSave={() => router.push("/admin/productos")}
    />
  );
}
