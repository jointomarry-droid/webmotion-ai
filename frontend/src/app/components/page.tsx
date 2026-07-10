'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Copy,
  Check,
  Code,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Component {
  id: string
  name: string
  description: string
  category: string
  code: string
  preview: string
  tags: string[]
}

const COMPONENTS: Component[] = [
  {
    id: '1',
    name: 'Animated Button',
    description: 'Button with hover animation and loading state',
    category: 'buttons',
    code: `<button class="animated-btn">
  <span class="btn-text">Click me</span>
  <span class="btn-loading">Loading...</span>
</button>

<style>
.animated-btn {
  position: relative;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.animated-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.animated-btn:active {
  transform: translateY(0);
}

.btn-loading {
  display: none;
}

.animated-btn.loading .btn-text {
  display: none;
}

.animated-btn.loading .btn-loading {
  display: inline;
}
</style>`,
    preview: '<button style="padding:12px 24px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:8px;cursor:pointer">Click me</button>',
    tags: ['button', 'animation', 'interactive'],
  },
  {
    id: '2',
    name: 'Glass Card',
    description: 'Frosted glass effect card component',
    category: 'cards',
    code: `<div class="glass-card">
  <h3>Glass Card</h3>
  <p>A beautiful frosted glass effect card</p>
</div>

<style>
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
</style>`,
    preview: '<div style="background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border-radius:16px;border:1px solid rgba(255,255,255,0.2);padding:24px;text-align:center"><h3 style="margin:0 0 8px">Glass Card</h3><p style="margin:0;opacity:0.8">Frosted glass effect</p></div>',
    tags: ['card', 'glass', 'modern'],
  },
  {
    id: '3',
    name: 'Gradient Text',
    description: 'Animated gradient text effect',
    category: 'typography',
    code: `<h1 class="gradient-text">Hello World</h1>

<style>
.gradient-text {
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
</style>`,
    preview: '<h1 style="background:linear-gradient(135deg,#667eea,#764ba2,#f093fb);background-size:200% 200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-size:2rem;font-weight:bold">Hello World</h1>',
    tags: ['text', 'gradient', 'animation'],
  },
  {
    id: '4',
    name: 'Loading Spinner',
    description: 'Animated loading spinner with customizable colors',
    category: 'loading',
    code: `<div class="spinner"></div>

<style>
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>`,
    preview: '<div style="width:40px;height:40px;border:4px solid rgba(102,126,234,0.2);border-top-color:#667eea;border-radius:50%;animation:spin 1s linear infinite"></div>',
    tags: ['loading', 'spinner', 'animation'],
  },
  {
    id: '5',
    name: 'Input with Icon',
    description: 'Styled input field with icon prefix',
    category: 'forms',
    code: `<div class="input-group">
  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
  </svg>
  <input type="text" placeholder="Search..." class="input-field">
</div>

<style>
.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  color: #9ca3af;
}

.input-field {
  padding: 12px 12px 12px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
</style>`,
    preview: '<div style="position:relative;display:flex;align-items:center;width:100%;max-width:300px"><svg style="position:absolute;left:12px;width:20px;height:20px;color:#9ca3af" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg><input type="text" placeholder="Search..." style="padding:12px 12px 12px 40px;border:1px solid #e5e7eb;border-radius:8px;font-size:16px;width:100%"></div>',
    tags: ['input', 'form', 'icon'],
  },
  {
    id: '6',
    name: 'Navigation Bar',
    description: 'Responsive navigation bar with mobile menu',
    category: 'navigation',
    code: `<nav class="navbar">
  <div class="nav-brand">Brand</div>
  <div class="nav-links">
    <a href="#" class="nav-link">Home</a>
    <a href="#" class="nav-link">About</a>
    <a href="#" class="nav-link">Contact</a>
  </div>
  <button class="nav-toggle">☰</button>
</nav>

<style>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: #374151;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #667eea;
}

.nav-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .nav-toggle { display: block; }
}
</style>`,
    preview: '<nav style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:white;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1)"><span style="font-weight:bold">Brand</span><div style="display:flex;gap:16px;font-size:14px"><a href="#" style="text-decoration:none;color:#374151">Home</a><a href="#" style="text-decoration:none;color:#374151">About</a><a href="#" style="text-decoration:none;color:#374151">Contact</a></div></nav>',
    tags: ['navigation', 'navbar', 'responsive'],
  },
]

export default function ComponentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [previewCode, setPreviewCode] = useState<string | null>(null)

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'buttons', label: 'Buttons' },
    { value: 'cards', label: 'Cards' },
    { value: 'forms', label: 'Forms' },
    { value: 'navigation', label: 'Navigation' },
    { value: 'typography', label: 'Typography' },
    { value: 'loading', label: 'Loading' },
  ]

  const filteredComponents = COMPONENTS.filter((comp) => {
    const matchesSearch =
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory =
      selectedCategory === 'all' || comp.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCopyCode = (code: string, id: string) => {
    copyToClipboard(code)
    setCopiedId(id)
    toast.success('Code copied!')
    setTimeout(() => setCopiedId(null), 2000)
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
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Component Library</h1>
              <p className="text-muted-foreground">
                Pre-built, animated UI components ready to use
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search components..."
                    leftIcon={<Search className="h-4 w-4" />}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Components Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredComponents.map((component, index) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:border-primary/50 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{component.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {component.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{component.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Preview */}
                  <div className="h-32 mb-4 rounded-lg bg-muted/30 flex items-center justify-center overflow-hidden p-4">
                    <div
                      className="w-full"
                      dangerouslySetInnerHTML={{ __html: component.preview }}
                    />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {component.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1"
                      onClick={() => setPreviewCode(component.code)}
                    >
                      <Code className="h-4 w-4 mr-1" />
                      View Code
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyCode(component.code, component.id)}
                    >
                      {copiedId === component.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Code Preview Modal */}
        {previewCode && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl max-h-[80vh] bg-background rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold">Component Code</h3>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      copyToClipboard(previewCode)
                      toast.success('Code copied!')
                    }}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setPreviewCode(null)}>
                    Close
                  </Button>
                </div>
              </div>
              <div className="p-4 overflow-auto max-h-[60vh]">
                <pre className="text-sm font-mono text-muted-foreground whitespace-pre-wrap">
                  {previewCode}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
