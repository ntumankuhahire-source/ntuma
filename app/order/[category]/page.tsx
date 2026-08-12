import ProductList from '@/components/ProductList';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
