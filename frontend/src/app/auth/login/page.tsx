'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Loader2, Github, AlertCircle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { createClient, isSupabaseConfigured, isDemoMode } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      if (isDemoMode()) {
        toast.success('Welcome to Demo Mode!')
      } else {
        toast.success('Welcome back!')
      }
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      console.error('Login failed:', err)
      const message = err?.message || err?.error_description || 'Login failed. Please check your credentials.'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    if (isDemoMode()) {
      toast.error('OAuth is not available in demo mode. Use email/password instead.')
      return
    }

    if (provider === 'google') setIsGoogleLoading(true)
    if (provider === 'github') setIsGithubLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError
    } catch (err: any) {
      console.error(`${provider} login failed:`, err)
      const message = err?.message || `${provider} login failed`
      setError(message)
      toast.error(message)
      setIsGoogleLoading(false)
      setIsGithubLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: 'demo@webmotion.ai',
        password: 'demo123',
      })

      if (authError) throw authError

      toast.success('Welcome to Demo Mode! Explore all features.')
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      console.error('Demo login failed:', err)
      setError('Demo login failed. Please try again.')
      toast.error('Demo login failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold">WM</span>
            </div>
            <span className="font-bold text-2xl">WebMotion.ai</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to continue creating amazing animations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Login Error</p>
                  <p className="text-muted-foreground mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Demo Mode Banner */}
            {isDemoMode() && (
              <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm">
                <Zap className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-600">Demo Mode Active</p>
                  <p className="text-muted-foreground mt-1">
                    No Supabase configured. Use any email/password or try the demo.
                  </p>
                </div>
              </div>
            )}

            {/* Demo Quick Login */}
            <Button
              variant="outline"
              className="w-full border-dashed border-2 hover:border-primary/50 hover:bg-primary/5"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              <Zap className="h-4 w-4 mr-2" />
              Try Demo Account
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleOAuthLogin('google')}
                disabled={isGoogleLoading || isGithubLoading || isDemoMode()}
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuthLogin('github')}
                disabled={isGoogleLoading || isGithubLoading || isDemoMode()}
              >
                {isGithubLoading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Github className="h-5 w-5 mr-2" />
                )}
                GitHub
              </Button>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                {!isDemoMode() && (
                  <Link href="/auth/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign In
              </Button>
            </form>

            {/* Magic Link */}
            {!isDemoMode() && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    if (!email) {
                      toast.error('Enter your email first')
                      return
                    }
                    setIsLoading(true)
                    try {
                      const supabase = createClient()
                      const { error } = await supabase.auth.signInWithOtp({ email })
                      if (error) throw error
                      toast.success('Check your email for the login link!')
                    } catch (err: any) {
                      toast.error(err?.message || 'Failed to send magic link')
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                  disabled={isLoading}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Magic Link
                </Button>
              </>
            )}

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
