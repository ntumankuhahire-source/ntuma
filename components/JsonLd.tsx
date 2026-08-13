import React from 'react'

export function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ntumankuhahire.com'

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'DeliveryService', 'Organization'],
    '@id': `${baseUrl}/#organization`,
    name: 'Ntuma Nkuhahire',
    legalName: 'Ntuma Nkuhahire Services',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/og-image.png`,
    description:
      'Tell us what you need and a budget — Ntuma runners buy it from your chosen vendor in Kigali (Gasabo, Kicukiro, Nyarugenge) and deliver it to your door, with WhatsApp updates at every step.',
    telephone: '+250787800703',
    email: 'info@ntumankuhahire.com',
    priceRange: 'RWF',
    currenciesAccepted: 'RWF',
    paymentAccepted: 'Cash, Mobile Money (MoMo)',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kigali',
      addressRegion: 'Kigali City',
      addressCountry: 'RW',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.9441,
      longitude: 30.0619,
    },
    areaServed: [
      { '@type': 'City', name: 'Kigali' },
      { '@type': 'AdministrativeArea', name: 'Gasabo' },
      { '@type': 'AdministrativeArea', name: 'Kicukiro' },
      { '@type': 'AdministrativeArea', name: 'Nyarugenge' },
      { '@type': 'Country', name: 'Rwanda' },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '07:00',
      closes: '21:00',
    },
    sameAs: ['https://wa.me/250787800703'],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Ntuma Nkuhahire',
    description:
      'Vendor to Door Grocery & Errand Delivery Service in Kigali, Rwanda',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    inLanguage: 'en-RW',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  )
}
