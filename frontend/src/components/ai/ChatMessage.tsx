'use client'

import { motion } from 'framer-motion'
import { Copy, Check, Bot, User } from 'lucide-react'
import { useState } from 'react'
import { cn, copyToClipboard } from '@/lib/utils'
import { AIMessage } from '@/types'
import toast from 'react-hot-toast'

interface ChatMessageProps {
  message: AIMessage
  index?: number
}

export function ChatMessage({ message, index = 0 }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    await copyToClipboard(message.content)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'flex gap-3 p-4 rounded-xl',
        isUser ? 'bg-primary/10' : 'bg-muted/50'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          {message.model && (
            <span className="text-xs text-muted-foreground">
              ({message.model})
            </span>
          )}
        </div>
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>
      </div>

      {/* Copy Button */}
      {!isUser && (
        <button
          onClick={handleCopy}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-background transition-colors"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      )}
    </motion.div>
  )
}
