'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react'

export interface ReceiptData {
  receiptNo: string
  date: string
  customerName: string
  customerContact: string
  customerEmail: string
  customerLocation: string
  serviceTitle: string
  amount: string
  transportFee: string
  otherFee: string
  currency: string
  signatoryName: string
  signatoryTitle: string
  contactPhone: string
  contactEmail: string
  contactLocation: string
  qrPayload: string
}

function parseNum(val: string): number {
  const n = Number(val.replace(/,/g, '').trim())
  return isNaN(n) ? 0 : n
}

function fmtNum(n: number): string {
  return n.toLocaleString('en-US')
}

export function ReceiptPreview({ data }: { data: ReceiptData }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  const subtotal = parseNum(data.amount)
  const transport = parseNum(data.transportFee)
  const other = parseNum(data.otherFee)
  const total = subtotal + transport + other

  useEffect(() => {
    async function generateQR() {
      try {
        const payload = data.qrPayload || `https://ntumankuhahire.rw/verify/${data.receiptNo}`
        const url = await QRCode.toDataURL(payload, {
          margin: 1,
          width: 120,
          color: { dark: '#0A0A0A', light: '#FFFFFF' },
        })
        setQrCodeUrl(url)
      } catch (err) {
        console.error('Error generating QR code:', err)
      }
    }
    generateQR()
  }, [data.qrPayload, data.receiptNo])

  const currency = data.currency || 'RWF'

  return (
    <div
      id="printable-receipt-card"
      style={{
        background: '#fff',
        color: '#0f172a',
        fontFamily: 'Inter, system-ui, sans-serif',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '28px 28px 24px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Background accent */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: 'rgba(16,185,129,0.04)', borderBottomLeftRadius: '100%', pointerEvents: 'none' }} />

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#022c22', padding: '7px 10px', borderRadius: 8, border: '1px solid #065f46', display: 'flex', alignItems: 'center' }}>
            <Image src="/logo.png" alt="Ntumankuhahire Logo" width={100} height={30} style={{ height: 28, width: 'auto', objectFit: 'contain', filter: 'brightness(1.1)' }} priority />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.3px', color: '#022c22', lineHeight: 1.2 }}>NTUMANKUHAHIRE</div>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>Courier &amp; Delivery Services</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', color: '#f59e0b', textTransform: 'uppercase', marginBottom: 2 }}>OFFICIAL RECEIPT</div>
          <div style={{ fontSize: 14, fontFamily: 'monospace', fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>{data.receiptNo}</div>
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{data.date}</div>
        </div>
      </div>

      {/* ── BILLED TO ── */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#d97706', marginBottom: 4 }}>BILLED TO</div>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginBottom: 8, minHeight: 22, lineHeight: 1.3 }}>{data.customerName}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: 10 }}>
          {[['CONTACT', data.customerContact], ['EMAIL', data.customerEmail], ['LOCATION', data.customerLocation]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 8, fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: 2 }}>{label}</div>
              <div style={{ fontWeight: 600, color: '#1e293b', wordBreak: 'break-word', lineHeight: 1.4 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AMOUNT CARD ── */}
      <div style={{ background: '#091512', borderRadius: 10, padding: '14px 16px', marginBottom: 12, border: '1px solid #065f46', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 5, height: '100%', background: '#fbbf24' }} />
        <div style={{ paddingLeft: 8 }}>
          <div style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(52,211,153,0.85)', marginBottom: 8, lineHeight: 1 }}>{data.serviceTitle}</div>

          {/* Line items */}
          <div style={{ marginBottom: 8, fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>
            {subtotal > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span>Products subtotal</span>
                <span style={{ fontFamily: 'monospace' }}>{fmtNum(subtotal)} {currency}</span>
              </div>
            )}
            {transport > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span>Transport fee</span>
                <span style={{ fontFamily: 'monospace' }}>{fmtNum(transport)} {currency}</span>
              </div>
            )}
            {other > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span>Other fees</span>
                <span style={{ fontFamily: 'monospace' }}>{fmtNum(other)} {currency}</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 30, fontFamily: 'monospace', fontWeight: 900, color: '#fbbf24', letterSpacing: '-1px', lineHeight: 1 }}>
              {total > 0 ? fmtNum(total) : (subtotal > 0 ? fmtNum(subtotal) : '')}
            </span>
            {(total > 0 || subtotal > 0) && (
              <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: 'rgba(209,250,229,0.8)' }}>{currency}</span>
            )}
          </div>
          {(transport > 0 || other > 0) && subtotal > 0 && (
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', marginTop: 2, fontFamily: 'monospace' }}>TOTAL INCL. FEES</div>
          )}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e2e8f0', margin: '12px 0' }} />

      {/* ── SIGNATURE + SEAL ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'flex-end', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 8, fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8', marginBottom: 4 }}>AUTHORIZED SIGNATURE</div>
          <div style={{ height: 36, display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ fontSize: 22, fontFamily: "'Dancing Script', 'Great Vibes', cursive", fontWeight: 600, color: '#022c22', letterSpacing: '0.02em' }}>
              {data.signatoryName || 'NTUMANKUHAHIRE'}
            </span>
          </div>
          <div style={{ fontSize: 10, fontWeight: 900, color: '#0f172a', lineHeight: 1.3 }}>{data.signatoryName || 'NTUMANKUHAHIRE'}</div>
          <div style={{ fontSize: 9, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{data.signatoryTitle || 'DIRECTOR'}</div>
        </div>
        <div style={{ width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Image src="/stamp.png" alt="Official Stamp" width={72} height={72} style={{ width: 72, height: 72, objectFit: 'contain' }} priority />
        </div>
      </div>

      {/* ── CONTACT ROW ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 10, color: '#475569', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '8px 0', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Phone size={11} style={{ color: '#f59e0b', flexShrink: 0 }} />
          <span style={{ fontWeight: 600 }}>{data.contactPhone || '0787800703'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Mail size={11} style={{ color: '#f59e0b', flexShrink: 0 }} />
          <span style={{ fontWeight: 600 }}>{data.contactEmail || 'info.ntumankuhahire.com'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <MapPin size={11} style={{ color: '#f59e0b', flexShrink: 0 }} />
          <span style={{ fontWeight: 600 }}>{data.contactLocation || 'Kigali City'}</span>
        </div>
      </div>

      {/* ── FOOTER: POWERED BY + QR ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 8, fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8', marginBottom: 3 }}>POWERED BY NTUMANKUHAHIRE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#059669', fontWeight: 600 }}>
            <CheckCircle2 size={11} style={{ color: '#059669' }} />
            Verified Authentic Digital Receipt
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {qrCodeUrl ? (
            <div style={{ padding: 2, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff' }}>
              <Image src={qrCodeUrl} alt="Receipt Verification QR Code" width={52} height={52} style={{ width: 52, height: 52, display: 'block' }} unoptimized />
            </div>
          ) : (
            <div style={{ width: 52, height: 52, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#94a3b8' }}>QR Code</div>
          )}
          <div style={{ fontSize: 7, fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8', marginTop: 3 }}>VERIFY</div>
        </div>
      </div>
    </div>
  )
}
