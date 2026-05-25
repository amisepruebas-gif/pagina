import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  initializeTestEnvironment,
  type RulesTestEnvironment
} from '@firebase/rules-unit-testing';

const PROJECT_ID = 'pagina-rules-test';

let env: RulesTestEnvironment | null = null;

/** Inicializa (una vez) el entorno de test apuntando al emulador de Firestore. */
export async function getEnv(): Promise<RulesTestEnvironment> {
  if (env) return env;
  env = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(resolve(__dirname, '../firestore.rules'), 'utf8')
    }
  });
  return env;
}

export async function teardown(): Promise<void> {
  if (env) {
    await env.cleanup();
    env = null;
  }
}

/** Contexto autenticado con un custom claim `role`. */
export function authedAs(
  e: RulesTestEnvironment,
  uid: string,
  role?: 'admin' | 'staff' | 'customer'
) {
  return e
    .authenticatedContext(uid, role ? { role } : {})
    .firestore();
}

/** Contexto sin autenticar. */
export function anon(e: RulesTestEnvironment) {
  return e.unauthenticatedContext().firestore();
}
