'use client'

import { useState, FormEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react'
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@/lib/firebase'

/** Inner component — uses useSearchParams, must be inside <Suspense> */
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromPath = searchParams.get('from') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // Handle Session Cookie set on server
  async function establishSession(firebaseEmail: string) {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: firebaseEmail,
        isFirebase: true,
        firebaseEmail: firebaseEmail,
      }),
    })
    const data = await res.json()
    if (data.success) {
      router.push(fromPath)
      router.refresh()
      return true
    } else {
      setError(data.error || 'Failed to authenticate session.')
      return false
    }
  }

  // Google / Gmail Sign-In Handler
  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    setError(null)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      if (user.email) {
        await establishSession(user.email)
      } else {
        setError('Google sign-in did not provide an email address.')
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err)
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was closed before completing.')
      } else {
        setError(err.message || 'Google sign-in failed. Please try again.')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  // Email / Password Form Submit Handler
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (!password.trim()) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      if (userCredential.user && userCredential.user.email) {
        await establishSession(userCredential.user.email)
      }
    } catch (firebaseErr: any) {
      console.error('Firebase Email Auth Error:', firebaseErr)
      const code = firebaseErr.code
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        setError('Invalid email or password. Please verify your credentials.')
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else {
        setError(firebaseErr.message || 'Authentication failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white py-8 px-6 shadow-2xl rounded-card sm:px-10 border border-emerald-900/40">
      {/* Google Sign-In Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-slate-300 hover:border-slate-400 rounded-card shadow-sm text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200 disabled:opacity-60"
      >
        {googleLoading ? (
          <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>Sign in with Google</span>
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
            Or continue with email
          </span>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-card px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5"
          >
            Email Address
          </label>
          <div className="relative rounded-card">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-card text-sm text-emerald-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition-colors font-body"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5"
          >
            Password
          </label>
          <div className="relative rounded-card">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-card text-sm text-emerald-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition-colors font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || googleLoading || !password.trim() || !email.trim()}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-card shadow-sm text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <span>Authenticating…</span>
            ) : (
              <>
                <span>Sign In with Email</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>Firebase Auth Protected</span>
      </div>
    </div>
  )
}

/** Page shell — wraps the form in Suspense so useSearchParams() is valid at build time */
export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-emerald-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-body relative overflow-hidden">
      {/* Background subtle decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_50%)] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        {/* Back to Homepage Arrow Link */}
        <div className="flex justify-start mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-emerald-200/80 hover:text-white transition-colors group font-medium"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-white/95 px-5 py-3 rounded-2xl shadow-2xl border border-emerald-800/40 inline-flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Ntuma Logo"
              width={220}
              height={70}
              className="h-16 md:h-20 w-auto object-contain"
              priority
            />
          </div>
        </div>
        <h2 className="text-center font-display text-2xl font-bold text-white tracking-tight">
          Welcome to Ntuma
        </h2>
        <p className="mt-2 text-center text-xs text-emerald-200/70">
          Sign in via Google or Email to access your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <Suspense fallback={
          <div className="bg-white py-8 px-6 shadow-2xl rounded-card sm:px-10 border border-emerald-900/40 flex items-center justify-center min-h-[200px]">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

