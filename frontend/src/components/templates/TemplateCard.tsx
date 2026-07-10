'use client'

import { motion } from 'framer-motion'
import { Download, Star, Copy, Eye, Heart } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn, formatNumber, copyToClipboard } from '@/lib/utils'
import { Template } from '@/types'
import toast from 'react-hot-toast'

interface TemplateCardProps {
  template: Template
  index?: number
}

export function TemplateCard({ template, index = 0 }: TemplateCardProps) {
  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await copyToClipboard(template.prompt_content)
    toast.success('Prompt copied to clipboard!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/templates/${template.id}`}>
        <Card hover className="group overflow-hidden">
          {/* Preview Image */}
          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10">
            {template.preview_image ? (
              <img
                src={template.preview_image}
                alt={template.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Preview</p>
                </div>
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              <Button
                size="sm"
                onClick={handleCopyPrompt}
                leftIcon={<Copy className="h-4 w-4" />}
              >
                Copy Prompt
              </Button>
            </div>

            {/* Premium badge */}
            {template.is_premium && (
              <div className="absolute top-3 right-3">
                <Badge variant="warning">Premium</Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {template.title}
              </h3>
              <button className="p-1 rounded-lg hover:bg-muted transition-colors">
                <Heart className="h-4 w-4" />
              </button>
            </div>

            {template.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {template.description}
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              <Badge variant="secondary">{template.category}</Badge>
              {template.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{formatNumber(template.downloads)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span>{template.rating.toFixed(1)}</span>
              </div>
              {template.is_premium && (
                <div className="ml-auto font-semibold text-primary">
                  ${template.price}
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
