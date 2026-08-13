import type { Metadata } from 'next'
import './globals.css'
import { ClientProviders } from '@/components/ClientProviders'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ntumankuhahire.com'),
  title: {
    default: 'Ntuma Nkuhahire — Vendor to Door Delivery in Kigali, Rwanda',
    template: '%s | Ntuma Nkuhahire',
  },
  description:
    'Tell us what you need and a budget — Ntuma runners buy it from your chosen vendor in Kigali (Gasabo, Kicukiro, Nyarugenge) and deliver it to your door, with a WhatsApp update at every step.',
  keywords: [
    'Ntuma',
    'Ntuma Nkuhahire',
    'ntumankuhahire.com',
    'delivery Rwanda',
    'Gasabo delivery',
    'Kicukiro delivery',
    'Nyarugenge delivery',
    'Kigali delivery',
    'vendor delivery',
    'grocery delivery Rwanda',
    'errand runner Kigali',
    'fresh produce delivery Kigali',
    'supermarket delivery Rwanda',
    'Isombe Kigali',
    'Rwanda market delivery',
    'online shopping Kigali',
    'ready to cook Rwanda',
  ],
  authors: [{ name: 'Ntuma Nkuhahire', url: 'https://ntumankuhahire.com' }],
  creator: 'Ntuma Nkuhahire',
  publisher: 'Ntuma Nkuhahire',
  applicationName: 'Ntuma Nkuhahire',
  referrer: 'origin-when-cross-origin',
  alternates: {
    canonical: './',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
    title: 'Ntuma Nkuhahire — Vendor to Door Delivery in Kigali',
    description:
      'Order from any vendor in Kigali — Gasabo, Kicukiro, and Nyarugenge. Set a budget, we shop it, you get an invoice and WhatsApp updates every step.',
    url: 'https://ntumankuhahire.com',
    siteName: 'Ntuma Nkuhahire',
    type: 'website',
    locale: 'en_RW',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 675,
        alt: 'Ntuma Nkuhahire Vendor to Door Delivery in Kigali, Rwanda',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ntuma Nkuhahire — Vendor to Door Delivery in Kigali',
    description:
      'Order from any vendor in Kigali. Set a budget, we shop it, with WhatsApp updates at every step.',
    images: ['/og-image.png'],
    creator: '@NtumaNkuhahire',
  },
  other: {
    'geo.region': 'RW-01',
    'geo.placename': 'Kigali',
    'geo.position': '-1.9441;30.0619',
    ICBM: '-1.9441, 30.0619',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}

