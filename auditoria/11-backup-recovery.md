# 11 — Backup y recuperación

## Por qué importa
Un `db.collection('products').get()` mal escrito en una Cloud Function, un script de admin que borra de más, una regla Firestore mal pegada — y de pronto faltan 6 meses de pedidos. Si no hay backups, no hay recuperación.

## Qué se evalúa típicamente
- **Frecuencia** de backups (diario, semanal, ambos).
- **Retención**: cuánto tiempo se guardan los backups (30 días, 90, 1 año).
- **Cobertura**: Firestore, Storage, Auth users, Functions code (en git ya), config.
- **Restauración probada**: ¿se ha intentado restaurar? ¿se sabe el RTO/RPO real?
- **Aislamiento**: el backup vive en otro proyecto/región/cuenta para sobrevivir un compromiso del principal.
- **Cifrado en reposo** (usualmente nativo en GCS).
- **Acceso**: quién puede leer/restaurar/borrar backups (least privilege).
- **Auditoría**: log de cuándo se hizo cada backup y quién accedió.

## Plan para `pagina`

- [ ] **Firestore export programado**: Cloud Function scheduled (cron diario) que llame al API `firestore.googleapis.com/v1/projects/{project}/databases/(default):exportDocuments` apuntando a un bucket GCS dedicado (`pgina-48477-backups`). Variantes:
  - **Manual**: `gcloud firestore export gs://pgina-48477-backups/$(date +%Y-%m-%d)`.
  - **Scheduled**: Cloud Scheduler + Pub/Sub + Cloud Function.
- [ ] **Storage backup**: `gsutil rsync -r gs://pgina-48477.appspot.com gs://pgina-48477-backups/storage/$(date +%Y-%m-%d)` semanal. Alternativa: bucket lifecycle con versioning + retention 90 días.
- [ ] **Auth users**: `firebase auth:export users.json` (mensual). Guardar cifrado en bucket de backups.
- [ ] **Retención**:
  - Diarios: 30 días.
  - Semanales: 90 días.
  - Mensuales: 1 año.
  - Reglas de lifecycle en el bucket GCS para auto-borrado.
- [ ] **Restauración probada**: una vez al trimestre, restaurar a un proyecto de test y validar que (a) Firestore queda igual, (b) auth users se importan, (c) las imágenes de Storage cargan.
- [ ] **RTO/RPO** documentados:
  - **RPO** (cuánto perdemos): hasta 24 h con backups diarios.
  - **RTO** (cuánto tarda restaurar): documentar después de la primera prueba (probablemente 1-3 h).
- [ ] **Aislamiento**: el bucket de backups debería estar en otro proyecto GCP o al menos con IAM separado. Solo un rol `roles/storage.objectAdmin` sobre ese bucket, accesible por una service account dedicada que NO se usa en runtime.
- [ ] **Git como backup de código**: ya cubierto con GitHub. Habilitar protected branches en `main` (sin force-push, requires PR).
- [ ] **Vercel rollback**: cualquier deploy puede volverse a promote desde el dashboard. RTO de minutos. Documentar el procedimiento.
- [ ] **Stripe**: los datos transaccionales viven en Stripe (no en Firestore), respaldados por Stripe. No se necesita backup propio salvo si se almacenan copias en Firestore (en cuyo caso entran al backup general).

## Cómo ejecutar
- gcloud SDK instalado y autenticado.
- Cloud Scheduler job: ver [docs oficiales](https://firebase.google.com/docs/firestore/solutions/schedule-export).
- Para Storage: `gsutil` o `gcloud storage`.
- Auditar buckets: `gsutil ls gs://pgina-48477-backups/`.

## Notas preliminares
- No hay (que yo sepa) ningún backup configurado hoy. Esto es un hueco real.
- Firebase Spark plan: el export programado puede requerir Blaze (consumo). Confirmar plan del proyecto.
- Memory: `sweepOrphanImages` (Phase B) ya está desplegada como scheduled function — patrón replicable para el backup.

## Estado
Pendiente
