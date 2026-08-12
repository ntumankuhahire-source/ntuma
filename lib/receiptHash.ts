/**
 * Deterministic Client-Side Hash Verification for Ntuma Receipts
 * Uses Web Crypto API (SHA-256) to generate & verify receipt signatures.
 */

const SECRET_KEY =
  process.env.NEXT_PUBLIC_NTUMA_SECRET ||
  process.env.NEXT_PUBLIC_TECHLAB_SECRET ||
  'ntumankuhahire_secret_key_2026'

export async function generateReceiptHash(params: {
  receiptNumber: string
  amount: string
  clientName: string
  date: string
}): Promise<string> {
  const { receiptNumber, amount, clientName, date } = params

  // Format: "receiptNumber|amount|clientName|date|SECRET_KEY"
  const payload = `${receiptNumber.trim()}|${amount.trim()}|${clientName.trim()}|${date.trim()}|${SECRET_KEY}`

  // Use Web Crypto API or Node crypto
  let hashHex = ''
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder()
    const data = encoder.encode(payload)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()
  } else {
    // Fallback using Node.js crypto module if available
    try {
      // eslint-disable-next-line
      const cryptoNode = require('crypto')
      hashHex = cryptoNode.createHash('sha256').update(payload).digest('hex').toUpperCase()
    } catch {
      // Simple fallback string generator if crypto not present
      let hash = 0
      for (let i = 0; i < payload.length; i++) {
        const char = payload.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash |= 0
      }
      hashHex = Math.abs(hash).toString(16).toUpperCase().padStart(10, '0')
    }
  }

  // Truncate to 10 characters (e.g. 24B673D447)
  return hashHex.substring(0, 10)
}

export async function buildReceiptQrUrl(params: {
  receiptNumber: string
  amount: string
  clientName: string
  date: string
  baseUrl?: string
}): Promise<{ url: string; hash: string }> {
  const hash = await generateReceiptHash(params)
  const origin =
    params.baseUrl ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://ntumankuhahire.rw')

  const url = `${origin}/verify?id=${encodeURIComponent(params.receiptNumber)}&name=${encodeURIComponent(
    params.clientName
  )}&amount=${encodeURIComponent(params.amount)}&date=${encodeURIComponent(
    params.date
  )}&hash=${encodeURIComponent(hash)}`

  return { url, hash }
}

export async function verifyReceiptHash(params: {
  receiptNumber: string
  amount: string
  clientName: string
  date: string
  providedHash: string
}): Promise<boolean> {
  if (!params.providedHash) return false
  const computedHash = await generateReceiptHash({
    receiptNumber: params.receiptNumber,
    amount: params.amount,
    clientName: params.clientName,
    date: params.date,
  })
  return computedHash === params.providedHash.trim().toUpperCase()
}
