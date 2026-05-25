import { notFound } from 'next/navigation';
import { getSiteContentById } from '@/lib/site-content';
import SiteContentForm from '@/components/admin/SiteContentForm';
import type { SiteContentFormValues } from '@/lib/admin/site-content-admin';

export const revalidate = 0;

function toDateInputStr(d?: Date): string {
  if (!d) return '';
  return d.toISOString().slice(0, 10);
}

export default async function EditSiteContentPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await getSiteContentById(id);
  if (!c) notFound();

  const initial: Partial<SiteContentFormValues> & { id: string } = {
    id,
    kind: c.kind,
    name: c.name,
    page: c.page,
    order: c.order,
    active: c.active,
    validFrom: toDateInputStr(c.validFrom),
    validUntil: toDateInputStr(c.validUntil)
  };

  if (c.kind === 'hero' || c.kind === 'promo-banner') {
    initial.title = c.title;
    initial.subtitle = c.subtitle;
    initial.imageUrl = c.imageUrl;
    initial.gradient = c.gradient;
  }
  if (c.kind === 'hero') {
    initial.ctaText = c.ctaText;
    initial.ctaHref = c.ctaHref;
  }
  if (c.kind === 'promo-banner') {
    initial.href = c.href;
  }
  if (c.kind === 'topbar') {
    initial.message = c.message;
    initial.backgroundColor = c.backgroundColor;
    initial.textColor = c.textColor;
  }

  return <SiteContentForm initial={initial} />;
}
