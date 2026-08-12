import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ntumankuhahire.com'),
  title: 'Ntuma Nkuhahire — Vendor to Door Delivery in Kigali',
  description:
    'Tell us what you need and a budget — Ntuma runners buy it from your chosen vendor in Kigali (Gasabo, Kicukiro, Nyarugenge) and deliver it to you, with a WhatsApp update at every step.',
  keywords: ['delivery Rwanda', 'Gasabo delivery', 'Kicukiro delivery', 'Nyarugenge delivery', 'Kigali delivery', 'vendor delivery', 'grocery delivery Rwanda'],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Ntuma Nkuhahire — Vendor to Door Delivery',
    description:
      'Order from any vendor in Kigali — Gasabo, Kicukiro, and Nyarugenge. Set a budget, we shop it, you get an invoice and WhatsApp updates every step.',
    type: 'website',
    locale: 'en_RW',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'Ntuma Nkuhahire Logo',
      },
    ],
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
