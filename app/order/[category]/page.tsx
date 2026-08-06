import ProductList from '@/components/ProductList';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CategoryPage({ params }: { params: { category: string } }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <ProductList categoryId={params.category} />
      </main>
      <Footer />
    </>
  );
}
