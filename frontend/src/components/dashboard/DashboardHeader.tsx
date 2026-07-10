'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, CreditCard, Folder, Settings, LogOut, 
  Menu, X, Globe, Users, BarChart3, Search, Zap,
  MessageSquare, Code, Layers, Bell, Activity, Shield, Palette,
  Wand2, Store, LayoutDashboard, PenTool, ChevronDown, Layout, BookOpen, User
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  subscription_tier: string
  ai_credits: number
}

export function DashboardHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setUser(profile)
        }
      }
    }
    fetchUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">WM</span>
            </div>
            <span className="font-bold text-xl">WebMotion.ai</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: '/dashboard', icon: Folder, label: 'Projects' },
              { href: '/templates', icon: Sparkles, label: 'Templates' },
              { href: '/playground', icon: Code, label: 'Playground' },
              { href: '/editor/visual', icon: Layout, label: 'Editor' },
              { href: '/designer', icon: Wand2, label: 'AI Designer' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* Credits Badge */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">{user.ai_credits}</span>
                <span className="text-muted-foreground">credits</span>
              </div>
            )}

            {/* Notifications */}
            <Link href="/notifications" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <Avatar
                  src={user?.avatar_url || undefined}
                  alt={user?.full_name || user?.email || 'User'}
                  fallback={user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                />
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden"
                    >
                      {/* User Info */}
                      <div className="p-4 border-b border-border">
                        <p className="font-medium">{user?.full_name || 'User'}</p>
                        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                            {user?.subscription_tier || 'free'}
                          </span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                        >
                          <Folder className="h-4 w-4" />
                          My Projects
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                        <Link
                          href="/billing"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                        >
                          <CreditCard className="h-4 w-4" />
                          Billing
                        </Link>
                        <Link
                          href="/team"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                        >
                          <Users className="h-4 w-4" />
                          Team
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="p-2 border-t border-border">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-sm w-full"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border glass overflow-hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
              {[
                { href: '/dashboard', icon: Folder, label: 'Projects' },
                { href: '/templates', icon: Sparkles, label: 'Templates' },
                { href: '/playground', icon: Code, label: 'Playground' },
                { href: '/editor/visual', icon: Layout, label: 'Visual Editor' },
                { href: '/animations', icon: Layers, label: 'Animations' },
                { href: '/designer', icon: Wand2, label: 'AI Designer' },
                { href: '/prompts', icon: BookOpen, label: 'Prompts' },
                { href: '/content', icon: PenTool, label: 'Content' },
                { href: '/analytics', icon: BarChart3, label: 'Analytics' },
                { href: '/settings', icon: Settings, label: 'Settings' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              <div className="pt-4 border-t border-border mt-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
