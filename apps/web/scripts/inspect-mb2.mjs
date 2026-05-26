// Inspecciona los 5 docs «M-b-2» en detalle: campos y conteo de imágenes.
import { readFile } from 'node:fs/promises';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const saPath = process.argv.find((a) => a.startsWith('--service-account='))?.split('=')[1];
if (!saPath) {
  console.error('Uso: node scripts/inspect-mb2.mjs --service-account=<ruta>');
  process.exit(1);
}

const sa = JSON.parse(await readFile(saPath, 'utf-8'));
const app = initializeApp({ credential: cert(sa), projectId: sa.project_id });
const db = getFirestore(app);

const ids = [
  'xOcAWWAWo1kqOQbx1k6N',
  'yXC5bhbknzS5nxHCQw7D',
  'ECewvuFp7LgCYYrwy77J',
  'ULruAkmi6zicKydtTUOy'
];

// Buscar también al "más antiguo" (el que conserva el slug m-b-2)
const all = await db
  .collection('products')
  .where('slug', '==', 'm-b-2')
  .get();

console.log(`Productos con slug "m-b-2": ${all.size}\n`);

const docs = all.docs
  .map((d) => ({ id: d.id, data: d.data() }))
  .sort((a, b) => (a.data.createdAt?.toMillis() ?? 0) - (b.data.createdAt?.toMillis() ?? 0));

for (let i = 0; i < docs.length; i++) {
  const { id, data } = docs[i];
  const imgs = await db.collection('products').doc(id).collection('images').get();
  console.log(`=== ${i === 0 ? 'OLDEST (conserva slug)' : `dup #${i}`} — ${id} ===`);
  console.log(`  name: ${data.name}`);
  console.log(`  createdAt: ${data.createdAt?.toDate?.()?.toISOString() ?? 'N/A'}`);
  console.log(`  updatedAt: ${data.updatedAt?.toDate?.()?.toISOString() ?? 'N/A'}`);
  console.log(`  active: ${data.active}`);
  console.log(`  price: ${data.price}, costPrice: ${data.costPrice}, originalPrice: ${data.originalPrice}`);
  console.log(`  stock: ${data.stock}`);
  console.log(`  sku: ${data.sku}`);
  console.log(`  categoryId: ${data.categoryId}`);
  console.log(`  subcategoryId: ${data.subcategoryId}`);
  console.log(`  materialId: ${data.materialId}`);
  console.log(`  tagIds: ${JSON.stringify(data.tagIds ?? [])}`);
  console.log(`  description: ${(data.description ?? '').slice(0, 80)}`);
  console.log(`  longDescription: ${(data.longDescription ?? '').slice(0, 80)}`);
  console.log(`  primaryImageUrl: ${data.primaryImageUrl ? 'set' : 'empty'}`);
  console.log(`  imageCount (field): ${data.imageCount ?? 0}`);
  console.log(`  imagenes (subcollection count): ${imgs.size}`);
  console.log(`  isNew: ${data.isNew}, isFeatured: ${data.isFeatured}`);
  console.log();
}
