'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveConfig } from '@/lib/admin/config-admin';
import type { SiteConfig } from '@/types/config';
import { Button, Input, Textarea } from '@/components/ui';
import { AdminPageHeader } from './AdminPageHeader';
import { FormSection } from './FormSection';

interface ConfigFormProps {
  initial: SiteConfig;
}

/**
 * ConfigForm — configuración global del sitio (doc único `config/global`).
 * Secciones: branding · envío · contacto · redes sociales.
 */
export default function ConfigForm({ initial }: ConfigFormProps) {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<S extends keyof SiteConfig, K extends keyof SiteConfig[S]>(
    section: S,
    key: K,
    value: SiteConfig[S][K]
  ) {
    setConfig((c) => ({ ...c, [section]: { ...c[section], [key]: value } }));
  }

  async function handleSubmit() {
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      await saveConfig(config);
      console.log('[CONFIG] guardado desde el form');
      setSuccess(true);
      router.refresh();
    } catch (err) {
      console.error('[CONFIG] error guardando:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(
        msg.includes('PERMISSION_DENIED') || msg.includes('insufficient permissions')
          ? 'Permiso denegado. Verifica role=admin.'
          : `Error: ${msg}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Configuración' }]}
        title="Configuración global"
        description="Branding, envíos, contacto y redes sociales del sitio. Un solo doc en config/global."
        action={
          <Button onClick={handleSubmit} loading={submitting} trailingIcon="check">
            Guardar configuración
          </Button>
        }
      />

      <div className="p-6">
        <div className="max-w-4xl bg-surface border border-border rounded-lg px-6 pt-2 pb-6">
          <FormSection title="Branding" description="Identidad básica del sitio.">
            <Input
              label="Nombre del sitio"
              required
              value={config.branding.siteName}
              onChange={(e) => update('branding', 'siteName', e.target.value)}
            />
            <Textarea
              label="Descripción (SEO)"
              rows={2}
              value={config.branding.siteDescription}
              onChange={(e) => update('branding', 'siteDescription', e.target.value)}
              hint="Aparece en metadata SEO y en el footer."
            />
            <div>
              <div className="font-display font-semibold text-[13px] text-text mb-1.5">
                Color de marca
              </div>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={config.branding.accentColor}
                  onChange={(e) => update('branding', 'accentColor', e.target.value)}
                  className="size-12 p-0.5 border-[1.5px] border-border-strong rounded-sm bg-surface cursor-pointer"
                />
                <Input
                  value={config.branding.accentColor}
                  onChange={(e) => update('branding', 'accentColor', e.target.value)}
                  placeholder="#FF69B4"
                  className="font-mono"
                />
              </div>
              <p className="mt-1.5 text-text-soft text-xs leading-relaxed">
                Hoy el storefront sigue usando #FF69B4 hardcoded; este campo se
                cablea en un turno futuro.
              </p>
            </div>
          </FormSection>

          <FormSection
            title="Envío"
            description="Costo, umbral de envío gratis y paquetería predeterminada."
          >
            <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
              <Input
                label="Envío gratis desde (MXN)"
                type="number"
                inputMode="decimal"
                min={0}
                step="1"
                leadingIcon="bolt"
                value={String(config.shipping.freeFromMxn)}
                onChange={(e) =>
                  update('shipping', 'freeFromMxn', Number(e.target.value) || 0)
                }
                hint="Pedidos por encima de este monto no cobran envío."
              />
              <Input
                label="Costo de envío default (MXN)"
                type="number"
                inputMode="decimal"
                min={0}
                step="1"
                value={String(config.shipping.defaultCostMxn)}
                onChange={(e) =>
                  update('shipping', 'defaultCostMxn', Number(e.target.value) || 0)
                }
              />
              <Input
                label="Paquetería"
                leadingIcon="truck"
                value={config.shipping.carrier ?? ''}
                onChange={(e) => update('shipping', 'carrier', e.target.value)}
                placeholder="Skydropx, DHL, etc."
              />
            </div>
          </FormSection>

          <FormSection title="Contacto" description="Información de contacto pública.">
            <Input
              label="Email"
              type="email"
              leadingIcon="user"
              value={config.contact.email}
              onChange={(e) => update('contact', 'email', e.target.value)}
              placeholder="contacto@pagina.mx"
            />
            <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
              <Input
                label="Teléfono"
                type="tel"
                value={config.contact.phone ?? ''}
                onChange={(e) => update('contact', 'phone', e.target.value)}
              />
              <Input
                label="WhatsApp"
                type="tel"
                value={config.contact.whatsapp ?? ''}
                onChange={(e) => update('contact', 'whatsapp', e.target.value)}
                placeholder="+52 55 ..."
              />
            </div>
          </FormSection>

          <FormSection
            title="Redes sociales"
            description="URLs que aparecen en el footer del sitio."
          >
            <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
              <Input
                label="Facebook"
                type="url"
                placeholder="https://facebook.com/…"
                value={config.social.facebook ?? ''}
                onChange={(e) => update('social', 'facebook', e.target.value)}
              />
              <Input
                label="Instagram"
                type="url"
                placeholder="https://instagram.com/…"
                value={config.social.instagram ?? ''}
                onChange={(e) => update('social', 'instagram', e.target.value)}
              />
              <Input
                label="X / Twitter"
                type="url"
                placeholder="https://x.com/…"
                value={config.social.x ?? ''}
                onChange={(e) => update('social', 'x', e.target.value)}
              />
              <Input
                label="LinkedIn"
                type="url"
                placeholder="https://linkedin.com/…"
                value={config.social.linkedin ?? ''}
                onChange={(e) => update('social', 'linkedin', e.target.value)}
              />
              <Input
                label="WhatsApp (link)"
                type="url"
                placeholder="https://wa.me/521..."
                value={config.social.whatsapp ?? ''}
                onChange={(e) => update('social', 'whatsapp', e.target.value)}
              />
            </div>
          </FormSection>

          {error && (
            <div className="mt-2 rounded-md bg-error/10 border border-error/30 text-error text-sm px-4 py-3">
              {error}
            </div>
          )}
          {success && !error && (
            <div className="mt-2 rounded-md bg-brand-500/10 border border-brand-500/30 text-brand-600 text-sm px-4 py-3">
              Guardado ✓
            </div>
          )}
        </div>
      </div>
    </>
  );
}
