'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Github,
  Globe,
  Loader2,
  Check,
  ExternalLink,
  Copy,
  RefreshCw,
  Settings,
  Terminal,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { useProjectStore } from '@/lib/store'
import { copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'

type DeployProvider = 'vercel' | 'github' | 'netlify'
type DeployStatus = 'idle' | 'building' | 'deploying' | 'success' | 'failed'

export default function DeployPage() {
  const params = useParams()
  const router = useRouter()
  const { selectedProject, setSelectedProject } = useProjectStore()
  const [selectedProvider, setSelectedProvider] = useState<DeployProvider>('vercel')
  const [deployStatus, setDeployStatus] = useState<DeployStatus>('idle')
  const [deploymentUrl, setDeploymentUrl] = useState('')
  const [repositoryName, setRepositoryName] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [deployLogs, setDeployLogs] = useState<string[]>([])

  useEffect(() => {
    fetchProject()
  }, [params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/v1/projects/${params.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      const data = await response.json()
      setSelectedProject(data)
      if (data.deployment_url) {
        setDeploymentUrl(data.deployment_url)
        setDeployStatus('success')
      }
    } catch (error) {
      console.error('Failed to fetch project:', error)
    }
  }

  const handleConnectGitHub = async () => {
    setIsConnecting(true)
    // Simulate GitHub OAuth connection
    setTimeout(() => {
      setIsConnected(true)
      setIsConnecting(false)
      toast.success('GitHub connected!')
    }, 1500)
  }

  const handleDeploy = async () => {
    setDeployStatus('building')
    setDeployLogs([
      'Starting deployment...',
      'Installing dependencies...',
      'Building project...',
      'Optimizing assets...',
      'Deploying to Vercel...',
    ])

    try {
      const response = await fetch(`/api/v1/deploy/${selectedProvider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ project_id: params.id }),
      })

      const data = await response.json()

      if (response.ok) {
        setDeployStatus('success')
        setDeploymentUrl(data.deployment_url || `https://${repositoryName}.vercel.app`)
        setDeployLogs((prev) => [...prev, 'Deployment successful!'])
        toast.success('Deployment successful!')
      } else {
        setDeployStatus('failed')
        setDeployLogs((prev) => [...prev, 'Deployment failed!'])
        toast.error('Deployment failed')
      }
    } catch (error) {
      setDeployStatus('failed')
      setDeployLogs((prev) => [...prev, 'Error: Network request failed'])
      toast.error('Deployment failed')
    }
  }

  const handleCopyUrl = () => {
    copyToClipboard(deploymentUrl)
    toast.success('URL copied!')
  }

  const providers = [
    {
      id: 'vercel' as DeployProvider,
      name: 'Vercel',
      description: 'Deploy to Vercel with automatic CI/CD',
      icon: Globe,
      color: 'bg-black text-white',
    },
    {
      id: 'github' as DeployProvider,
      name: 'GitHub Pages',
      description: 'Push to GitHub repository',
      icon: Github,
      color: 'bg-gray-900 text-white',
    },
    {
      id: 'netlify' as DeployProvider,
      name: 'Netlify',
      description: 'Deploy with Netlify',
      icon: Globe,
      color: 'bg-teal-600 text-white',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href={`/editor/${params.id}`}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-semibold">Deploy Project</h1>
                <p className="text-xs text-muted-foreground">
                  {selectedProject?.name || 'Untitled Project'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Deployment Success */}
        {deployStatus === 'success' && deploymentUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-500/20">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Deployment Successful!</h3>
                    <p className="text-muted-foreground">
                      Your site is live at:
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="px-3 py-1 rounded bg-muted text-sm font-mono">
                        {deploymentUrl}
                      </code>
                      <Button size="sm" variant="ghost" onClick={handleCopyUrl}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                  <Button onClick={() => window.open(deploymentUrl, '_blank')}>
                    View Live Site
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Provider Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Deployment Provider</CardTitle>
                <CardDescription>
                  Choose where to deploy your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedProvider === provider.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${provider.color}`}>
                        <provider.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {provider.description}
                        </p>
                      </div>
                      {selectedProvider === provider.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedProvider === 'github' && (
                  <>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <Github className="h-5 w-5" />
                        <div>
                          <p className="font-medium">GitHub Account</p>
                          <p className="text-sm text-muted-foreground">
                            {isConnected ? 'Connected as username' : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      {isConnected ? (
                        <Badge variant="success">Connected</Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleConnectGitHub}
                          isLoading={isConnecting}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                    <Input
                      label="Repository Name"
                      value={repositoryName}
                      onChange={(e) => setRepositoryName(e.target.value)}
                      placeholder="my-animated-website"
                    />
                  </>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">Build Command</label>
                  <Input
                    value="npm run build"
                    disabled
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Output Directory</label>
                  <Input
                    value=".next"
                    disabled
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Deploy Button */}
            <Card>
              <CardContent className="p-6">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleDeploy}
                  disabled={deployStatus === 'building' || deployStatus === 'deploying'}
                  isLoading={deployStatus === 'building' || deployStatus === 'deploying'}
                >
                  {deployStatus === 'building' || deployStatus === 'deploying' ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      Deploy Now
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Deploy Logs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Deploy Logs</CardTitle>
                  {deployLogs.length > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeployLogs([])}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-xl p-4 font-mono text-xs max-h-64 overflow-y-auto">
                  {deployLogs.length === 0 ? (
                    <p className="text-muted-foreground">No logs yet</p>
                  ) : (
                    deployLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2 mb-1">
                        <span className="text-muted-foreground">{'>'}</span>
                        <span>{log}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-deploy on push</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Preview deployments</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Custom domain</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
