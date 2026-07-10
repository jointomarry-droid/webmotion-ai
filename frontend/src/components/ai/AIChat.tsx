'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Trash2, Download, Code2, Eye, Zap } from 'lucide-react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { useAIStore } from '@/lib/store'
import { AIMessage } from '@/types'
import { generateId, copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'

interface AIChatProps {
  onCodeGenerated?: (code: string) => void
}

export function AIChat({ onCodeGenerated }: AIChatProps) {
  const { messages, addMessage, clearMessages, isGenerating, setGenerating } = useAIStore()
  const [selectedModel, setSelectedModel] = useState('auto')
  const [selectedFramework, setSelectedFramework] = useState('framer-motion')
  const [lastProvider, setLastProvider] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (content: string) => {
    const userMessage: AIMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    addMessage(userMessage)

    setGenerating(true)
    try {
      const response = await fetch('/api/v1/ai/generate-animation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: content,
          framework: selectedFramework,
          model: selectedModel === 'auto' ? undefined : selectedModel,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      setLastProvider(data.provider)

      const assistantMessage: AIMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
        model: data.model,
        tokens: data.tokens_used,
      }
      addMessage(assistantMessage)

      if (onCodeGenerated) {
        onCodeGenerated(data.content)
      }

      // Show provider info
      const providerNames: Record<string, string> = {
        openai: 'OpenAI',
        anthropic: 'Anthropic',
        gemini: 'Gemini',
        template: 'Template Engine',
      }
      toast.success(`Generated via ${providerNames[data.provider] || data.provider} (${data.latency}ms)`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate animation')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyCode = async (code: string) => {
    await copyToClipboard(code)
    toast.success('Code copied to clipboard!')
  }

  const handleDownloadCode = (code: string, filename: string = 'animation.tsx') => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Code downloaded!')
  }

  const lastAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.role === 'assistant')

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">AI Animation Generator</h3>
            <p className="text-xs text-muted-foreground">
              {lastProvider && (
                <span className="inline-flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Powered by {lastProvider === 'template' ? 'Template Engine' : lastProvider}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-lg border border-input bg-background"
          >
            <option value="framer-motion">Framer Motion</option>
            <option value="gsap">GSAP</option>
            <option value="css">CSS Only</option>
          </select>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-lg border border-input bg-background"
          >
            <option value="auto">Auto (Best Available)</option>
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="claude-sonnet-4-20250514">Claude Sonnet 4</option>
            <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
          </select>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearMessages}
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
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
              Create stunning animations
            </h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Describe the animation you want, and I&apos;ll generate production-ready
              React code using Framer Motion, GSAP, or CSS.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Hero section with parallax', 'Animated pricing cards', 'Scroll-triggered features', 'Staggered gallery grid'].map((suggestion) => (
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
                <ChatMessage key={message.id} message={message} index={index} />
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
                    Generating animation...
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Generated Code Preview */}
      {lastAssistantMessage && (
        <div className="border-t border-border p-4">
          <Tabs defaultValue="code">
            <TabsList>
              <TabsTrigger value="code">
                <Code2 className="h-4 w-4 mr-1" />
                Code
              </TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="mt-2">
              <div className="relative">
                <pre className="p-4 rounded-xl bg-muted/30 text-sm overflow-x-auto max-h-40">
                  <code className="text-xs">{lastAssistantMessage.content.slice(0, 500)}...</code>
                </pre>
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCopyCode(lastAssistantMessage.content)}
                  >
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDownloadCode(lastAssistantMessage.content)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <ChatInput
          onSend={handleSend}
          isLoading={isGenerating}
        />
      </div>
    </div>
  )
}
