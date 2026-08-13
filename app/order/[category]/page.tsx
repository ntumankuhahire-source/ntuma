import ProductList from '@/components/ProductList';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCategoryById } from '@/lib/categories';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = getCategoryById(params.category);

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested product category was not found.',
    };
  }

  return {
    title: `${category.name} Delivery in Kigali`,
    description: `${category.relatedBy} ${category.includes} Shop ${category.name} with runner delivery across Kigali.`,
    alternates: {
      canonical: `/order/${category.id}`,
    },
    openGraph: {
      title: `${category.name} Delivery in Kigali | Ntuma Nkuhahire`,
      description: `${category.includes} Delivered from local markets and vendors straight to your door.`,
      url: `https://ntumankuhahire.com/order/${category.id}`,
    },
  };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/40 py-8">
        <ProductList categoryId={params.category} />
      </main>
      <Footer />
    </>
  );
}

