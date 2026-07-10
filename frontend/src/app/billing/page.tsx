'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Check, Zap, CreditCard, History, Download, Sparkles, Crown, Star
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  subscription_tier: string
  ai_credits: number
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out',
    price_monthly: 0,
    price_yearly: 0,
    ai_credits: 100,
    features: [
      '100 AI credits/month',
      '5 projects',
      'Community templates',
      'Basic animations',
      'Email support',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'For individual creators',
    price_monthly: 19,
    price_yearly: 190,
    ai_credits: 1000,
    is_popular: true,
    features: [
      '1,000 AI credits/month',
      '25 projects',
      'Premium templates',
      'Advanced animations',
      'Priority support',
      'Custom fonts',
      'Export code',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals & agencies',
    price_monthly: 49,
    price_yearly: 490,
    ai_credits: 5000,
    features: [
      '5,000 AI credits/month',
      'Unlimited projects',
      'All premium templates',
      'All animations',
      '24/7 support',
      'Custom branding',
      'API access',
      'Team collaboration',
    ],
  },
]

const CREDIT_PACKS = [
  { amount: 100, price: 10, label: 'Starter' },
  { amount: 500, price: 40, label: 'Popular', popular: true },
  { amount: 1000, price: 70, label: 'Best Value' },
]

export default function BillingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        setUser(profile)
      }
      setIsLoading(false)
    }

    fetchUser()
  }, [router, supabase])

  const handleSubscribe = async (planId: string) => {
    toast.success(`Redirecting to checkout for ${planId} plan...`)
    // In production: redirect to Stripe checkout
  }

  const handlePurchaseCredits = async (amount: number) => {
    toast.success(`Redirecting to checkout for ${amount} credits...`)
    // In production: redirect to Stripe checkout
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription and purchase AI credits
          </p>
        </motion.div>

        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Current Plan</h2>
                    <Badge variant="default" className="capitalize">
                      {user?.subscription_tier || 'Free'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    You have <span className="font-semibold text-primary">{user?.ai_credits || 0}</span> AI credits remaining
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{user?.ai_credits || 0}</p>
                    <p className="text-xs text-muted-foreground">Credits Left</p>
                  </div>
                  <Button onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Zap className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-4">
            <span className={billingCycle === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-12 h-6 rounded-full bg-primary transition-colors"
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'left-7' : 'left-1'
                }`}
              />
            </button>
            <span className={billingCycle === 'yearly' ? 'font-semibold' : 'text-muted-foreground'}>
              Yearly
              <Badge className="ml-2 bg-green-500 text-white">Save 17%</Badge>
            </span>
          </div>
        </motion.div>

        {/* Pricing Plans */}
        <div id="plans" className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan, index) => {
              const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly
              const isCurrentPlan = user?.subscription_tier === plan.id

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className={`relative h-full ${plan.is_popular ? 'border-primary shadow-lg shadow-primary/20' : ''}`}>
                    {plan.is_popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">
                          {price === 0 ? 'Free' : `$${price}`}
                        </span>
                        {price > 0 && (
                          <span className="text-muted-foreground">
                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>{plan.ai_credits} credits/month</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full mt-6"
                        variant={isCurrentPlan ? 'outline' : 'default'}
                        disabled={isCurrentPlan}
                        onClick={() => handleSubscribe(plan.id)}
                      >
                        {isCurrentPlan ? 'Current Plan' : price === 0 ? 'Get Started' : 'Subscribe Now'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Credit Packs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Purchase AI Credits
              </CardTitle>
              <CardDescription>
                Need more credits? Purchase additional credits anytime. Each generation uses 1-5 credits.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {CREDIT_PACKS.map((pack) => (
                  <Card
                    key={pack.amount}
                    className={`relative text-center ${pack.popular ? 'border-primary shadow-md' : ''}`}
                  >
                    {pack.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary">{pack.label}</Badge>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="text-4xl font-bold mb-2">{pack.amount}</div>
                      <p className="text-muted-foreground mb-4">credits</p>
                      <div className="text-2xl font-semibold mb-1">${pack.price}</div>
                      <p className="text-xs text-muted-foreground mb-4">
                        ${(pack.price / pack.amount * 100).toFixed(1)}/100 credits
                      </p>
                      <Button
                        className="w-full"
                        variant={pack.popular ? 'default' : 'outline'}
                        onClick={() => handlePurchaseCredits(pack.amount)}
                      >
                        Buy Credits
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
