'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft, Key, Eye, EyeOff, Save, Check, AlertTriangle,
  Shield, Zap, Globe, Database, CreditCard, Sparkles
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import toast from 'react-hot-toast'

interface ApiKeyConfig {
  id: string
  name: string
  provider: string
  icon: any
  description: string
  keyPlaceholder: string
  envKey: string
  isActive: boolean
  lastUsed?: string
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [testingKey, setTestingKey] = useState<string | null>(null)

  const apiKeyConfigs: ApiKeyConfig[] = [
    {
      id: 'supabase-url',
      name: 'Supabase URL',
      provider: 'Supabase',
      icon: Database,
      description: 'Your Supabase project URL for authentication and database',
      keyPlaceholder: 'https://xxxx.supabase.co',
      envKey: 'NEXT_PUBLIC_SUPABASE_URL',
      isActive: false,
    },
    {
      id: 'supabase-anon',
      name: 'Supabase Anon Key',
      provider: 'Supabase',
      icon: Database,
      description: 'Public anonymous key for client-side operations',
      keyPlaceholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      envKey: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      isActive: false,
    },
{
      id: 'supabase-service',
      name: 'Supabase Service Role Key',
      provider: 'Supabase',
      icon: Database,
      description: 'Admin access to Supabase (server-side only)',
      keyPlaceholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      envKey: 'SUPABASE_SERVICE_ROLE_KEY',
      isActive: false,
    },
{
      id: 'openai',
      name: 'OpenAI API Key',
      provider: 'OpenAI',
      icon: Zap,
      description: 'Required for GPT-4 and DALL·E generation',
      keyPlaceholder: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx',
      envKey: 'OPENAI_API_KEY',
      isActive: false,
    },
{
      id: 'anthropic',
      name: 'Anthropic API Key',
      provider: 'Anthropic',
      icon: Shield,
      description: 'Required for Claude 3 Opus/Sonnet',
      keyPlaceholder: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx',
      envKey: 'ANTHROPIC_API_KEY',
      isActive: false,
    },
{
      id: 'google',
      name: 'Google API Key',
      provider: 'Google',
      icon: Globe,
      description: 'Required for Gemini Pro and Vertex AI',
      keyPlaceholder: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      envKey: 'GOOGLE_API_KEY',
      isActive: false,
    },
    {
      id: 'stripe-publishable',
      name: 'Stripe Publishable Key',
      provider: 'Stripe',
      icon: CreditCard,
      description: 'Client-side Stripe key for payments',
      keyPlaceholder: 'pk_live_YOUR_KEY_HERE',
      envKey: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      isActive: false,
    },
    {
      id: 'stripe-secret',
      name: 'Stripe Secret Key',
      provider: 'Stripe',
      icon: CreditCard,
      description: 'Server-side Stripe key (keep secret!)',
      keyPlaceholder: 'sk_test_YOUR_KEY_HERE',
      envKey: 'STRIPE_SECRET_KEY',
      isActive: false,
    },
    {
      id: 'stripe-webhook',
      name: 'Stripe Webhook Secret',
      provider: 'Stripe',
      icon: CreditCard,
      description: 'Secret for verifying Stripe webhooks',
      keyPlaceholder: 'whsec_YOUR_KEY_HERE',
      envKey: 'STRIPE_WEBHOOK_SECRET',
      isActive: false,
    },
  ]

  useEffect(() => {
    loadApiKeys()
  }, [])

  const loadApiKeys = async () => {
    try {
      const response = await fetch('/api/v1/settings/api-keys', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data.keys || {})
      }
    } catch (error) {
      console.error('Failed to load API keys')
    }
  }

  const handleSaveKey = async (envKey: string, value: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/settings/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ key: envKey, value }),
      })

      if (response.ok) {
        setApiKeys(prev => ({ ...prev, [envKey]: value }))
        toast.success('API key saved securely!')
      } else {
        toast.error('Failed to save API key')
      }
    } catch (error) {
      toast.error('Failed to save API key')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestKey = async (config: ApiKeyConfig) => {
    setTestingKey(config.id)
    try {
      const response = await fetch('/api/v1/settings/api-keys/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ provider: config.provider, envKey: config.envKey }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(`${config.provider} API key is working!`)
      } else {
        toast.error(`${config.provider} API key test failed: ${data.error}`)
      }
    } catch (error) {
      toast.error('Failed to test API key')
    } finally {
      setTestingKey(null)
    }
  }

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const maskKey = (key: string) => {
    if (!key) return ''
    if (key.length <= 8) return '••••••••'
    return key.substring(0, 4) + '••••' + key.substring(key.length - 4)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              href="/settings"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">API Keys</h1>
              <p className="text-muted-foreground">
                Manage your API keys for AI providers and integrations
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-500">Security Notice</p>
                  <p className="text-sm text-muted-foreground">
                    API keys are encrypted and stored securely. Never share your keys or commit them to version control.
                    Service role keys should only be used server-side.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* API Keys Grid */}
        <div className="space-y-6">
          {apiKeyConfigs.map((config, index) => (
            <motion.div
              key={config.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-muted">
                        <config.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{config.name}</h3>
                          {apiKeys[config.envKey] ? (
                            <Badge variant="success">
                              <Check className="h-3 w-3 mr-1" />
                              Configured
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Set</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        type={showKeys[config.id] ? 'text' : 'password'}
                        value={apiKeys[config.envKey] || ''}
                        onChange={(e) =>
                          setApiKeys(prev => ({ ...prev, [config.envKey]: e.target.value }))
                        }
                        placeholder={config.keyPlaceholder}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowKey(config.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showKeys[config.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleSaveKey(config.envKey, apiKeys[config.envKey] || '')}
                      isLoading={isLoading}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    {apiKeys[config.envKey] && (
                      <Button
                        variant="outline"
                        onClick={() => handleTestKey(config)}
                        isLoading={testingKey === config.id}
                      >
                        Test
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bulk Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Setup</CardTitle>
              <CardDescription>
                Import or export your API key configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => toast.success('Export feature coming soon!')}>
                  Export Keys
                </Button>
                <Button variant="outline" onClick={() => toast.success('Import feature coming soon!')}>
                  Import Keys
                </Button>
                <Button
                  variant="outline"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all API keys?')) {
                      setApiKeys({})
                      toast.success('All API keys cleared')
                    }
                  }}
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
