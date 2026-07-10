'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Search, Copy, Check, Sparkles, Wand2, Layout, Type, Code, Star, Clock,
  Grid, List, Play, Eye, X, ExternalLink, Download, Crown
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'
import { PROMPT_CATEGORIES, PROMPT_LIBRARY, PromptTemplate } from '@/data/prompts'

export default function PromptsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate | null>(null)
  const [showDemo, setShowDemo] = useState<string | null>(null)

  const filteredPrompts = PROMPT_LIBRARY.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCopy = (prompt: PromptTemplate) => {
    copyToClipboard(prompt.code)
    setCopiedId(prompt.id)
    toast.success('Code copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hero': return '🎯'
      case 'animation': return '✨'
      case 'effects': return '🎨'
      case 'portfolio': return '💼'
      case 'typography': return '📝'
      case 'components': return '🧩'
      default: return '⭐'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Prompt Library</h1>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  {PROMPT_LIBRARY.length} Prompts
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                Curated animation prompts with live previews and copy-ready code
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 space-y-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts by title, description, or tags..."
            leftIcon={<Search className="h-4 w-4" />}
          />

          <div className="flex gap-2 flex-wrap">
            {PROMPT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {cat.id === 'all' ? '🎯' : getCategoryIcon(cat.id)}
                {cat.name}
                <span className="text-xs opacity-70">({cat.count})</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Prompts', value: PROMPT_LIBRARY.length, icon: Sparkles },
            { label: 'Premium', value: PROMPT_LIBRARY.filter(p => p.isPremium).length, icon: Crown },
            { label: 'Frameworks', value: [...new Set(PROMPT_LIBRARY.map(p => p.framework))].length, icon: Code },
            { label: 'Categories', value: PROMPT_CATEGORIES.length - 1, icon: Layout },
          ].map((stat) => (
            <div key={stat.label} className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <stat.icon className="h-4 w-4" />
                {stat.label}
              </div>
              <div className="text-2xl font-bold mt-1">{stat.value}</div>
            </div>
          ))}
        </motion.div>

        {/* Prompts Grid */}
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredPrompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all overflow-hidden group">
                {/* Preview Image/GIF */}
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                  {prompt.previewGif ? (
                    <img
                      src={prompt.previewGif}
                      alt={prompt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-6xl">{getCategoryIcon(prompt.category)}</span>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {prompt.isPremium && (
                      <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        Premium
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getDifficultyColor(prompt.difficulty)}`}>
                      {prompt.difficulty}
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setSelectedPrompt(prompt)}
                      className="p-2 bg-background/80 backdrop-blur rounded-lg hover:bg-background transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(prompt)}
                      className="p-2 bg-background/80 backdrop-blur rounded-lg hover:bg-background transition-colors"
                    >
                      {copiedId === prompt.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Category Label */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 bg-background/80 backdrop-blur text-sm font-medium rounded-lg capitalize">
                      {prompt.category}
                    </span>
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">{prompt.framework}</Badge>
                    {prompt.price ? (
                      <span className="text-sm font-bold text-primary">${prompt.price}</span>
                    ) : (
                      <span className="text-sm font-bold text-green-500">Free</span>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{prompt.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{prompt.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {prompt.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                    {prompt.tags.length > 4 && (
                      <Badge variant="outline" className="text-xs">+{prompt.tags.length - 4}</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {prompt.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {prompt.uses.toLocaleString()} uses
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleCopy(prompt)}>
                      {copiedId === prompt.id ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      Copy Code
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => setSelectedPrompt(prompt)}>
                      <Wand2 className="h-4 w-4 mr-1" />
                      View Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-xl font-medium">No prompts found</p>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      {/* Code Detail Modal */}
      <AnimatePresence>
        {selectedPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setSelectedPrompt(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {selectedPrompt.previewGif && (
                      <img
                        src={selectedPrompt.previewGif}
                        alt={selectedPrompt.title}
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h2 className="text-xl font-bold">{selectedPrompt.title}</h2>
                      <p className="text-muted-foreground mt-1">{selectedPrompt.description}</p>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="secondary">{selectedPrompt.framework}</Badge>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(selectedPrompt.difficulty)}`}>
                          {selectedPrompt.difficulty}
                        </span>
                        {selectedPrompt.isPremium && (
                          <Badge className="bg-amber-500 text-white">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedPrompt(null)} className="p-2 hover:bg-muted rounded-lg">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Code */}
              <div className="flex-1 overflow-auto p-6">
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-100 font-mono whitespace-pre-wrap">{selectedPrompt.code}</pre>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t flex gap-3">
                <Button onClick={() => handleCopy(selectedPrompt)} className="flex-1">
                  {copiedId === selectedPrompt.id ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy Code
                </Button>
                <Link href={`/generator?prompt=${encodeURIComponent(selectedPrompt.prompt)}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Use in Generator
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
