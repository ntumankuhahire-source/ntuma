import QuickShopList from '@/components/QuickShopList';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Quick Shop List — Ntuma',
  description: "Know exactly what you need? Type your list and we'll handle the rest.",
};

export default function QuickListPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <QuickShopList />
      </main>
      <Footer />
    </>
  );
}
