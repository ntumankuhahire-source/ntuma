import CategoryGrid from '@/components/CategoryGrid';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OrderPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <CategoryGrid />
      </main>
      <Footer />
    </>
  );
}
