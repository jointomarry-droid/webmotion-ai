'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  MessageSquare,
  Search,
  Trash2,
  Clock,
  Bot,
  User,
  MoreVertical,
  Plus,
  Filter,
  Calendar,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ChatConversation {
  id: string
  title: string
  model: string
  messages: ChatMessage[]
  created_at: string
  updated_at: string
  project_id?: string
  tokens_used: number
}

export default function ChatHistoryPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [filterModel, setFilterModel] = useState<string>('all')

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/ai/chat/history', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      const data = await response.json()
      setConversations(data.conversations)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/v1/ai/chat/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setConversations(conversations.filter((c) => c.id !== id))
      toast.success('Conversation deleted')
    } catch (error) {
      toast.error('Failed to delete conversation')
    }
  }

  const handlePreview = (conversation: ChatConversation) => {
    setSelectedConversation(conversation)
    setShowPreview(true)
  }

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesModel = filterModel === 'all' || conv.model === filterModel
    return matchesSearch && matchesModel
  })

  const getModelBadge = (model: string) => {
    const colors: Record<string, string> = {
      'gpt-4': 'bg-green-500/20 text-green-500',
      'claude-3-opus': 'bg-purple-500/20 text-purple-500',
      'gemini-pro': 'bg-blue-500/20 text-blue-500',
      'deepseek-chat': 'bg-orange-500/20 text-orange-500',
    }
    return <Badge className={colors[model] || 'bg-gray-500/20 text-gray-500'}>{model}</Badge>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Chat History</h1>
                <p className="text-muted-foreground">
                  View and manage your AI conversations
                </p>
              </div>
            </div>
            <Link href="/generator">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Filters */}
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
                    placeholder="Search conversations..."
                    leftIcon={<Search className="h-4 w-4" />}
                  />
                </div>
                <select
                  value={filterModel}
                  onChange={(e) => setFilterModel(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-border bg-background"
                >
                  <option value="all">All Models</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="claude-3-opus">Claude 3</option>
                  <option value="gemini-pro">Gemini Pro</option>
                  <option value="deepseek-chat">DeepSeek</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No conversations found</h3>
                <p className="text-muted-foreground mb-4">
                  Start a new AI chat to generate animations
                </p>
                <Link href="/generator">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Start Chat
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredConversations.map((conversation, index) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:border-primary/50 transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <MessageSquare className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">{conversation.title}</h3>
                              {getModelBadge(conversation.model)}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {conversation.messages[0]?.content.slice(0, 150)}...
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(conversation.updated_at)}
                              </span>
                              <span>{conversation.messages.length} messages</span>
                              <span>{conversation.tokens_used.toLocaleString()} tokens</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePreview(conversation)}
                          >
                            Preview
                          </Button>
                          <Link href={`/generator?chat=${conversation.id}`}>
                            <Button size="sm" variant="ghost">
                              Continue
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(conversation.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Preview Modal */}
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title={selectedConversation?.title || 'Chat Preview'}
          size="lg"
        >
          {selectedConversation && (
            <div className="max-h-[60vh] overflow-y-auto space-y-4">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {message.role === 'assistant' ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span className="text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      </main>
    </div>
  )
}
