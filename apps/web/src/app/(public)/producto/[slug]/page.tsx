import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProductImages } from '@/lib/products';
import ProductGallery from '@/components/product/ProductGallery';
import ProductBuyArea from '@/components/product/ProductBuyArea';
import { VolumePricing } from '@/components/product/VolumePricing';
import { SpecsTable } from '@/components/product/SpecsTable';
import { SectionTitle } from '@/components/product/SectionTitle';
import RelatedProducts from '@/components/product/RelatedProducts';
import ProductReviews from '@/components/product/ProductReviews';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { getConfig } from '@/lib/config';
import { getCategories } from '@/lib/categories';
import { getSubcategories } from '@/lib/subcategories';
import { getMaterials } from '@/lib/materials';

export const revalidate = 0;

function baseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
    'http://localhost:3030'
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Producto no encontrado · pagina' };

  const desc =
    product.description ??
    product.longDescription?.slice(0, 160) ??
    `${product.name} — $${product.price.toFixed(2)} ${product.currency}`;
  const image = product.primaryImageUrl;
  const url = `${baseUrl()}/producto/${product.slug}`;

  return {
    title: `${product.name} · pagina`,
    description: desc.slice(0, 200),
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: product.name,
      description: desc.slice(0, 200),
      url,
      images: image ? [{ url: image, alt: product.name }] : undefined
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: product.name,
      description: desc.slice(0, 200),
      images: image ? [image] : undefined
    }
  };
}

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [images, config, categories, subcategories, materials] =
    await Promise.all([
      getProductImages(product.id),
      getConfig(),
      getCategories(),
      getSubcategories(),
      getMaterials()
    ]);

  const specRows = [
    { label: 'SKU', value: product.sku ?? '' },
    {
      label: 'Categoría',
      value: product.categoryId
        ? categories.find((c) => c.id === product.categoryId)?.name ?? ''
        : ''
    },
    {
      label: 'Subcategoría',
      value: product.subcategoryId
        ? subcategories.find((s) => s.id === product.subcategoryId)?.name ?? ''
        : ''
    },
    {
      label: 'Material',
      value: product.materialId
        ? materials.find((m) => m.id === product.materialId)?.name ?? ''
        : ''
    }
  ];

  const productUrl = `${baseUrl()}/producto/${product.slug}`;
  const imageUrls = [
    product.primaryImageUrl,
    ...images.map((i) => i.url)
  ].filter((u): u is string => Boolean(u));
  const inStock = typeof product.stock !== 'number' || product.stock > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-10">
      <JsonLd
        data={{
          '@context': 'https://schema.org/',
          '@type': 'Product',
          name: product.name,
          description:
            product.description ??
            product.longDescription?.slice(0, 200) ??
            product.name,
          image: imageUrls.length > 0 ? imageUrls : undefined,
          sku: product.sku ?? undefined,
          offers: {
            '@type': 'Offer',
            url: productUrl,
            priceCurrency: product.currency,
            price: product.price.toFixed(2),
            availability: inStock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock'
          }
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: baseUrl() },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Tienda',
              item: `${baseUrl()}/shop`
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: product.name,
              item: productUrl
            }
          ]
        }}
      />

      <Breadcrumbs
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Tienda', href: '/shop' },
          { label: product.name }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <ProductGallery product={product} images={images} />
        <ProductBuyArea product={product} shipping={config.shipping} />
      </div>

      {product.longDescription && (
        <section className="py-12 border-t border-border mt-8">
          <SectionTitle eyebrow="Descripción">
            Sobre este producto
          </SectionTitle>
          <p className="text-base sm:text-lg leading-relaxed text-text-muted max-w-3xl whitespace-pre-wrap">
            {product.longDescription}
          </p>
        </section>
      )}

      <SpecsTable rows={specRows} />
      <VolumePricing product={product} />
      <ProductReviews productId={product.id} />
      <RelatedProducts current={product} />
    </div>
  );
}
