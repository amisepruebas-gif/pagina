"use client";
import { useState } from "react";
import { Button } from "@/components";
import { ACCOUNT_COMPLAINTS, type Complaint } from "@/lib/sample-account";
import { SectionHeader } from "./SectionHeader";
import { ComplaintItem } from "./ComplaintItem";
import { ComplaintForm } from "./ComplaintForm";
import { AccountEmptyState } from "./EmptyState";

/** ComplaintsTab — historial de tickets + form inline para abrir nuevos. */
export function ComplaintsTab() {
  const [list] = useState<Complaint[]>(ACCOUNT_COMPLAINTS);
  const [creating, setCreating] = useState(false);

  if (list.length === 0 && !creating) {
    return (
      <AccountEmptyState
        icon="info" title="Sin tickets abiertos"
        body="Si tuviste algún problema, abre una queja y te ayudamos en menos de 24 horas."
        cta="Abrir una queja" onCta={() => setCreating(true)}
      />
    );
  }

  return (
    <div>
      <SectionHeader
        title="Soporte y quejas"
        subtitle="Historial de tus tickets y conversaciones con nuestro equipo."
        action={!creating && (
          <Button leadingIcon="plus" onClick={() => setCreating(true)}>Nueva queja</Button>
        )}
      />

      {creating && (
        <div className="mb-4">
          <ComplaintForm onCancel={() => setCreating(false)} />
        </div>
      )}

      <div className="flex flex-col gap-3.5">
        {list.map((c) => <ComplaintItem key={c.id} c={c} />)}
      </div>
    </div>
  );
}
