import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ntuma Nkuhahire — Vendor to Door Delivery in Rwanda',
  description:
    'Tell us what you need and a budget — Ntuma runners buy it from your chosen vendor in Nyagatare or Kigali and deliver it to you, with a WhatsApp update at every step.',
  keywords: ['delivery Rwanda', 'Nyagatare delivery', 'Kigali delivery', 'vendor delivery', 'grocery delivery Rwanda'],
  openGraph: {
    title: 'Ntuma Nkuhahire — Vendor to Door Delivery',
    description:
      'Order from any vendor in Nyagatare and Kigali. Set a budget, we shop it, you get an invoice and WhatsApp updates every step.',
    type: 'website',
    locale: 'en_RW',
  },
}

import { ClientProviders } from '@/components/ClientProviders'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
