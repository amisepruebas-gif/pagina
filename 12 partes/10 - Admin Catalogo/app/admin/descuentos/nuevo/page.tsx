"use client";
import { useRouter } from "next/navigation";
import { DiscountForm } from "@/components/admin";

export default function NewDiscountPage() {
  const router = useRouter();
  return (
    <DiscountForm
      onCancel={() => router.push("/admin/descuentos")}
      onSave={() => router.push("/admin/descuentos")}
    />
  );
}
