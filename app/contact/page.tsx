import { ContactClient } from '@/components/ContactClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us & Support in Kigali',
  description:
    'Have questions or need assistance with your errand or grocery order in Kigali? Contact Ntuma via WhatsApp (+250 787 800 703) or email info@ntumankuhahire.com.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Ntuma Nkuhahire | Delivery & Support in Kigali',
    description:
      'Get in touch with Ntuma dispatchers for order updates, partnerships, and customer assistance in Gasabo, Kicukiro, and Nyarugenge.',
    url: 'https://ntumankuhahire.com/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
