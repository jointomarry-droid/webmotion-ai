'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Trash2, Download, Code2, Eye, Zap, Send, Globe, FileCode, Settings, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Label } from '@/components/ui/Label'
import { toast } from 'react-hot-toast'
import { copyToClipboard } from '@/lib/utils'
import { generateId } from '@/lib/utils'

interface WebsiteMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  model?: string
  tokens?: number
  provider?: string
  latency?: number
  files?: Record<string, string>
}

interface WebsiteGeneratorProps {
  onCodeGenerated?: (code: string, files?: Record<string, string>) => void
}

export function WebsiteGenerator({ onCodeGenerated }: WebsiteGeneratorProps) {
  const [messages, setMessages] = useState<WebsiteMessage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedModel, setSelectedModel] = useState('auto')
  const [selectedStyle, setSelectedStyle] = useState('modern')
  const [selectedPages, setSelectedPages] = useState<string[]>(['home', 'about', 'contact', 'pricing'])
  const [lastProvider, setLastProvider] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const availablePages = [
    { id: 'home', name: 'Home', icon: Globe },
    { id: 'about', name: 'About', icon: FileCode },
    { id: 'contact', name: 'Contact', icon: FileCode },
    { id: 'pricing', name: 'Pricing', icon: FileCode },
    { id: 'blog', name: 'Blog', icon: FileCode },
    { id: 'features', name: 'Features', icon: FileCode },
    { id: 'testimonials', name: 'Testimonials', icon: FileCode },
    { id: 'faq', name: 'FAQ', icon: FileCode },
  ]

  const availableStyles = [
    { id: 'modern', name: 'Modern', description: 'Clean, minimalist with subtle animations' },
    { id: 'minimal', name: 'Minimal', description: 'Ultra-clean with lots of white space' },
    { id: 'luxury', name: 'Luxury', description: 'Dark with gold accents, premium feel' },
    { id: 'playful', name: 'Playful', description: 'Colorful, rounded, engaging animations' },
    { id: 'corporate', name: 'Corporate', description: 'Professional, blue/gray, trustworthy' },
  ]

  const handleSend = async (content: string) => {
    const userMessage: WebsiteMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMessage])

    setIsGenerating(true)
    try {
      const response = await fetch('/api/v1/ai/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: content,
          style: selectedStyle,
          pages: selectedPages,
          model: selectedModel === 'auto' ? undefined : selectedModel,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      setLastProvider(data.provider)

      const assistantMessage: WebsiteMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
        model: data.model,
        tokens: data.tokens_used,
        provider: data.provider,
        latency: data.latency_ms,
        files: parseGeneratedFiles(data.content),
      }
      setMessages(prev => [...prev, assistantMessage])

      if (onCodeGenerated) {
        onCodeGenerated(data.content, assistantMessage.files)
      }

      const providerNames: Record<string, string> = {
        openai: 'OpenAI',
        anthropic: 'Anthropic',
        gemini: 'Gemini',
        openrouter: 'OpenRouter',
        ollama: 'Ollama',
        template: 'Template Engine',
      }
      toast.success(`Generated via ${providerNames[data.provider] || data.provider} (${data.latency_ms}ms)`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate website')
    } finally {
      setIsGenerating(false)
    }
  }

  const parseGeneratedFiles = (content: string): Record<string, string> => {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(content)
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed
      }
    } catch {
      // Not JSON, return as single file
    }
    return { 'src/app/page.tsx': content }
  }

  const handleCopyCode = async (code: string) => {
    await copyToClipboard(code)
    toast.success('Code copied to clipboard!')
  }

  const handleDownloadCode = (code: string, filename: string = 'website.tsx') => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Code downloaded!')
  }

  const handleDownloadAll = (files: Record<string, string>) => {
    // Create a zip-like download with all files
    const content = Object.entries(files)
      .map(([path, code]) => `// File: ${path}\n${code}`)
      .join('\n\n')
    handleDownloadCode(content, 'website-project.txt')
  }

  const lastAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.role === 'assistant')

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-sm md:text-base">AI Website Generator</h1>
                <p className="text-xs text-muted-foreground">
                  {lastProvider && (
                    <span className="inline-flex items-center gap-1">
                      <Zap className="h-2.5 w-2.5" />
                      Powered by {lastProvider === 'template' ? 'Template Engine' : lastProvider}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tabs defaultValue="chat" value={activeTab} onValueChange={(v: string) => setActiveTab(v)} className="hidden md:flex">
                <TabsList className="grid w-auto grid-cols-4 bg-transparent p-0">
                  <TabsTrigger value="chat" className="text-xs px-3">Chat</TabsTrigger>
                  <TabsTrigger value="preview" className="text-xs px-3">Preview</TabsTrigger>
                  <TabsTrigger value="code" className="text-xs px-3">Code</TabsTrigger>
                  <TabsTrigger value="files" className="text-xs px-3">Files</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMessages([])}
                title="Clear chat"
                className="hidden md:flex"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Mobile Tab Bar */}
          <div className="md:hidden h-10 border-t border-border">
            <Tabs defaultValue="chat" value={activeTab} onValueChange={(v: string) => setActiveTab(v)}>
              <TabsList className="flex h-full w-full bg-transparent p-0">
                <TabsTrigger value="chat" className="flex-1 text-xs py-1">Chat</TabsTrigger>
                <TabsTrigger value="preview" className="flex-1 text-xs py-1">Preview</TabsTrigger>
                <TabsTrigger value="code" className="flex-1 text-xs py-1">Code</TabsTrigger>
                <TabsTrigger value="files" className="flex-1 text-xs py-1">Files</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      {/* Settings Bar */}
      <div className="border-b border-border bg-muted/30 px-4 py-3 hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-xs font-medium">Style:</Label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue placeholder="Modern" />
              </SelectTrigger>
              <SelectContent>
                {availableStyles.map(style => (
                  <SelectItem key={style.id} value={style.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{style.name}</span>
                      <span className="text-xs text-muted-foreground">{style.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Label className="text-xs font-medium">Pages:</Label>
            <div className="flex flex-wrap gap-1">
              {availablePages.map(page => (
                <label key={page.id} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border border-border hover:bg-primary/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(page.id)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.checked) {
                        setSelectedPages(prev => [...prev, page.id])
                      } else {
                        setSelectedPages(prev => prev.filter(p => p !== page.id))
                      }
                    }}
                    className="rounded"
                  />
                  <page.icon className="h-3 w-3" />
                  <span>{page.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Label className="text-xs font-medium">Model:</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48 h-8 text-xs">
                <SelectValue placeholder="Auto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (Best Available)</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="claude-sonnet-4-20250514">Claude Sonnet 4</SelectItem>
                <SelectItem value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</SelectItem>
                <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Mobile Settings */}
      <div className="md:hidden border-b border-border bg-muted/30 px-4 py-3 space-y-3">
        <div>
          <Label className="text-xs font-medium block mb-1">Style:</Label>
          <Select value={selectedStyle} onValueChange={setSelectedStyle}>
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Modern" />
            </SelectTrigger>
            <SelectContent>
              {availableStyles.map(style => (
                <SelectItem key={style.id} value={style.id}>{style.name} - {style.description}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium block mb-1">Pages:</Label>
          <div className="flex flex-wrap gap-1">
            {availablePages.map(page => (
              <label key={page.id} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border border-border hover:bg-primary/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPages.includes(page.id)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      setSelectedPages(prev => [...prev, page.id])
                    } else {
                      setSelectedPages(prev => prev.filter(p => p !== page.id))
                    }
                  }}
                  className="rounded"
                />
                <span>{page.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-xs font-medium block mb-1">Model:</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Auto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto (Best Available)</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="claude-sonnet-4-20250514">Claude Sonnet 4</SelectItem>
              <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="w-full lg:w-1/2 border-r border-border flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Create a complete website with AI
                </h3>
                <p className="text-muted-foreground max-w-md mb-6 text-center">
                  Describe the website you want to build. I&apos;ll generate a complete Next.js 15 project
                  with TypeScript, Tailwind CSS, Framer Motion animations, and full SEO optimization.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    'SaaS landing page for AI startup',
                    'E-commerce store for handmade jewelry',
                    'Portfolio website for creative designer',
                    'School management system dashboard',
                    'Restaurant website with online ordering',
                    'Real estate listing platform',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSend(suggestion)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <WebsiteMessageComponent key={message.id} message={message} index={index} />
                  ))}
                </AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 p-4 rounded-xl bg-muted/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        Generating complete website...
                      </p>
                    </div>
                  </motion.div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <WebsiteChatInput
              onSend={handleSend}
              isLoading={isGenerating}
              placeholder="Describe the website you want to build..."
            />
          </div>
        </div>

        {/* Preview/Code/Files Panel */}
        <div className="hidden lg:flex lg:w-1/2 flex-col min-h-0">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(v: string) => setActiveTab(v)} className="flex-1 flex flex-col min-h-0">
            <div className="border-b border-border px-4">
              <TabsList className="grid w-full grid-cols-4 bg-transparent p-0">
                <TabsTrigger value="preview" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="text-xs">
                  <Code2 className="h-3 w-3 mr-1" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="files" className="text-xs">
                  <FileCode className="h-3 w-3 mr-1" />
                  Files
                </TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence>
              <TabsContent value="preview" className="flex-1 m-0 min-h-0">
                <WebsitePreview content={lastAssistantMessage?.content || ''} files={lastAssistantMessage?.files} />
              </TabsContent>

              <TabsContent value="code" className="flex-1 p-4 m-0 min-h-0">
                <WebsiteCodeView 
                  content={lastAssistantMessage?.content || ''} 
                  onCopy={handleCopyCode}
                  onDownload={handleDownloadCode}
                />
              </TabsContent>

              <TabsContent value="files" className="flex-1 p-4 m-0 min-h-0">
                <WebsiteFilesView 
                  files={lastAssistantMessage?.files || {}} 
                  selectedFile={selectedFile}
                  onSelectFile={setSelectedFile}
                  onCopy={handleCopyCode}
                  onDownload={handleDownloadCode}
                  onDownloadAll={() => lastAssistantMessage?.files && handleDownloadAll(lastAssistantMessage.files)}
                />
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function WebsiteMessageComponent({ message, index }: { message: WebsiteMessage; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'}`}>
        {message.role === 'user' ? 'U' : <Sparkles className="h-4 w-4" />}
      </div>
      <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
        <div className={`inline-block max-w-[85%] p-3 rounded-2xl ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        {message.model && (
          <div className="flex items-center gap-2 mt-1 justify-end">
            <span className="text-xs text-muted-foreground">
              {message.provider} • {message.model} • {message.tokens} tokens • {message.latency}ms
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function WebsiteChatInput({ onSend, isLoading, placeholder }: { onSend: (content: string) => void; isLoading: boolean; placeholder: string }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && !isLoading) {
      onSend(value.trim())
      setValue('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        className="flex-1 min-h-[80px] max-h-[200px] resize-none"
        rows={3}
      />
      <Button
        type="submit"
        size="lg"
        disabled={!value.trim() || isLoading}
        className="h-[80px] flex-shrink-0"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  )
}

function WebsitePreview({ content, files }: { content: string; files?: Record<string, string> }) {
  // Try to extract the main page component
  let pageCode = content
  if (files) {
    pageCode = files['src/app/page.tsx'] || files['app/page.tsx'] || content
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Live Preview (Simulated)</span>
        <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          ✓ Responsive
        </span>
      </div>
      <div className="flex-1 bg-white dark:bg-gray-900 relative">
        <iframe
          srcDoc={generatePreviewHTML(pageCode, files)}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  )
}

function generatePreviewHTML(pageCode: string, files?: Record<string, string>): string {
  // Extract imports and component
  const tailwindCDN = '<script src="https://cdn.tailwindcss.com"></script>'
  const reactCDN = '<script crossorigin src="https://esm.sh/react@19"></script><script crossorigin src="https://esm.sh/react-dom@19/client"></script>'
  const framerMotionCDN = '<script src="https://esm.sh/framer-motion@11"></script>'
  const lucideCDN = '<script src="https://esm.sh/lucide-react@0.400"></script>'

  return `<!DOCTYPE html>
<html>
<head>
  ${tailwindCDN}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  ${reactCDN}
  ${framerMotionCDN}
  ${lucideCDN}
  <script type="module">
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import { motion } from 'framer-motion'
    
    // Simulated component
    const App = () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Generated Website Preview</h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              The actual preview would render the generated Next.js component here.
              Use the "Code" tab to view the full source code.
            </p>
            <button className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold text-lg hover:bg-slate-100 transition-colors">
              Get Started
            </button>
          </div>
        </section>
      </div>
    )
    
    const root = ReactDOM.createRoot(document.getElementById('root'))
    root.render(<App />)
  </script>
</body>
</html>`
}

function WebsiteCodeView({ content, onCopy, onDownload }: { content: string; onCopy: (code: string) => void; onDownload: (code: string) => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await onCopy(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="relative">
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-slate-900/95 backdrop-blur border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs text-slate-400">page.tsx</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onDownload(content)}
            >
              <Download className="h-3 w-3" />
              Download
            </Button>
          </div>
        </div>
        <pre className="p-4 text-sm font-mono text-slate-300 overflow-auto h-full">
          <code>{content || '// Generated website code will appear here\n// Describe your website in the chat to generate code'}</code>
        </pre>
      </div>
    </div>
  )
}

function WebsiteFilesView({ 
  files, 
  selectedFile, 
  onSelectFile, 
  onCopy, 
  onDownload,
  onDownloadAll 
}: { 
  files: Record<string, string>
  selectedFile: string | null
  onSelectFile: (file: string) => void
  onCopy: (code: string) => void
  onDownload: (code: string, filename?: string) => void
  onDownloadAll: () => void
}) {
  const [copied, setCopied] = useState(false)

  const fileEntries = Object.entries(files)

  if (fileEntries.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        <div className="text-center">
          <FileCode className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p>No files generated yet</p>
          <p className="text-sm mt-2">Describe a website in the chat to generate files</p>
        </div>
      </div>
    )
  }

  const handleCopy = async (code: string) => {
    await onCopy(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between p-3 border-b border-border bg-background">
        <h3 className="font-medium text-sm">Project Files ({fileEntries.length})</h3>
        <Button size="sm" variant="outline" onClick={onDownloadAll}>
          <Download className="h-3 w-3 mr-1" />
          Download All
        </Button>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree */}
        <div className="w-64 border-r border-border bg-muted/30 overflow-y-auto p-2">
          <div className="space-y-1">
            {fileEntries.map(([path]) => (
              <button
                key={path}
                onClick={() => onSelectFile(path)}
                className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors ${
                  selectedFile === path ? 'bg-primary text-primary-foreground' : ''
                }`}
              >
                <FileCode className="h-3 w-3 inline mr-1" />
                {path}
              </button>
            ))}
          </div>
        </div>

        {/* File Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedFile && files[selectedFile] && (
            <>
              <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-slate-900/95 backdrop-blur border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-xs text-slate-400">{selectedFile}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCopy(files[selectedFile] || '')}
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onDownload(files[selectedFile] || '', selectedFile.split('/').pop() || 'file.ts')}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <pre className="flex-1 p-4 text-sm font-mono text-slate-300 overflow-auto bg-slate-950">
                <code>{files[selectedFile]}</code>
              </pre>
            </>
          )}
          {!selectedFile && (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <p>Select a file to view its content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}