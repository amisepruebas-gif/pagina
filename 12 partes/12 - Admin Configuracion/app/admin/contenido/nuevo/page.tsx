"use client";
import { useRouter } from "next/navigation";
import { SiteContentForm } from "@/components/admin";

export default function NewContentPage() {
  const router = useRouter();
  return (
    <SiteContentForm
      onCancel={() => router.push("/admin/contenido")}
      onSave={() => router.push("/admin/contenido")}
    />
  );
}
