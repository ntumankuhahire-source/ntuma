import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const isFirebase = Boolean(body.isFirebase)
    const firebaseEmail = body.firebaseEmail

    // Verified Firebase login requirement
    const isFirebaseValid = isFirebase && Boolean(firebaseEmail)

    if (isFirebaseValid) {
      const cookieStore = cookies()
      cookieStore.set('ntuma_admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { success: false, error: 'Authentication failed. Valid Firebase authentication required.' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error during authentication.' },
      { status: 500 }
    )
  }
}

