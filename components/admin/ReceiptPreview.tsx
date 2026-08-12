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
          width: 140,
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
      className="bg-white text-slate-900 shadow-2xl rounded-xl border border-slate-200 p-8 md:p-10 max-w-[720px] mx-auto select-none transition-all font-body relative overflow-hidden"
      style={{ minHeight: '920px' }}
    >
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />

      {/* TOP HEADER */}
      <div className="flex justify-between items-start pb-6 border-b border-slate-200/80">
        <div className="flex items-center gap-3.5">
          <div className="bg-emerald-950 p-2.5 rounded-xl shadow-md flex items-center justify-center border border-emerald-800">
            <Image
              src="/logo.png"
              alt="Ntumankuhahire Logo"
              width={140}
              height={45}
              className="h-10 w-auto object-contain brightness-110"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-emerald-950">
              NTUMANKUHAHIRE
            </h1>
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Courier & Delivery Services
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono font-extrabold tracking-[0.18em] uppercase text-amber-500 block mb-1">
            OFFICIAL RECEIPT
          </span>
          <h2 className="text-xl font-mono font-black text-slate-900 tracking-tight">
            {data.receiptNo}
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            {data.date}
          </p>
        </div>
      </div>

      {/* BILLED TO SECTION */}
      <div className="pt-7 pb-6">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 block mb-1.5">
          BILLED TO
        </span>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4 min-h-[32px]">
          {data.customerName || ''}
        </h3>

        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              CONTACT
            </span>
            <p className="font-semibold text-slate-800 truncate min-h-[18px]">
              {data.customerContact || ''}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              EMAIL
            </span>
            <p className="font-semibold text-slate-800 truncate min-h-[18px]">
              {data.customerEmail || ''}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              LOCATION
            </span>
            <p className="font-semibold text-slate-800 truncate min-h-[18px]">
              {data.customerLocation || ''}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN HERO AMOUNT CARD */}
      <div className="my-4 bg-[#091512] text-white rounded-xl p-7 border border-emerald-900 shadow-xl relative overflow-hidden">
        {/* Subtle accent border on left */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />

        <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400/90 mb-4 pl-1 min-h-[16px]">
          {data.serviceTitle || ''}
        </p>

        <div className="flex items-baseline gap-3 pl-1 min-h-[48px]">
          <span className="text-5xl md:text-6xl font-mono font-black text-amber-400 tracking-tight">
            {data.amount ? (isNaN(Number(data.amount.replace(/,/g, ''))) ? data.amount : Number(data.amount.replace(/,/g, '')).toLocaleString('en-US')) : ''}
          </span>
          {data.amount && (
            <span className="text-base font-bold text-emerald-200/80 font-mono tracking-wider">
              {data.currency || 'RWF'}
            </span>
          )}
        </div>
      </div>

      <div className="my-6 border-t border-slate-200/80" />

      {/* AUTHORIZED SIGNATURE & OFFICIAL SEAL */}
      <div className="grid grid-cols-2 gap-6 items-end pt-2 pb-6">
        {/* Signature details */}
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
            AUTHORIZED SIGNATURE
          </span>

          {/* Cursive Signature Render */}
          <div className="h-14 flex items-center mb-1">
            <span
              className="text-3xl text-emerald-950 font-semibold tracking-wide"
              style={{ fontFamily: "'Dancing Script', 'Great Vibes', cursive" }}
            >
              {data.signatoryName || 'NTUMANKUHAHIRE'}
            </span>
          </div>

          <p className="text-xs font-black text-slate-900">
            {data.signatoryName || 'NTUMANKUHAHIRE'}
          </p>
          <p className="text-[11px] font-semibold text-slate-500 tracking-tight uppercase">
            {data.signatoryTitle || 'DIRECTOR'}
          </p>
        </div>

        {/* Circular Seal / Official Stamp */}
        <div className="flex justify-end items-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <Image
              src="/stamp.png"
              alt="Official Stamp"
              width={120}
              height={120}
              className="w-28 h-28 object-contain drop-shadow-sm"
              priority
            />
          </div>
        </div>
      </div>

      {/* CONTACT INFO FOOTER ROW */}
      <div className="flex items-center justify-start gap-6 text-[11px] text-slate-600 border-t border-b border-slate-100 py-3 mb-6">
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-semibold">{data.contactPhone || '0787800703'}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <Mail className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-semibold truncate">{data.contactEmail || 'info.ntumankuhahire.com'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-semibold">{data.contactLocation || 'Kigali City'}</span>
        </div>
      </div>

      {/* FOOTER BAR WITH QR CODE VERIFIER */}
      <div className="flex justify-between items-end mt-auto pt-2">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-0.5">
            POWERED BY NTUMANKUHAHIRE
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Authentic Digital Receipt
          </span>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center">
          {qrCodeUrl ? (
            <div className="p-1 bg-white border border-slate-200 rounded-lg shadow-xs">
              <Image
                src={qrCodeUrl}
                alt="Receipt Verification QR Code"
                width={70}
                height={70}
                className="w-16 h-16 object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-[9px] text-slate-400">
              QR Code
            </div>
          )}
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 mt-1">
            VERIFY
          </span>
        </div>
      </div>
    </div>
  )
}
