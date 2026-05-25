import type { IconName } from '@/components/ui';

export type AdminNavItem = {
  id: string;
  label: string;
  icon: IconName;
  href: string;
};
export type AdminNavGroup = { group: string; items: AdminNavItem[] };

/** Ítems del sidebar del admin agrupados por sección. */
export const ADMIN_NAV: AdminNavGroup[] = [
  {
    group: 'Visión',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'grid', href: '/admin' },
      { id: 'reportes', label: 'Reportes', icon: 'spark', href: '/admin/reportes' }
    ]
  },
  {
    group: 'Catálogo',
    items: [
      { id: 'productos', label: 'Productos', icon: 'tag', href: '/admin/productos' },
      { id: 'categorias', label: 'Categorías', icon: 'menu', href: '/admin/categorias' },
      { id: 'taxonomias', label: 'Taxonomías', icon: 'grid', href: '/admin/taxonomias' },
      { id: 'descuentos', label: 'Descuentos', icon: 'bolt', href: '/admin/descuentos' }
    ]
  },
  {
    group: 'Operación',
    items: [
      { id: 'pedidos', label: 'Pedidos', icon: 'cart', href: '/admin/pedidos' },
      { id: 'usuarios', label: 'Usuarios', icon: 'user', href: '/admin/usuarios' },
      { id: 'chats', label: 'Chats', icon: 'info', href: '/admin/chats' },
      { id: 'quejas', label: 'Quejas', icon: 'warn', href: '/admin/quejas' },
      {
        id: 'tipos-queja',
        label: 'Tipos de queja',
        icon: 'menu',
        href: '/admin/tipos-queja'
      },
      {
        id: 'resenas',
        label: 'Reseñas',
        icon: 'star-filled',
        href: '/admin/resenas'
      }
    ]
  },
  {
    group: 'Sitio',
    items: [
      { id: 'contenido', label: 'Contenido', icon: 'grid', href: '/admin/contenido' },
      { id: 'vistas', label: 'Vistas', icon: 'eye', href: '/admin/vistas' },
      {
        id: 'configuracion',
        label: 'Configuración',
        icon: 'shield',
        href: '/admin/configuracion'
      }
    ]
  }
];
