import { notFound } from 'next/navigation';
import { getCategoryById } from '@/lib/categories';
import CategoryForm from '@/components/admin/CategoryForm';

export const revalidate = 0;

export const metadata = {
  title: 'Editar categoría · admin'
};

export default async function EditCategoryPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cat = await getCategoryById(id);
  if (!cat) notFound();

  return (
    <CategoryForm
      initial={{
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        imageUrl: cat.imageUrl,
        gradient: cat.gradient,
        order: cat.order,
        active: cat.active
      }}
    />
  );
}
