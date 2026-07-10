'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSend,
  isLoading = false,
  disabled = false,
  placeholder = 'Describe the animation you want to create...',
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (!message.trim() || isLoading || disabled) return
    onSend(message.trim())
    setMessage('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestions = [
    'Create a scroll-triggered hero section',
    'Build an animated pricing table',
    'Add parallax effect to background',
    'Create a typing animation for text',
  ]

  return (
    <div className="space-y-4">
      {/* Suggestions */}
      {message.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setMessage(suggestion)}
              className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
            >
              <Sparkles className="h-3 w-3 inline-block mr-1 text-primary" />
              {suggestion}
            </button>
          ))}
        </motion.div>
      )}

      {/* Input Area */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          placeholder={placeholder}
          rows={3}
          className={cn(
            'w-full px-4 py-3 pr-12 rounded-xl border border-input bg-background',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-none'
          )}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!message.trim() || isLoading || disabled}
          className="absolute right-2 bottom-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}
