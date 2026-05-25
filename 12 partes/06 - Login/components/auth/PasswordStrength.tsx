interface PasswordStrengthProps {
  password: string;
}

/** Devuelve score 0–4 + label + color según composición de la contraseña. */
export function evaluatePassword(p: string) {
  if (!p) return { score: 0, label: "", color: "var(--border-strong)" } as const;
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  s = Math.min(s, 4);
  const TABLE = [
    { label: "muy débil", color: "var(--error)" },
    { label: "débil",     color: "var(--error)" },
    { label: "razonable", color: "var(--warning)" },
    { label: "fuerte",    color: "var(--success)" },
    { label: "excelente", color: "var(--success)" },
  ];
  return { score: s, ...TABLE[s] };
}

/**
 * PasswordStrength — barra de 4 segmentos + etiqueta.
 * Solo se renderiza si hay password. Sugerencia complementaria si score < 2.
 */
export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label, color } = evaluatePassword(password);
  if (!password) return null;
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span key={i}
            style={{ background: i < score ? color : "var(--border)" }}
            className="flex-1 h-1 rounded-full transition-colors duration-fast ease-out"
          />
        ))}
      </div>
      <div className="mt-1.5 text-[11px] text-text-soft">
        Fuerza: <span style={{ color }} className="font-semibold">{label}</span>
        {score < 2 && " · usa mayúsculas, números o símbolos"}
      </div>
    </div>
  );
}
