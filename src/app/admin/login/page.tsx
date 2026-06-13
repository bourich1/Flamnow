'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Mail, ShieldAlert, Loader2, ArrowRight } from 'lucide-react'
import { signInAdmin } from '@/app/actions/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await signInAdmin(email, password)
      if (response.error) {
        setError(response.error)
        setIsLoading(false)
      } else {
        // Refresh the router to update the server components with the new session
        router.refresh()
        // Push to the dashboard
        router.push('/admin')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#0b0b0b] min-h-screen flex items-center justify-center px-4 relative overflow-hidden font-sans select-none">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-[350px] w-[350px] rounded-full bg-[#ED3F27]/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-[350px] w-[350px] rounded-full bg-[#00E5FF]/5 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#ED3F27] to-[#FF9F0A] flex items-center justify-center shadow-lg shadow-[#ED3F27]/20 mb-4 border border-white/10">
            <Lock className="text-white h-5 w-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#ED3F27] mb-1 font-mono">
            SECURITY GATEWAY
          </span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white font-display">
            ADMIN ACCESS
          </h2>
          <p className="text-white/60 text-xs mt-1">
            Access to this environment is restricted to authorized crew members.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl pointer-events-none" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3.5 flex items-start gap-3">
                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                Admin Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="admin@flamnow.com"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 outline-none focus:border-[#ED3F27]/50 focus:bg-white/[0.04] transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block font-mono">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 outline-none focus:border-[#ED3F27]/50 focus:bg-white/[0.04] transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ED3F27] hover:bg-[#d6321c] disabled:bg-[#ED3F27]/50 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 relative group overflow-hidden shadow-lg shadow-[#ED3F27]/10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authorizing Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Dashboard</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-[#ED3F27] transition-colors duration-200 font-mono"
          >
            ← Back to Public Website
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
