'use client'

import React, { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { verifyReceiptHash } from '@/lib/receiptHash'
import {
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lock,
  Calendar,
  User,
  DollarSign,
  FileText,
  Printer,
} from 'lucide-react'

function VerificationContent() {
  const searchParams = useSearchParams()

  const id = searchParams.get('id') || ''
  const name = searchParams.get('name') || ''
  const amount = searchParams.get('amount') || ''
  const date = searchParams.get('date') || ''
  const hash = searchParams.get('hash') || ''

  const [loading, setLoading] = useState(true)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkVerification() {
      setLoading(true)
      if (!id || !hash) {
        setIsValid(null)
        setLoading(false)
        return
      }

      const result = await verifyReceiptHash({
        receiptNumber: id,
        amount: amount,
        clientName: name,
        date: date,
        providedHash: hash,
      })

      setIsValid(result)
      setLoading(false)
    }

    checkVerification()
  }, [id, name, amount, date, hash])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600 font-mono">
          Verifying Cryptographic Digital Signature...
        </p>
      </div>
    )
  }

  // 1. Missing parameters case
  if (!id && !hash) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-xl text-center max-w-xl mx-auto">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Receipt Verification Portal
        </h2>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Please scan a QR code from an official <strong>NTUMANKUHAHIRE</strong> receipt to verify its authenticity.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-950 hover:bg-emerald-900 text-white font-medium text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-brand-yellow" /> Back to Homepage
        </Link>
      </div>
    )
  }

  // 2. Genuine & Valid Receipt Case
  if (isValid === true) {
    return (
      <div className="bg-white rounded-2xl border border-emerald-200 p-8 md:p-12 shadow-2xl max-w-2xl mx-auto relative overflow-hidden">
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-600" />

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500 shadow-md animate-bounce-short">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full uppercase mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Cryptographically Verified
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            VERIFIED AUTHENTIC RECEIPT
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-md mx-auto">
            This receipt signature has been validated against our deterministic SHA-256 HMAC cryptographic standard and has not been altered.
          </p>
        </div>

        {/* Receipt Verification Details Card */}
        <div className="bg-emerald-950 text-white rounded-xl p-6 shadow-inner border border-emerald-800 space-y-4 mb-8">
          <div className="flex justify-between items-center pb-3 border-b border-emerald-800/80">
            <span className="text-xs font-mono font-semibold text-emerald-300/80 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" /> RECEIPT NUMBER
            </span>
            <span className="text-lg font-mono font-black text-amber-400 tracking-wider">
              {id}
            </span>
          </div>

          {name && (
            <div className="flex justify-between items-center pb-3 border-b border-emerald-800/80">
              <span className="text-xs font-mono font-semibold text-emerald-300/80 flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-400" /> BILLED TO
              </span>
              <span className="text-sm font-bold text-white">
                {name}
              </span>
            </div>
          )}

          {amount && (
            <div className="flex justify-between items-center pb-3 border-b border-emerald-800/80">
              <span className="text-xs font-mono font-semibold text-emerald-300/80 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-400" /> AMOUNT PAID
              </span>
              <span className="text-xl font-mono font-black text-amber-400">
                {isNaN(Number(amount.replace(/,/g, ''))) ? amount : Number(amount.replace(/,/g, '')).toLocaleString('en-US')} RWF
              </span>
            </div>
          )}

          {date && (
            <div className="flex justify-between items-center pb-3 border-b border-emerald-800/80">
              <span className="text-xs font-mono font-semibold text-emerald-300/80 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" /> ISSUE DATE
              </span>
              <span className="text-xs font-medium text-slate-200">
                {date}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center pt-1">
            <span className="text-[11px] font-mono font-semibold text-emerald-300/80 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> DIGITAL SIGNATURE
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest bg-emerald-900/80 px-2.5 py-1 rounded border border-emerald-700">
              {hash}
            </span>
          </div>
        </div>

        {/* Verification Guarantee */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1 mb-8">
          <div className="flex items-center gap-2 font-bold text-emerald-950">
            <ShieldCheck className="w-4 h-4 text-emerald-700" /> Authorized Issuer: NTUMANKUHAHIRE
          </div>
          <p className="text-slate-500 pl-6">
            Telephone: <strong>0787800703</strong> | Email: <strong>info.ntumankuhahire.com</strong> | Location: <strong>Kigali City</strong>
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-600" /> Print Verification Proof
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-950 hover:bg-emerald-900 rounded-xl transition-all shadow-md"
          >
            Go to Ntuma Homepage
          </Link>
        </div>
      </div>
    )
  }

  // 3. Tampered / Invalid Signature Case
  return (
    <div className="bg-white rounded-2xl border border-red-300 p-8 md:p-12 shadow-2xl max-w-2xl mx-auto relative overflow-hidden">
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-red-600" />

      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500 shadow-md">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-red-700 bg-red-50 border border-red-300 px-3 py-1 rounded-full uppercase mb-2">
          <XCircle className="w-3.5 h-3.5 text-red-600" /> Cryptographic Signature Mismatch
        </span>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          INVALID OR TAMPERED RECEIPT
        </h2>
        <p className="text-red-600 text-sm font-semibold mt-2 max-w-md mx-auto">
          Warning: The parameters in this verification link do not match the digital signature key.
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8 text-xs text-red-900 space-y-2">
        <h3 className="font-bold text-sm text-red-950 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-red-600" /> Security Notice
        </h3>
        <p className="leading-relaxed">
          Modifying any detail on a receipt (such as changing the amount, client name, or receipt number) breaks the digital signature because the cryptographic hash key cannot be reproduced without the private secret key.
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-6 py-3 rounded-xl transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" /> Return to Ntuma Homepage
        </Link>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-slate-100 font-body py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Bar */}
      <div className="max-w-2xl mx-auto mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-emerald-950 p-2 rounded-xl shadow-sm border border-emerald-900">
            <Image
              src="/logo.png"
              alt="Ntuma Logo"
              width={120}
              height={38}
              className="h-8 w-auto object-contain brightness-110"
              priority
            />
          </div>
          <span className="font-display font-extrabold text-slate-900 tracking-tight text-lg">
            NTUMANKUHAHIRE
          </span>
        </Link>

        <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full uppercase">
          Verification Portal
        </span>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-600 font-mono">
              Loading Verification Portal...
            </p>
          </div>
        }
      >
        <VerificationContent />
      </Suspense>
    </div>
  )
}
