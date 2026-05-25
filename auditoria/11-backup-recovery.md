# 11 — Backup y recuperación

## Por qué importa
Un `db.collection('products').get()` mal escrito en una Cloud Function, un script de admin que borra de más, una regla Firestore mal pegada — y de pronto faltan 6 meses de pedidos. Sin backups no hay recuperación.

## Qué se evalúa típicamente
- Frecuencia de backups.
- Retención.
- Cobertura (Firestore, Storage, Auth users, code, config).
- Restauración probada.
- Aislamiento.
- Cifrado en reposo (usualmente nativo).
- Acceso (least privilege).
- Auditoría.

---

## Cambios al plan original

El plan inicial decía _"No hay (que yo sepa) ningún backup configurado hoy. Esto es un hueco real."_ Era falso — `functions/src/backup.ts` SÍ existe. Lo encontré al auditar 09 — Data integrity. Reporto el estado real.

---

## Hallazgos (auditoría 2026-05-24)

### Lo que está bien

**Firestore export programado** (`functions/src/backup.ts`):
- Cloud Function `scheduledFirestoreExport` con cron `every 24 hours`, timezone CDMX, retry 2.
- Exporta TODAS las colecciones (`collectionIds: []`) a `gs://pgina-48477-backups/<timestamp>`.
- Documentación inline con los pasos exactos de IAM:
  - `roles/datastore.importExportAdmin` al service account de las CF.
  - `roles/storage.admin` sobre el bucket.
- Instrucciones para restaurar: `gcloud firestore import gs://pgina-48477-backups/<TIMESTAMP>`.

**Imágenes huérfanas barridas** (`sweepOrphanImages`):
- Diario 04:00 CDMX, conservador (>24 h).
- Lee referencias de products, vistas, config/home, siteContent, categories.

**Git como backup de código**: GitHub `https://github.com/amisepruebas-gif/pagina.git`. Si se borra el repo local, todo está en GitHub. Vercel deploys son recuperables desde dashboard.

### Hallazgos con acción

**🟡 MEDIA — Falta confirmar que el setup del backup está completo**
El código de la Cloud Function existe y se exporta desde `functions/src/index.ts:9`. Pero:
- ¿Está **desplegada** la función en producción? `firebase deploy --only functions` debió correrse después de escribirla.
- ¿Existe el bucket `gs://pgina-48477-backups`?
- ¿El service account tiene los roles?
- ¿Se ha verificado al menos UNA ejecución exitosa (logs en Cloud Functions)?

**Pendiente** — verificación manual (no se puede hacer desde el código):
```bash
firebase functions:list | grep scheduledFirestoreExport
gcloud storage buckets describe gs://pgina-48477-backups
gcloud firestore operations list --limit=5
```
Si algún paso falla, ejecutar lo documentado en `functions/src/backup.ts` (4 comandos `gcloud`).

**🟡 MEDIA — Sin lifecycle / retención en el bucket de backups**
El export crea un folder nuevo por día (`<timestamp>`). Sin política de lifecycle, el bucket crece para siempre.

**Pendiente** — backlog:
```bash
gcloud storage buckets update gs://pgina-48477-backups \
  --lifecycle-file=lifecycle.json
```
Con `lifecycle.json` aplicando:
- 30 días → mover a Coldline.
- 90 días → mover a Archive.
- 365 días → borrar.

**🟡 MEDIA — Sin restauración probada**
Tener backup no es lo mismo que poder restaurar. Una prueba real:
1. Crear un proyecto Firebase "pagina-restore-test".
2. `gcloud firestore import gs://pgina-48477-backups/<reciente>` apuntando al nuevo proyecto.
3. Verificar que las colecciones están completas.
4. Documentar el tiempo total (RTO real).

**Pendiente** — backlog. Hacer la prueba 1 vez al trimestre, anotar RTO.

**🔴 ALTA — Storage no tiene backup**
- `functions/src/backup.ts` solo exporta Firestore.
- Las imágenes en `gs://pgina-48477.appspot.com` (productos, hero, banners, vistas) no se respaldan.
- Si alguien borra accidentalmente el bucket de Storage o un script de admin elimina imágenes de productos, no hay recuperación.

**Pendiente** — backlog:
- **Opción A** (simple): activar **versioning** en el bucket de Storage. Cada delete crea una versión anterior. `gcloud storage buckets update gs://pgina-48477.appspot.com --versioning`.
- **Opción B** (completa): Cloud Function semanal con `gsutil rsync gs://pgina-48477.appspot.com gs://pgina-48477-backups/storage/<timestamp>`. Más costoso (egress) pero recuperación más limpia.

Recomendación: **A primero** (gratis, activar takes 5 min), B después si crece.

**🔴 ALTA — Auth users no se respaldan**
- Auth user database vive en Firebase Auth, no en Firestore. Si algo borra a un usuario o un atacante toma control de la consola y limpia, no hay recuperación.
- Cobertura: medio millón de usuarios → un export mensual es trivial.

**Pendiente** — backlog:
- Cloud Function scheduled (mensual): `firebase auth:export users.json` y subir a `gs://pgina-48477-backups/auth/<timestamp>.json`.
- Cifrar con KMS antes de subir (opcional, el bucket ya está privado).

**🟢 BAJA — Aislamiento del bucket de backups**
- Hoy `pgina-48477-backups` vive en el mismo proyecto GCP que `pgina-48477`. Si el proyecto principal se compromete (cuenta hackeada, factura sin pagar, eliminación accidental), los backups caen con él.
- Aislamiento real: bucket en **otro proyecto GCP** con IAM separado, owned por otra cuenta.

**Pendiente** — backlog. Para nivel de criticidad alto (cuando haya tráfico real y revenue). Hoy es overhead.

**🟢 BAJA — Stripe data**
- Las órdenes pagadas viven en Firestore (entran al backup) Y en Stripe (con sus propios backups). Doble cobertura.
- Si quieres exportar Stripe a otro lugar: usar [Stripe Sigma](https://stripe.com/sigma) o webhooks que escriben en otro lado. No necesario hoy.

---

## Resumen
| Severidad | Encontradas | Resueltas hoy | Pendientes |
|-----------|-------------|---------------|------------|
| Alta | 2 | 0 | 2 (Storage backup, Auth export) |
| Media | 3 | 0 | 3 (deploy verificación, lifecycle, prueba) |
| Baja | 2 | 0 | 2 (aislamiento, Stripe) |

Buena noticia: el **backup de Firestore ya está codificado** y solo falta verificar que esté efectivamente corriendo en producción. La sorpresa fue descubrir que sí existe — el plan original asumía cero implementación.

Los huecos reales son **Storage** y **Auth users**: con Firestore como única red de seguridad, una pérdida de imágenes o usuarios no se recupera. Para una tienda en arranque, activar versioning del bucket de Storage es la acción de mejor relación costo/beneficio.

## Estado
Auditado — sin fixes hoy. 4 acciones de operaciones (`gcloud` commands) que sumadas no toman más de 30 min — pendientes para una sesión específica del usuario en GCP Console.
