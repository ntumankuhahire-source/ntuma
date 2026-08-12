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
  currency: string
  signatoryName: string
  signatoryTitle: string
  contactPhone: string
  contactEmail: string
  contactLocation: string
  qrPayload: string
}

export function ReceiptPreview({ data }: { data: ReceiptData }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  useEffect(() => {
    async function generateQR() {
      try {
        const payload = data.qrPayload || `https://ntumankuhahire.rw/verify/${data.receiptNo}`
        const url = await QRCode.toDataURL(payload, {
          margin: 1,
          width: 120,
          color: {
            dark: '#0A0A0A',
            light: '#FFFFFF',
          },
        })
        setQrCodeUrl(url)
      } catch (err) {
        console.error('Error generating QR code:', err)
      }
    }
    generateQR()
  }, [data.qrPayload, data.receiptNo])

  return (
    <div
      id="printable-receipt-card"
      className="bg-white text-slate-900 shadow-xl rounded-xl border border-slate-200 p-5 md:p-6 max-w-[620px] mx-auto select-none transition-all font-body relative overflow-hidden flex flex-col justify-between"
      style={{ minHeight: '620px' }}
    >
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />

      <div>
        {/* TOP HEADER */}
        <div className="flex justify-between items-start pb-3.5 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-950 p-2 rounded-lg shadow-sm flex items-center justify-center border border-emerald-800">
              <Image
                src="/logo.png"
                alt="Ntumankuhahire Logo"
                width={120}
                height={36}
                className="h-7 w-auto object-contain brightness-110"
                priority
              />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-emerald-950 leading-tight mb-0.5">
                NTUMANKUHAHIRE
              </h1>
              <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                Courier & Delivery Services
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono font-extrabold tracking-[0.15em] uppercase text-amber-500 block mb-0.5">
              OFFICIAL RECEIPT
            </span>
            <h2 className="text-base font-mono font-black text-slate-900 tracking-tight leading-tight">
              {data.receiptNo}
            </h2>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              {data.date}
            </p>
          </div>
        </div>

        {/* BILLED TO SECTION */}
        <div className="pt-3.5 pb-3">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-600 block mb-1">
            BILLED TO
          </span>
          <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2 min-h-[26px] leading-snug">
            {data.customerName || ''}
          </h3>

          <div className="grid grid-cols-3 gap-3 text-[11px] leading-relaxed">
            <div className="py-0.5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-0.5 leading-none">
                CONTACT
              </span>
              <p className="font-semibold text-slate-800 break-words leading-snug">
                {data.customerContact || ''}
              </p>
            </div>
            <div className="py-0.5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-0.5 leading-none">
                EMAIL
              </span>
              <p className="font-semibold text-slate-800 break-words leading-snug">
                {data.customerEmail || ''}
              </p>
            </div>
            <div className="py-0.5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-0.5 leading-none">
                LOCATION
              </span>
              <p className="font-semibold text-slate-800 break-words leading-snug">
                {data.customerLocation || ''}
              </p>
            </div>
          </div>
        </div>

        {/* MAIN HERO AMOUNT CARD */}
        <div className="my-2.5 bg-[#091512] text-white rounded-lg p-4 md:p-5 border border-emerald-900 shadow-md relative overflow-hidden">
          {/* Subtle accent border on left */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />

          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400/90 mb-2 pl-1 min-h-[14px] leading-normal">
            {data.serviceTitle || ''}
          </p>

          <div className="flex items-baseline gap-2 pl-1 min-h-[36px]">
            <span className="text-3xl md:text-4xl font-mono font-black text-amber-400 tracking-tight leading-none">
              {data.amount ? (isNaN(Number(data.amount.replace(/,/g, ''))) ? data.amount : Number(data.amount.replace(/,/g, '')).toLocaleString('en-US')) : ''}
            </span>
            {data.amount && (
              <span className="text-xs font-bold text-emerald-200/80 font-mono tracking-wider">
                {data.currency || 'RWF'}
              </span>
            )}
          </div>
        </div>

        <div className="my-3 border-t border-slate-200/80" />

        {/* AUTHORIZED SIGNATURE & OFFICIAL SEAL */}
        <div className="grid grid-cols-2 gap-4 items-end pt-1 pb-3">
          {/* Signature details */}
          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
              AUTHORIZED SIGNATURE
            </span>

            {/* Cursive Signature Render */}
            <div className="h-10 flex items-center mb-0.5">
              <span
                className="text-2xl text-emerald-950 font-semibold tracking-wide leading-normal"
                style={{ fontFamily: "'Dancing Script', 'Great Vibes', cursive" }}
              >
                {data.signatoryName || 'NTUMANKUHAHIRE'}
              </span>
            </div>

            <p className="text-[11px] font-black text-slate-900 leading-snug">
              {data.signatoryName || 'NTUMANKUHAHIRE'}
            </p>
            <p className="text-[10px] font-semibold text-slate-500 tracking-tight uppercase leading-snug">
              {data.signatoryTitle || 'DIRECTOR'}
            </p>
          </div>

          {/* Circular Seal / Official Stamp */}
          <div className="flex justify-end items-center">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <Image
                src="/stamp.png"
                alt="Official Stamp"
                width={90}
                height={90}
                className="w-20 h-20 object-contain drop-shadow-sm"
                priority
              />
            </div>
          </div>
        </div>

        {/* CONTACT INFO FOOTER ROW (Full unclipped line heights) */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-700 border-t border-b border-slate-100 py-2.5 mb-3 leading-normal">
          <div className="flex items-center gap-1.5 shrink-0">
            <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-semibold">{data.contactPhone || '0787800703'}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-semibold text-slate-800">{data.contactEmail || 'info.ntumankuhahire.com'}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-semibold">{data.contactLocation || 'Kigali City'}</span>
          </div>
        </div>
      </div>

      {/* FOOTER BAR WITH QR CODE VERIFIER */}
      <div className="flex justify-between items-end pt-1 border-t border-slate-100/80">
        <div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-0.5">
            POWERED BY NTUMANKUHAHIRE
          </span>
          <span className="inline-flex items-center gap-1 text-[9px] font-medium text-emerald-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Authentic Digital Receipt
          </span>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center">
          {qrCodeUrl ? (
            <div className="p-0.5 bg-white border border-slate-200 rounded-md shadow-xs">
              <Image
                src={qrCodeUrl}
                alt="Receipt Verification QR Code"
                width={54}
                height={54}
                className="w-13 h-13 object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-13 h-13 bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center text-[8px] text-slate-400">
              QR Code
            </div>
          )}
          <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400 mt-0.5">
            VERIFY
          </span>
        </div>
      </div>
    </div>
  )
}
