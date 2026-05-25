import { beforeAll, afterAll, beforeEach, describe, it } from 'vitest';
import {
  assertSucceeds,
  assertFails,
  type RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { getEnv, teardown, authedAs, anon } from './helpers';

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await getEnv();
});

afterAll(async () => {
  await teardown();
});

beforeEach(async () => {
  await env.clearFirestore();
});

/** Seed que ignora las reglas (admin SDK del emulador). */
async function seed(path: string, data: Record<string, unknown>) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), path), data);
  });
}

// ============ CATÁLOGO PÚBLICO ============
describe('products', () => {
  it('cualquiera puede leer un producto', async () => {
    await seed('products/p1', { name: 'Llavero', price: 100 });
    await assertSucceeds(getDoc(doc(anon(env), 'products/p1')));
  });

  it('un customer NO puede escribir productos', async () => {
    const db = authedAs(env, 'u1', 'customer');
    await assertFails(setDoc(doc(db, 'products/p2'), { name: 'x' }));
  });

  it('staff NO puede escribir productos (solo admin)', async () => {
    const db = authedAs(env, 'u1', 'staff');
    await assertFails(setDoc(doc(db, 'products/p3'), { name: 'x' }));
  });

  it('admin puede escribir productos', async () => {
    const db = authedAs(env, 'admin1', 'admin');
    await assertSucceeds(setDoc(doc(db, 'products/p4'), { name: 'ok' }));
  });
});

// ============ VISTAS ============
describe('vistas', () => {
  it('cualquiera puede leer una vista', async () => {
    await seed('vistas/v1', { name: 'Promo', slug: 'promo', active: true });
    await assertSucceeds(getDoc(doc(anon(env), 'vistas/v1')));
  });

  it('un customer NO puede escribir vistas', async () => {
    const db = authedAs(env, 'u1', 'customer');
    await assertFails(setDoc(doc(db, 'vistas/v2'), { name: 'x' }));
  });

  it('staff NO puede escribir vistas (solo admin)', async () => {
    const db = authedAs(env, 's1', 'staff');
    await assertFails(setDoc(doc(db, 'vistas/v3'), { name: 'x' }));
  });

  it('admin puede crear y editar vistas', async () => {
    const db = authedAs(env, 'a1', 'admin');
    await assertSucceeds(
      setDoc(doc(db, 'vistas/v4'), { name: 'ok', slug: 'ok', active: true })
    );
  });
});

// ============ USUARIO ============
describe('users/{uid}', () => {
  it('el dueño puede leer su propio doc', async () => {
    await seed('users/u1', { role: 'customer', email: 'a@b.com' });
    const db = authedAs(env, 'u1', 'customer');
    await assertSucceeds(getDoc(doc(db, 'users/u1')));
  });

  it('un usuario NO puede leer el doc de otro', async () => {
    await seed('users/u2', { role: 'customer' });
    const db = authedAs(env, 'u1', 'customer');
    await assertFails(getDoc(doc(db, 'users/u2')));
  });

  it('staff puede leer el doc de cualquier usuario', async () => {
    await seed('users/u2', { role: 'customer' });
    const db = authedAs(env, 's1', 'staff');
    await assertSucceeds(getDoc(doc(db, 'users/u2')));
  });

  it('el dueño puede escribir su propio doc', async () => {
    const db = authedAs(env, 'u1', 'customer');
    await assertSucceeds(setDoc(doc(db, 'users/u1'), { displayName: 'Yo' }));
  });

  it('un customer NO puede escribir el doc de otro', async () => {
    const db = authedAs(env, 'u1', 'customer');
    await assertFails(setDoc(doc(db, 'users/u2'), { role: 'admin' }));
  });

  it('un customer NO puede auto-promoverse a admin', async () => {
    await seed('users/u1', { role: 'customer', active: true });
    const db = authedAs(env, 'u1', 'customer');
    await assertFails(
      setDoc(doc(db, 'users/u1'), { role: 'admin' }, { merge: true })
    );
  });

  it('un customer NO puede cambiar su propio `active`', async () => {
    await seed('users/u1', { role: 'customer', active: true });
    const db = authedAs(env, 'u1', 'customer');
    await assertFails(
      setDoc(doc(db, 'users/u1'), { active: false }, { merge: true })
    );
  });

  it('un customer NO puede crear su doc ya con role admin', async () => {
    const db = authedAs(env, 'u1', 'customer');
    await assertFails(
      setDoc(doc(db, 'users/u1'), { role: 'admin', active: true })
    );
  });

  it('el dueño SÍ puede editar su perfil sin tocar role/active', async () => {
    await seed('users/u1', { role: 'customer', active: true });
    const db = authedAs(env, 'u1', 'customer');
    await assertSucceeds(
      setDoc(doc(db, 'users/u1'), { displayName: 'Nuevo' }, { merge: true })
    );
  });

  it('un admin SÍ puede cambiar el role de otro usuario', async () => {
    await seed('users/u2', { role: 'customer', active: true });
    const db = authedAs(env, 'a1', 'admin');
    await assertSucceeds(
      setDoc(doc(db, 'users/u2'), { role: 'staff' }, { merge: true })
    );
  });
});

describe('users/{uid}/favorites', () => {
  it('el dueño gestiona sus favoritos', async () => {
    const db = authedAs(env, 'u1', 'customer');
    await assertSucceeds(setDoc(doc(db, 'users/u1/favorites/p1'), { at: 1 }));
    await assertSucceeds(getDoc(doc(db, 'users/u1/favorites/p1')));
  });

  it('otro usuario NO puede ver favoritos ajenos', async () => {
    await seed('users/u1/favorites/p1', { at: 1 });
    const db = authedAs(env, 'u2', 'customer');
    await assertFails(getDoc(doc(db, 'users/u1/favorites/p1')));
  });
});

// ============ CARRITOS ============
describe('carts/{cartId}', () => {
  it('el dueño puede leer y escribir su carrito', async () => {
    const db = authedAs(env, 'u1', 'customer');
    await assertSucceeds(setDoc(doc(db, 'carts/u1'), { items: [] }));
    await assertSucceeds(getDoc(doc(db, 'carts/u1')));
  });

  it('un usuario NO puede tocar el carrito de otro', async () => {
    await seed('carts/u1', { items: [] });
    const db = authedAs(env, 'u2', 'customer');
    await assertFails(getDoc(doc(db, 'carts/u1')));
    await assertFails(setDoc(doc(db, 'carts/u1'), { items: [{ x: 1 }] }));
  });

  it('anónimo NO puede leer carritos', async () => {
    await seed('carts/u1', { items: [] });
    await assertFails(getDoc(doc(anon(env), 'carts/u1')));
  });
});

// ============ ÓRDENES ============
describe('orders/{id}', () => {
  it('NADIE puede crear órdenes desde el cliente (solo Admin SDK)', async () => {
    const customer = authedAs(env, 'u1', 'customer');
    await assertFails(setDoc(doc(customer, 'orders/o1'), { userId: 'u1' }));

    const admin = authedAs(env, 'a1', 'admin');
    await assertFails(setDoc(doc(admin, 'orders/o2'), { userId: 'a1' }));
  });

  it('el dueño puede leer su orden', async () => {
    await seed('orders/o1', { userId: 'u1', total: 100 });
    const db = authedAs(env, 'u1', 'customer');
    await assertSucceeds(getDoc(doc(db, 'orders/o1')));
  });

  it('un usuario NO puede leer la orden de otro', async () => {
    await seed('orders/o1', { userId: 'u1', total: 100 });
    const db = authedAs(env, 'u2', 'customer');
    await assertFails(getDoc(doc(db, 'orders/o1')));
  });

  it('staff puede leer cualquier orden', async () => {
    await seed('orders/o1', { userId: 'u1', total: 100 });
    const db = authedAs(env, 's1', 'staff');
    await assertSucceeds(getDoc(doc(db, 'orders/o1')));
  });

  it('staff puede actualizar una orden (cambio de status)', async () => {
    await seed('orders/o1', {
      userId: 'u1',
      status: 'processing',
      total: 100,
      orderNumber: 'P-1'
    });
    const db = authedAs(env, 's1', 'staff');
    await assertSucceeds(
      setDoc(doc(db, 'orders/o1'), { status: 'shipped' }, { merge: true })
    );
  });

  it('staff NO puede cambiar el total de una orden', async () => {
    await seed('orders/o1', {
      userId: 'u1',
      status: 'processing',
      total: 100,
      orderNumber: 'P-1'
    });
    const db = authedAs(env, 's1', 'staff');
    await assertFails(
      setDoc(doc(db, 'orders/o1'), { total: 1 }, { merge: true })
    );
  });

  it('un customer NO puede actualizar su propia orden', async () => {
    await seed('orders/o1', { userId: 'u1', status: 'processing' });
    const db = authedAs(env, 'u1', 'customer');
    await assertFails(
      setDoc(doc(db, 'orders/o1'), { status: 'delivered' }, { merge: true })
    );
  });

  it('nadie puede borrar una orden', async () => {
    await seed('orders/o1', { userId: 'u1' });
    const db = authedAs(env, 'a1', 'admin');
    await assertFails(deleteDoc(doc(db, 'orders/o1')));
  });
});

// ============ QUEJAS ============
describe('complaints/{id}', () => {
  it('cualquier usuario autenticado puede crear una queja', async () => {
    const db = authedAs(env, 'u1', 'customer');
    await assertSucceeds(
      setDoc(doc(db, 'complaints/c1'), { userId: 'u1', description: 'x' })
    );
  });

  it('anónimo NO puede crear quejas', async () => {
    await assertFails(
      setDoc(doc(anon(env), 'complaints/c2'), { userId: 'x' })
    );
  });

  it('un customer NO puede crear una queja a nombre de otro', async () => {
    const db = authedAs(env, 'u1', 'customer');
    await assertFails(
      setDoc(doc(db, 'complaints/c3'), { userId: 'u2', description: 'x' })
    );
  });

  it('el dueño puede leer su queja', async () => {
    await seed('complaints/c1', { userId: 'u1', description: 'x' });
    const db = authedAs(env, 'u1', 'customer');
    await assertSucceeds(getDoc(doc(db, 'complaints/c1')));
  });

  it('un customer NO puede leer la queja de otro', async () => {
    await seed('complaints/c1', { userId: 'u1' });
    const db = authedAs(env, 'u2', 'customer');
    await assertFails(getDoc(doc(db, 'complaints/c1')));
  });

  it('solo staff puede actualizar quejas (resolver)', async () => {
    await seed('complaints/c1', { userId: 'u1', status: 'open' });
    const owner = authedAs(env, 'u1', 'customer');
    await assertFails(setDoc(doc(owner, 'complaints/c1'), { status: 'resolved' }));

    const staff = authedAs(env, 's1', 'staff');
    await assertSucceeds(
      setDoc(doc(staff, 'complaints/c1'), { status: 'resolved' })
    );
  });
});

// ============ RESEÑAS ============
describe('reviews/{id}', () => {
  it('cualquiera puede leer reseñas', async () => {
    await seed('reviews/p1_u1', { productId: 'p1', userId: 'u1', rating: 5 });
    await assertSucceeds(getDoc(doc(anon(env), 'reviews/p1_u1')));
  });

  it('un usuario autenticado crea su propia reseña', async () => {
    const db = authedAs(env, 'u1', 'customer');
    await assertSucceeds(
      setDoc(doc(db, 'reviews/p1_u1'), {
        productId: 'p1',
        userId: 'u1',
        rating: 4,
        text: 'buena'
      })
    );
  });

  it('un usuario NO puede crear una reseña a nombre de otro', async () => {
    const db = authedAs(env, 'u1', 'customer');
    await assertFails(
      setDoc(doc(db, 'reviews/p1_u2'), {
        productId: 'p1',
        userId: 'u2',
        rating: 1
      })
    );
  });

  it('anónimo NO puede crear reseñas', async () => {
    await assertFails(
      setDoc(doc(anon(env), 'reviews/p1_x'), { productId: 'p1', userId: 'x' })
    );
  });

  it('el autor puede editar su reseña', async () => {
    await seed('reviews/p1_u1', { productId: 'p1', userId: 'u1', rating: 3 });
    const db = authedAs(env, 'u1', 'customer');
    await assertSucceeds(
      setDoc(doc(db, 'reviews/p1_u1'), { rating: 5 }, { merge: true })
    );
  });

  it('un usuario NO puede editar la reseña de otro', async () => {
    await seed('reviews/p1_u1', { productId: 'p1', userId: 'u1', rating: 3 });
    const db = authedAs(env, 'u2', 'customer');
    await assertFails(
      setDoc(doc(db, 'reviews/p1_u1'), { rating: 1 }, { merge: true })
    );
  });

  it('staff puede ocultar y borrar reseñas', async () => {
    await seed('reviews/p1_u1', { productId: 'p1', userId: 'u1', rating: 3 });
    const db = authedAs(env, 's1', 'staff');
    await assertSucceeds(
      setDoc(doc(db, 'reviews/p1_u1'), { hidden: true }, { merge: true })
    );
    await assertSucceeds(deleteDoc(doc(db, 'reviews/p1_u1')));
  });

  it('un customer NO puede borrar reseñas', async () => {
    await seed('reviews/p1_u1', { productId: 'p1', userId: 'u1', rating: 3 });
    const db = authedAs(env, 'u1', 'customer');
    await assertFails(deleteDoc(doc(db, 'reviews/p1_u1')));
  });

  it('NO puede crear reseña con un id que no es {productId}_{uid}', async () => {
    const db = authedAs(env, 'u1', 'customer');
    await assertFails(
      setDoc(doc(db, 'reviews/id-arbitrario'), {
        productId: 'p1',
        userId: 'u1',
        rating: 5
      })
    );
  });

  it('NO puede crear reseña con rating fuera de rango', async () => {
    const db = authedAs(env, 'u1', 'customer');
    await assertFails(
      setDoc(doc(db, 'reviews/p1_u1'), {
        productId: 'p1',
        userId: 'u1',
        rating: 99
      })
    );
  });

  it('el autor NO puede revertir la ocultación (hidden) de su reseña', async () => {
    await seed('reviews/p1_u1', {
      productId: 'p1',
      userId: 'u1',
      rating: 3,
      hidden: true
    });
    const db = authedAs(env, 'u1', 'customer');
    await assertFails(
      setDoc(doc(db, 'reviews/p1_u1'), { hidden: false }, { merge: true })
    );
  });
});

// ============ COUNTERS ============
describe('counters/{name}', () => {
  it('staff puede leer counters', async () => {
    await seed('counters/orders', { value: 5 });
    const db = authedAs(env, 's1', 'staff');
    await assertSucceeds(getDoc(doc(db, 'counters/orders')));
  });

  it('nadie puede escribir counters desde el cliente', async () => {
    const db = authedAs(env, 'a1', 'admin');
    await assertFails(setDoc(doc(db, 'counters/orders'), { value: 99 }));
  });
});

// ============ DENY POR DEFECTO ============
describe('deny por defecto', () => {
  it('una colección desconocida está bloqueada', async () => {
    const db = authedAs(env, 'a1', 'admin');
    await assertFails(getDoc(doc(db, 'coleccionRandom/x')));
    await assertFails(setDoc(doc(db, 'coleccionRandom/x'), { a: 1 }));
  });
});
