"use client";
import { useRouter, notFound, useParams } from "next/navigation";
import { DiscountForm } from "@/components/admin";
import { ADMIN_DISCOUNTS } from "@/lib/admin-catalog";

/** Renombra esta carpeta de `-id-` a `[id]` al integrar. */
export default function EditDiscountPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const discount = ADMIN_DISCOUNTS.find((d) => d.id === params.id);
  if (!discount) return notFound();
  return (
    <DiscountForm
      discount={discount}
      onCancel={() => router.push("/admin/descuentos")}
      onSave={() => router.push("/admin/descuentos")}
    />
  );
}
