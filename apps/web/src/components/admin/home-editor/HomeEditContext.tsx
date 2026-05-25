'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react';
import type { HomeConfig } from '@/types/home-config';
import {
  emptyModule,
  type ViewModule,
  type ViewModuleType
} from '@/types/page-view';
import { saveHomeConfig } from '@/lib/admin/home-config-admin';
import { useImageCleanup } from '@/lib/admin/use-image-cleanup';

/** Junta todas las URLs de imágenes vivas en el HomeConfig actual. */
function collectHomeImages(config: HomeConfig): string[] {
  const out: string[] = [];
  for (const c of config.hero.cards) {
    if (c.imageUrl) out.push(c.imageUrl);
  }
  for (const b of config.hero.backgroundImages) {
    if (b.url) out.push(b.url);
  }
  if (config.promoBanner.bgImageUrl) out.push(config.promoBanner.bgImageUrl);
  for (const c of config.promoBanner.cards) {
    if (c.imageUrl) out.push(c.imageUrl);
  }
  if (config.flashSale.bgImageUrl) out.push(config.flashSale.bgImageUrl);
  for (const m of config.modules) {
    if (m.banners) {
      for (const b of m.banners) if (b.imageUrl) out.push(b.imageUrl);
    }
  }
  return out;
}

/** Lee un valor anidado por ruta con puntos, ej. `getByPath(cfg, 'hero.badge')`. */
function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/** Devuelve una copia de `obj` con la ruta actualizada — inmutable. */
function setByPath<T>(obj: T, path: string, value: unknown): T {
  const [head, ...rest] = path.split('.');
  const record = obj as Record<string, unknown>;
  if (rest.length === 0) {
    return { ...record, [head]: value } as T;
  }
  const child = (record[head] ?? {}) as Record<string, unknown>;
  return {
    ...record,
    [head]: setByPath(child, rest.join('.'), value)
  } as T;
}

interface HomeEditContextValue {
  form: HomeConfig;
  /** Bloque seleccionado: id de sección nativa o id de módulo. */
  selectedRef: string | null;
  isDirty: boolean;
  saving: boolean;
  justSaved: boolean;
  error: string | null;
  selectRef: (ref: string | null) => void;
  getField: (path: string) => unknown;
  setField: (path: string, value: unknown) => void;
  updateArrayItem: (
    path: string,
    index: number,
    key: string,
    value: unknown
  ) => void;
  addArrayItem: (path: string, newItem: unknown) => void;
  removeArrayItem: (path: string, index: number) => void;
  /** Reordena el `layout` moviendo la entrada `from` a la posición `to`. */
  moveBlock: (from: number, to: number) => void;
  /** Muestra/oculta un bloque del layout. */
  toggleBlockVisible: (ref: string) => void;
  /** Crea un módulo del tipo dado, lo agrega al final y lo devuelve. */
  addModule: (type: ViewModuleType) => string;
  /** Elimina un módulo (de `modules` y del `layout`). */
  removeModule: (ref: string) => void;
  /** Aplica cambios parciales a un módulo. */
  updateModule: (id: string, patch: Partial<ViewModule>) => void;
  /** Anota una imagen recién subida (para limpiar si no se guarda). */
  onImageUploaded: (url: string) => void;
  /** Anota una imagen sustituida o quitada (para borrar al guardar OK). */
  onImageReplaced: (oldUrl: string) => void;
  /** Borra de Storage las imágenes subidas sin guardar. */
  rollbackImages: () => Promise<void>;
  save: () => Promise<void>;
}

const HomeEditContext = createContext<HomeEditContextValue | null>(null);

/** Hook para consumir el contexto del editor del Home. */
export function useHomeEdit(): HomeEditContextValue {
  const ctx = useContext(HomeEditContext);
  if (!ctx) {
    throw new Error('useHomeEdit debe usarse dentro de <HomeEditProvider>');
  }
  return ctx;
}

export function HomeEditProvider({
  initialConfig,
  children
}: {
  initialConfig: HomeConfig;
  children: ReactNode;
}) {
  const [form, setForm] = useState<HomeConfig>(initialConfig);
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Cleanup de imágenes — desestructuramos para que las refs sean estables.
  const {
    onUploaded: onImageUploaded,
    onReplace: onImageReplaced,
    commit: commitImages,
    rollback: rollbackImages
  } = useImageCleanup();

  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  const markDirty = useCallback(() => {
    setIsDirty(true);
    setJustSaved(false);
  }, []);

  const getField = useCallback((path: string) => getByPath(form, path), [form]);

  const setField = useCallback(
    (path: string, value: unknown) => {
      setForm((prev) => setByPath(prev, path, value));
      markDirty();
    },
    [markDirty]
  );

  const updateArrayItem = useCallback(
    (path: string, index: number, key: string, value: unknown) => {
      setForm((prev) => {
        const arr = getByPath(prev, path);
        if (!Array.isArray(arr)) return prev;
        const next = arr.map((item, i) =>
          i === index ? { ...(item as object), [key]: value } : item
        );
        return setByPath(prev, path, next);
      });
      markDirty();
    },
    [markDirty]
  );

  const addArrayItem = useCallback(
    (path: string, newItem: unknown) => {
      setForm((prev) => {
        const arr = getByPath(prev, path);
        const next = Array.isArray(arr) ? [...arr, newItem] : [newItem];
        return setByPath(prev, path, next);
      });
      markDirty();
    },
    [markDirty]
  );

  const removeArrayItem = useCallback(
    (path: string, index: number) => {
      setForm((prev) => {
        const arr = getByPath(prev, path);
        if (!Array.isArray(arr)) return prev;
        return setByPath(
          prev,
          path,
          arr.filter((_, i) => i !== index)
        );
      });
      markDirty();
    },
    [markDirty]
  );

  const moveBlock = useCallback(
    (from: number, to: number) => {
      setForm((prev) => {
        const layout = [...prev.layout];
        if (
          from < 0 ||
          from >= layout.length ||
          to < 0 ||
          to >= layout.length ||
          from === to
        ) {
          return prev;
        }
        const [moved] = layout.splice(from, 1);
        layout.splice(to, 0, moved);
        return { ...prev, layout };
      });
      markDirty();
    },
    [markDirty]
  );

  const toggleBlockVisible = useCallback(
    (ref: string) => {
      setForm((prev) => ({
        ...prev,
        layout: prev.layout.map((e) =>
          e.ref === ref ? { ...e, visible: !e.visible } : e
        )
      }));
      markDirty();
    },
    [markDirty]
  );

  const addModule = useCallback(
    (type: ViewModuleType) => {
      const mod = emptyModule(type);
      setForm((prev) => ({
        ...prev,
        modules: [...prev.modules, mod],
        layout: [...prev.layout, { ref: mod.id, visible: true }]
      }));
      markDirty();
      return mod.id;
    },
    [markDirty]
  );

  const removeModule = useCallback(
    (ref: string) => {
      setForm((prev) => {
        const mod = prev.modules.find((m) => m.id === ref);
        // Si el módulo tenía banners con imágenes, las anotamos como
        // sustituidas para que se borren de Storage al guardar.
        if (mod?.banners) {
          for (const b of mod.banners) {
            if (b.imageUrl) onImageReplaced(b.imageUrl);
          }
        }
        return {
          ...prev,
          modules: prev.modules.filter((m) => m.id !== ref),
          layout: prev.layout.filter((e) => e.ref !== ref)
        };
      });
      setSelectedRef((cur) => (cur === ref ? null : cur));
      markDirty();
    },
    [onImageReplaced, markDirty]
  );

  const updateModule = useCallback(
    (id: string, patch: Partial<ViewModule>) => {
      setForm((prev) => ({
        ...prev,
        modules: prev.modules.map((m) =>
          m.id === id ? { ...m, ...patch } : m
        )
      }));
      markDirty();
    },
    [markDirty]
  );

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await saveHomeConfig(form);
      // Borra de Storage las imágenes sustituidas o subidas sin uso final.
      await commitImages(collectHomeImages(form));
      setIsDirty(false);
      setJustSaved(true);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setJustSaved(false), 3500);
    } catch (err) {
      console.error('[HOME] error al guardar', err);
      setError('No se pudo guardar. Revisa la conexión e inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  }, [form, commitImages]);

  const value = useMemo<HomeEditContextValue>(
    () => ({
      form,
      selectedRef,
      isDirty,
      saving,
      justSaved,
      error,
      selectRef: setSelectedRef,
      getField,
      setField,
      updateArrayItem,
      addArrayItem,
      removeArrayItem,
      moveBlock,
      toggleBlockVisible,
      addModule,
      removeModule,
      updateModule,
      onImageUploaded,
      onImageReplaced,
      rollbackImages,
      save
    }),
    [
      form,
      selectedRef,
      isDirty,
      saving,
      justSaved,
      error,
      getField,
      setField,
      updateArrayItem,
      addArrayItem,
      removeArrayItem,
      moveBlock,
      toggleBlockVisible,
      addModule,
      removeModule,
      updateModule,
      onImageUploaded,
      onImageReplaced,
      rollbackImages,
      save
    ]
  );

  return (
    <HomeEditContext.Provider value={value}>
      {children}
    </HomeEditContext.Provider>
  );
}
