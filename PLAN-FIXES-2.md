# Plan de fixeo 2 — auditoría de upload local + promo (2026-05-20)

> Correcciones de la segunda auditoría. **Las 3 fases completas (2026-05-20).**
> Typecheck verde · 51 tests de rules verdes. No cambiaron reglas → sin deploy.

## FASE A — Alto: borrado de imágenes diferido al guardado

### A1 — `ImageInput` no debe borrar imágenes de forma optimista 🟠
- [x] Hecho
- **Problema**: `ImageInput` borra la imagen anterior de Storage al *subir* la nueva. Si el formulario se cancela, el registro queda apuntando a una imagen ya borrada → imagen rota.
- **Fix**: `ImageInput` ya NO borra. Expone un callback `onReplace(oldUrl)`; el formulario padre acumula las URLs reemplazadas y las borra **solo al guardar con éxito**. Si se cancela, nada se borró → registro íntegro.
- **Afecta**: `ImageInput`, `ProductForm`, `CategoryForm`, `SiteContentForm`, `PageViewEditor`.

## FASE B — Medios

### B1 — Countdown del promo sin zona horaria 🟡
- [x] Hecho
- **Fix**: guardar `countdownEnd` como ISO UTC (`.toISOString()`); el editor convierte ida/vuelta para el input `datetime-local`.

### B2 — `deleteImageByUrl` no reconoce todos los hosts de Storage 🟡
- [x] Hecho
- **Fix**: ampliar el filtro para incluir `firebasestorage.app`.

### B3 — `PromoCountdown` deja el `setInterval` vivo tras terminar 🟡
- [x] Hecho
- **Fix**: `clearInterval` cuando el contador llega a `done`.

### B4 — Banners del editor con `key` por índice 🟡
- [x] Hecho
- **Fix**: dar `id` estable a cada `ViewBanner`; usar `key={banner.id}`.

### B5 — `async_payment_failed` sin orden previa deja `pendingCheckouts` huérfano 🟡
- [x] Hecho
- **Fix**: si la orden no existe al recibir `async_payment_failed`, borrar `pendingCheckouts/{id}`.

## FASE C — Bajos

### C1 — Hints de UI obsoletos ("galería", "pega una URL") 🟢
- [x] Hecho
- **Fix**: actualizar el texto en los formularios — ya no hay galería ni URL manual.

### C2 — `productIds` duplicados → `key` duplicada en el grid 🟢
- [x] Hecho
- **Fix**: deduplicar al renderizar en `ViewProducts` / `ViewPromo`.

---

## Aceptado / fuera de plan
Huérfanos en Storage si se sube imagen y nunca se guarda (inherente a "subir al elegir"); `orderNumber` con colisión teórica; strings vacíos persistidos. No bloquean.
