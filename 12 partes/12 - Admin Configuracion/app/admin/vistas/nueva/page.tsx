"use client";
import { useRouter } from "next/navigation";
import { ViewEditor } from "@/components/admin";

export default function NewViewPage() {
  const router = useRouter();
  return <ViewEditor onBack={() => router.push("/admin/vistas")} />;
}
