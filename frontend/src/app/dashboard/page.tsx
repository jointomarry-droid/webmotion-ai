'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, Folder, Sparkles, Zap, TrendingUp, BarChart3, Globe, Users,
  Bell, Activity, Shield, Palette, Code, Layers, Rocket, Star
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { Project } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<{
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    subscription_tier: string
    ai_credits: number
  } | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    creditsUsed: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          // In demo mode, use demo data
          setUser({
            id: 'demo-user',
            email: 'demo@webmotion.ai',
            full_name: 'Demo User',
            avatar_url: null,
            subscription_tier: 'pro',
            ai_credits: 9500,
          })
          setStats({
            totalProjects: 12,
            activeProjects: 8,
            creditsUsed: 500,
          })
          setIsLoading(false)
          return
        }

        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          setUser(profile)
          setStats(prev => ({ ...prev, creditsUsed: 10000 - profile.ai_credits }))
        } else {
          // Demo fallback
          setUser({
            id: session.user.id,
            email: session.user.email || 'user@webmotion.ai',
            full_name: session.user.user_metadata?.full_name || 'User',
            avatar_url: null,
            subscription_tier: 'free',
            ai_credits: 10000,
          })
        }

        // Fetch projects
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', session.user.id)
          .order('updated_at', { ascending: false })
          .limit(6)

        if (projectsData) {
          setProjects(projectsData)
          setStats(prev => ({
            ...prev,
            totalProjects: projectsData.length,
            activeProjects: projectsData.filter((p: any) => p.deployment_status === 'deployed').length,
          }))
        }
      } catch (error) {
        // Fallback to demo data
        setUser({
          id: 'demo-user',
          email: 'demo@webmotion.ai',
          full_name: 'Demo User',
          avatar_url: null,
          subscription_tier: 'pro',
          ai_credits: 9500,
        })
      }

      setIsLoading(false)
    }

    fetchData()
  }, [router, supabase])

  const quickActions = [
    { href: '/generator', icon: Plus, label: 'New Project', desc: 'Create with AI', color: 'text-primary' },
    { href: '/templates', icon: Sparkles, label: 'Templates', desc: 'Browse library', color: 'text-purple-500' },
    { href: '/playground', icon: Code, label: 'Playground', desc: 'Live editor', color: 'text-blue-500' },
    { href: '/animations', icon: Layers, label: 'Animations', desc: 'Library', color: 'text-pink-500' },
    { href: '/designer', icon: Zap, label: 'AI Designer', desc: 'Generate', color: 'text-amber-500' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics', desc: 'Track performance', color: 'text-green-500' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Creator'}!
          </h1>
          <p className="text-muted-foreground">
            Create stunning animated websites with AI
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatsCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={Folder}
            change={`${stats.totalProjects} created`}
            changeType="positive"
          />
          <StatsCard
            title="Active Deployments"
            value={stats.activeProjects}
            icon={TrendingUp}
            description="Live websites"
          />
          <StatsCard
            title="AI Credits"
            value={user?.ai_credits || 0}
            icon={Zap}
            description="Available credits"
          />
          <StatsCard
            title="Subscription"
            value={user?.subscription_tier || 'free'}
            icon={Star}
            description="Current plan"
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer h-full group">
                  <CardContent className="p-4 text-center">
                    <action.icon className={`h-8 w-8 mx-auto mb-2 ${action.color} group-hover:scale-110 transition-transform`} />
                    <p className="font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Your Projects</h2>
            <Link href="/projects" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-border">
              <Rocket className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first animated website with AI
              </p>
              <Link href="/generator">
                <Button leftIcon={<Plus className="h-4 w-4" />}>
                  Create Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Upgrade Banner */}
        {user?.subscription_tier === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
              <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Upgrade to Pro</h3>
                  <p className="text-muted-foreground">
                    Get unlimited AI credits, premium templates, and priority support
                  </p>
                </div>
                <Link href="/billing">
                  <Button>
                    View Plans
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}
