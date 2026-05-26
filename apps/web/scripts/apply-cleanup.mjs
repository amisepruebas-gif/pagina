// Aplica la limpieza acordada:
//   1. Borra los 4 clones de "M-b-2" (conserva el más antiguo).
//   2. Re-lee la base, calcula renombres de slug/SKU para el resto, aplica.
//
// Uso:
//   node scripts/apply-cleanup.mjs --service-account=<ruta>

import { readFile } from 'node:fs/promises';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const saPath = process.argv.find((a) => a.startsWith('--service-account='))?.split('=')[1];
if (!saPath) {
  console.error('Uso: node scripts/apply-cleanup.mjs --service-account=<ruta>');
  process.exit(1);
}

const sa = JSON.parse(await readFile(saPath, 'utf-8'));
const app = initializeApp({ credential: cert(sa), projectId: sa.project_id });
const db = getFirestore(app);

// === FASE 1: BORRADO de M-b-2 duplicados ===
const TO_DELETE = [
  'xOcAWWAWo1kqOQbx1k6N',
  'yXC5bhbknzS5nxHCQw7D',
  'ECewvuFp7LgCYYrwy77J',
  'ULruAkmi6zicKydtTUOy'
];

console.log('=== FASE 1 — Borrar duplicados de M-b-2 ===');
for (const id of TO_DELETE) {
  try {
    // Borrar subcollection de imágenes primero (Firestore no cascadea)
    const imgs = await db.collection('products').doc(id).collection('images').get();
    for (const img of imgs.docs) await img.ref.delete();

    await db.collection('products').doc(id).delete();
    console.log(`  ✓ ${id} borrado (${imgs.size} img-subdocs limpiadas)`);
  } catch (err) {
    console.error(`  ✗ ${id} falló:`, err.message);
  }
}
console.log();

// === FASE 2: RECALCULAR PLAN tras los deletes ===
console.log('=== FASE 2 — Recalcular plan de slug/SKU ===');
const snap = await db.collection('products').get();
const products = snap.docs.map((d) => {
  const data = d.data();
  return {
    id: d.id,
    name: typeof data.name === 'string' ? data.name : '(sin nombre)',
    slug: typeof data.slug === 'string' ? data.slug : null,
    sku: typeof data.sku === 'string' && data.sku.length > 0 ? data.sku : null,
    createdAtMs: data.createdAt?.toMillis?.() ?? 0
  };
});
console.log(`  productos vivos: ${products.length}`);

function planRenames(field) {
  const byValue = new Map();
  for (const p of products) {
    const v = p[field];
    if (!v) continue;
    if (!byValue.has(v)) byValue.set(v, []);
    byValue.get(v).push(p);
  }
  const taken = new Set(products.map((p) => p[field]).filter(Boolean));
  const renames = new Map();
  for (const [value, docs] of byValue.entries()) {
    if (docs.length <= 1) continue;
    docs.sort((a, b) => a.createdAtMs - b.createdAtMs);
    for (let i = 1; i < docs.length; i++) {
      const doc = docs[i];
      let n = 2;
      let candidate = `${value}-${n}`;
      while (taken.has(candidate)) {
        n++;
        candidate = `${value}-${n}`;
        if (n > 99) throw new Error(`Sin ${field} libre para "${value}"`);
      }
      taken.add(candidate);
      renames.set(doc.id, { from: value, to: candidate });
    }
  }
  return renames;
}

const slugRenames = planRenames('slug');
const skuRenames = planRenames('sku');

const changedIds = new Set([...slugRenames.keys(), ...skuRenames.keys()]);
console.log(`  productos a actualizar: ${changedIds.size}`);
console.log();

// === FASE 3: APLICAR RENOMBRES ===
console.log('=== FASE 3 — Aplicar renombres ===');
let ok = 0;
let fail = 0;
for (const id of changedIds) {
  const update = { updatedAt: FieldValue.serverTimestamp() };
  const slug = slugRenames.get(id);
  const sku = skuRenames.get(id);
  if (slug) update.slug = slug.to;
  if (sku) update.sku = sku.to;
  try {
    await db.collection('products').doc(id).update(update);
    ok++;
    const name = products.find((p) => p.id === id)?.name ?? '?';
    const changes = [];
    if (slug) changes.push(`slug=${slug.to}`);
    if (sku) changes.push(`sku=${sku.to}`);
    console.log(`  ✓ ${id} «${name}» → ${changes.join(', ')}`);
  } catch (err) {
    fail++;
    console.error(`  ✗ ${id} falló:`, err.message);
  }
}

console.log();
console.log(`=== HECHO ===  ok=${ok}  fail=${fail}  borrados=${TO_DELETE.length}`);
process.exit(fail === 0 ? 0 : 1);
