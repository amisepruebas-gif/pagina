// Migración única — detecta y corrige slugs/SKUs duplicados en /products.
//
// Modo análisis (default): solo lee y escribe el plan a dedupe-plan.json.
//   node --env-file=.env.local scripts/dedupe-product-slugs.mjs
//
// Modo aplicar: ejecuta los updates en Firestore.
//   node --env-file=.env.local scripts/dedupe-product-slugs.mjs \
//        --apply --service-account=path/to/serviceAccount.json
//
// Estrategia: el doc más antiguo conserva su slug/SKU. Los demás se renombran
// a `<base>-2`, `<base>-3`… eligiendo el primer valor libre que no choque con
// ningún slug/SKU existente ni con otro renombramiento ya planeado.

import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply');
const saArg = process.argv.find((a) => a.startsWith('--service-account='));
const SERVICE_ACCOUNT_PATH = saArg ? saArg.split('=')[1] : null;

const PLAN_PATH = resolve(process.cwd(), 'scripts', 'dedupe-plan.json');

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

if (!config.projectId) {
  console.error(
    'Falta NEXT_PUBLIC_FIREBASE_PROJECT_ID. Ejecuta con --env-file=.env.local desde apps/web.'
  );
  process.exit(1);
}

console.log(`[dedupe] proyecto: ${config.projectId}`);
console.log(`[dedupe] modo: ${APPLY ? 'APLICAR' : 'análisis (read-only)'}`);
console.log();

const app = initializeApp(config);
const db = getFirestore(app);

const snap = await getDocs(collection(db, 'products'));
const products = snap.docs.map((d) => {
  const data = d.data();
  return {
    id: d.id,
    name: typeof data.name === 'string' ? data.name : '(sin nombre)',
    slug: typeof data.slug === 'string' ? data.slug : null,
    sku: typeof data.sku === 'string' && data.sku.length > 0 ? data.sku : null,
    // createdAt puede ser Timestamp o null/undefined
    createdAtMs: data.createdAt?.toMillis?.() ?? 0
  };
});

console.log(`[dedupe] productos leídos: ${products.length}`);

// --- Detección y planeación ------------------------------------------------
// Construye plan: array de { id, name, slug?: { from, to }, sku?: { from, to } }

function planRenames(field) {
  // Mapa valor → docs ordenados por createdAt asc (oldest first)
  const byValue = new Map();
  for (const p of products) {
    const v = p[field];
    if (!v) continue;
    if (!byValue.has(v)) byValue.set(v, []);
    byValue.get(v).push(p);
  }
  // Set de valores ya usados (incluye TODOS los actuales, no solo los duplicados)
  const taken = new Set(products.map((p) => p[field]).filter(Boolean));

  // Cambios por docId
  const renames = new Map(); // id -> { from, to }

  for (const [value, docs] of byValue.entries()) {
    if (docs.length <= 1) continue;
    docs.sort((a, b) => a.createdAtMs - b.createdAtMs);
    // El primero (más antiguo) conserva el valor original.
    // Los demás reciben sufijo -2, -3… hasta encontrar uno libre.
    for (let i = 1; i < docs.length; i++) {
      const doc = docs[i];
      let n = 2;
      let candidate = `${value}-${n}`;
      while (taken.has(candidate)) {
        n++;
        candidate = `${value}-${n}`;
        if (n > 99) {
          throw new Error(
            `No se encontró ${field} libre para "${value}" tras 99 intentos`
          );
        }
      }
      taken.add(candidate);
      renames.set(doc.id, { from: value, to: candidate });
    }
  }
  return renames;
}

const slugRenames = planRenames('slug');
const skuRenames = planRenames('sku');

const plan = [];
const changedIds = new Set([...slugRenames.keys(), ...skuRenames.keys()]);
for (const id of changedIds) {
  const p = products.find((x) => x.id === id);
  const entry = { id, name: p.name };
  if (slugRenames.has(id)) entry.slug = slugRenames.get(id);
  if (skuRenames.has(id)) entry.sku = skuRenames.get(id);
  plan.push(entry);
}

// Productos con slug nulo (defensive): los reporto pero no los toco.
const withoutSlug = products.filter((p) => !p.slug);

console.log();
console.log('=== RESUMEN ===');
console.log(`Productos con slug nulo (no se tocan): ${withoutSlug.length}`);
console.log(`Slugs duplicados → renombramientos: ${slugRenames.size}`);
console.log(`SKUs duplicados → renombramientos: ${skuRenames.size}`);
console.log(`Productos a actualizar (total): ${plan.length}`);
console.log();

if (plan.length > 0) {
  console.log('=== PLAN ===');
  for (const e of plan) {
    const parts = [];
    if (e.slug) parts.push(`slug: "${e.slug.from}" → "${e.slug.to}"`);
    if (e.sku) parts.push(`sku: "${e.sku.from}" → "${e.sku.to}"`);
    console.log(`• ${e.id}  «${e.name}»`);
    for (const p of parts) console.log(`    ${p}`);
  }
  console.log();
}

if (withoutSlug.length > 0) {
  console.log('=== PRODUCTOS SIN SLUG (revisar manualmente) ===');
  for (const p of withoutSlug) {
    console.log(`• ${p.id}  «${p.name}»`);
  }
  console.log();
}

await writeFile(PLAN_PATH, JSON.stringify(plan, null, 2), 'utf-8');
console.log(`[dedupe] plan escrito a: ${PLAN_PATH}`);

// --- Aplicar ----------------------------------------------------------------
if (!APPLY) {
  console.log();
  console.log(
    'Esto fue solo análisis. Para aplicar, vuelve a ejecutar con:'
  );
  console.log(
    '  node --env-file=.env.local scripts/dedupe-product-slugs.mjs \\'
  );
  console.log('       --apply --service-account=<ruta-a-serviceAccount.json>');
  process.exit(0);
}

if (plan.length === 0) {
  console.log('[dedupe] nada para aplicar — todo limpio.');
  process.exit(0);
}

if (!SERVICE_ACCOUNT_PATH) {
  console.error(
    '[dedupe] --apply requiere --service-account=<ruta-a-serviceAccount.json>.'
  );
  console.error(
    '         Descárgalo en Firebase Console → Project Settings → Service accounts.'
  );
  process.exit(1);
}

console.log();
console.log(`[dedupe] aplicando con service account: ${SERVICE_ACCOUNT_PATH}`);

const saText = await readFile(SERVICE_ACCOUNT_PATH, 'utf-8');
const sa = JSON.parse(saText);

const { initializeApp: initAdmin, cert } = await import('firebase-admin/app');
const { getFirestore: getAdminFirestore, FieldValue } = await import(
  'firebase-admin/firestore'
);

const adminApp = initAdmin({ credential: cert(sa), projectId: sa.project_id });
const adminDb = getAdminFirestore(adminApp);

let ok = 0;
let fail = 0;
for (const e of plan) {
  const update = { updatedAt: FieldValue.serverTimestamp() };
  if (e.slug) update.slug = e.slug.to;
  if (e.sku) update.sku = e.sku.to;
  try {
    await adminDb.collection('products').doc(e.id).update(update);
    ok++;
    console.log(`  ✓ ${e.id} actualizado`);
  } catch (err) {
    fail++;
    console.error(`  ✗ ${e.id} falló:`, err.message);
  }
}

console.log();
console.log(`[dedupe] aplicado. ok=${ok} fail=${fail}`);
process.exit(fail === 0 ? 0 : 1);
