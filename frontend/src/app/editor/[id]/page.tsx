'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Play,
  Download,
  Copy,
  Undo,
  Redo,
  Settings,
  Layers,
  Palette,
  Code2,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  Loader2,
  Check,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { AIChat } from '@/components/ai/AIChat'
import { useProjectStore } from '@/lib/store'
import { Project } from '@/types'
import toast from 'react-hot-toast'

type Device = 'desktop' | 'tablet' | 'mobile'
type Panel = 'components' | 'styles' | 'ai' | 'code'

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const { selectedProject, setSelectedProject, setLoading } = useProjectStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [device, setDevice] = useState<Device>('desktop')
  const [activePanel, setActivePanel] = useState<Panel>('components')
  const [code, setCode] = useState('')
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  useEffect(() => {
    fetchProject()
  }, [params.id])

  const fetchProject = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/v1/projects/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      setSelectedProject(data)
      setCode(data.generated_code || '')
    } catch (error) {
      console.error('Failed to fetch project:', error)
      toast.error('Failed to load project')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await fetch(`/api/v1/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ generated_code: code }),
      })
      toast.success('Project saved!')
    } catch (error) {
      toast.error('Failed to save project')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeploy = () => {
    router.push(`/deploy/${params.id}`)
  }

  const handleCodeGenerated = (newCode: string) => {
    setCode(newCode)
  }

  const components = [
    { id: 'hero', name: 'Hero Section', icon: '🎯' },
    { id: 'features', name: 'Features Grid', icon: '✨' },
    { id: 'pricing', name: 'Pricing Table', icon: '💰' },
    { id: 'testimonials', name: 'Testimonials', icon: '💬' },
    { id: 'cta', name: 'Call to Action', icon: '📢' },
    { id: 'footer', name: 'Footer', icon: '📄' },
    { id: 'nav', name: 'Navigation', icon: '🧭' },
    { id: 'form', name: 'Contact Form', icon: '📝' },
  ]

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-semibold">{selectedProject?.name || 'Untitled Project'}</h1>
            <p className="text-xs text-muted-foreground">Editing</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Switcher */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-muted">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded ${device === 'desktop' ? 'bg-background shadow-sm' : ''}`}
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded ${device === 'tablet' ? 'bg-background shadow-sm' : ''}`}
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded ${device === 'mobile' ? 'bg-background shadow-sm' : ''}`}
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-border" />

          <Button variant="ghost" size="icon" disabled={!canUndo}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={!canRedo}>
            <Redo className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-border" />

          <Button variant="outline" size="sm" onClick={handleSave} isLoading={isSaving}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button size="sm" onClick={handleDeploy}>
            <Play className="h-4 w-4 mr-1" />
            Deploy
          </Button>
        </div>
      </header>

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Panels */}
        <div className="w-14 border-r border-border flex flex-col items-center py-2 gap-1">
          <button
            onClick={() => setActivePanel('components')}
            className={`p-3 rounded-lg transition-colors ${
              activePanel === 'components' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
            title="Components"
          >
            <Layers className="h-5 w-5" />
          </button>
          <button
            onClick={() => setActivePanel('styles')}
            className={`p-3 rounded-lg transition-colors ${
              activePanel === 'styles' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
            title="Styles"
          >
            <Palette className="h-5 w-5" />
          </button>
          <button
            onClick={() => setActivePanel('ai')}
            className={`p-3 rounded-lg transition-colors ${
              activePanel === 'ai' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
            title="AI Assistant"
          >
            <Sparkles className="h-5 w-5" />
          </button>
          <button
            onClick={() => setActivePanel('code')}
            className={`p-3 rounded-lg transition-colors ${
              activePanel === 'code' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
            title="Code"
          >
            <Code2 className="h-5 w-5" />
          </button>
        </div>

        {/* Panel Content */}
        <div className="w-72 border-r border-border overflow-y-auto">
          {activePanel === 'components' && (
            <div className="p-4">
              <h3 className="font-semibold mb-4">Components</h3>
              <div className="space-y-2">
                {components.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors"
                    draggable
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{comp.icon}</span>
                      <span className="text-sm font-medium">{comp.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePanel === 'styles' && (
            <div className="p-4 space-y-4">
              <h3 className="font-semibold">Styles</h3>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Primary Color</label>
                <div className="flex gap-2">
                  {['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#22c55e'].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-transparent hover:border-foreground"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Font Family</label>
                <select className="w-full p-2 rounded-lg border border-input bg-background text-sm">
                  <option>Inter</option>
                  <option>Geist</option>
                  <option>Poppins</option>
                  <option>Playfair Display</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Border Radius</label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  defaultValue="8"
                  className="w-full"
                />
              </div>
            </div>
          )}

          {activePanel === 'ai' && (
            <div className="h-full">
              <AIChat onCodeGenerated={handleCodeGenerated} />
            </div>
          )}

          {activePanel === 'code' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Code</h3>
                <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(code)}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
              <pre className="p-4 rounded-xl bg-muted/30 text-xs overflow-x-auto max-h-[600px] overflow-y-auto">
                <code>{code || '// No code generated yet'}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-muted/30 p-8 overflow-auto flex justify-center">
          <div
            className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
            style={{ width: deviceWidths[device], maxWidth: '100%' }}
          >
            {code ? (
              <div className="p-8 text-center text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Live preview will render here</p>
                <p className="text-sm mt-2">
                  Your generated code will be rendered in this canvas
                </p>
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p>Use the AI assistant to generate code</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
