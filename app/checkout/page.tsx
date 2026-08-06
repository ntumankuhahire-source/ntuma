import CheckoutDashboard from '@/components/CheckoutDashboard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/50">
        <CheckoutDashboard />
      </main>
      <Footer />
    </>
  );
}
