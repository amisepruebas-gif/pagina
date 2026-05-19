import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProductImages } from '@/lib/products';
import ProductGallery from '@/components/product/ProductGallery';
import AddToCartForm from '@/components/product/AddToCartForm';
import BulkPricing from '@/components/product/BulkPricing';

export const revalidate = 0;

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const images = await getProductImages(product.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-accent">
          Inicio
        </Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link href="/shop" className="hover:text-accent">
          Tienda
        </Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery product={product} images={images} />

        <div>
          {product.sku && (
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              SKU: {product.sku}
            </p>
          )}
          <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice !== undefined &&
              product.originalPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            <span className="text-sm text-gray-500">{product.currency}</span>
            {product.originalPrice !== undefined &&
              product.originalPrice > product.price && (
                <span className="rounded-full bg-accent text-white text-xs font-bold px-2.5 py-1">
                  −{Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100
                  )}
                  %
                </span>
              )}
          </div>

          {product.description && (
            <p className="mt-6 text-gray-700 leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="mt-8">
            <AddToCartForm product={product} />
          </div>

          <BulkPricing product={product} />

          {product.longDescription && (
            <div className="mt-10">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                Descripción
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.longDescription}
              </p>
            </div>
          )}

          {product.tagIds.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {product.tagIds.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
