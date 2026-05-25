import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions/v2';
import { v1 } from '@google-cloud/firestore';

const adminClient = new v1.FirestoreAdminClient();

/**
 * Export diario de Firestore a un bucket GCS.
 *
 * REQUISITOS DE SETUP (una vez):
 *  1. Crear el bucket — recomendado nearline/coldline para abaratar:
 *       gcloud storage buckets create gs://pgina-48477-backups \
 *         --location=us-central1 --default-storage-class=NEARLINE
 *  2. Dar al service account de las CF el rol de export:
 *       gcloud projects add-iam-policy-binding pgina-48477 \
 *         --member="serviceAccount:pgina-48477@appspot.gserviceaccount.com" \
 *         --role="roles/datastore.importExportAdmin"
 *  3. Darle acceso de escritura al bucket:
 *       gcloud storage buckets add-iam-policy-binding gs://pgina-48477-backups \
 *         --member="serviceAccount:pgina-48477@appspot.gserviceaccount.com" \
 *         --role="roles/storage.admin"
 *
 * Restaurar (manual, desde consola o gcloud):
 *   gcloud firestore import gs://pgina-48477-backups/<TIMESTAMP>
 */

const BACKUP_BUCKET = 'gs://pgina-48477-backups';

export const scheduledFirestoreExport = onSchedule(
  {
    schedule: 'every 24 hours',
    timeZone: 'America/Mexico_City',
    retryCount: 2
  },
  async () => {
    const projectId =
      process.env.GCLOUD_PROJECT ?? process.env.GCP_PROJECT ?? 'pgina-48477';
    const databaseName = adminClient.databasePath(projectId, '(default)');

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    const outputUriPrefix = `${BACKUP_BUCKET}/${timestamp}`;

    try {
      const [response] = await adminClient.exportDocuments({
        name: databaseName,
        outputUriPrefix,
        // collectionIds vacío = exporta todas las colecciones
        collectionIds: []
      });
      logger.info('[backup] export iniciado', {
        outputUriPrefix,
        operation: response.name
      });
    } catch (err) {
      logger.error('[backup] export falló', err);
      throw err; // dispara el retry
    }
  }
);
