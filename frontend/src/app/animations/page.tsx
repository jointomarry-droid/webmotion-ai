'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Play,
  Copy,
  Download,
  Heart,
  Filter,
  Sparkles,
  Zap,
  Layers,
  ArrowUpRight,
  Box,
  RotateCw,
  Eye,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Animation {
  id: string
  name: string
  description: string
  category: string
  framework: string
  code: string
  preview_url: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  uses: number
}

const ANIMATIONS: Animation[] = [
  {
    id: '1',
    name: 'Fade In Up',
    description: 'Elements fade in and slide up from below',
    category: 'entrance',
    framework: 'css',
    code: `@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}`,
    preview_url: '',
    tags: ['fade', 'slide', 'entrance'],
    difficulty: 'beginner',
    uses: 12500,
  },
  {
    id: '2',
    name: 'Bounce',
    description: 'Bouncing animation for attention-grabbing elements',
    category: 'emphasis',
    framework: 'css',
    code: `@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.bounce {
  animation: bounce 0.6s ease-in-out infinite;
}`,
    preview_url: '',
    tags: ['bounce', 'emphasis', 'loop'],
    difficulty: 'beginner',
    uses: 8900,
  },
  {
    id: '3',
    name: 'Pulse',
    description: 'Pulsing effect for notifications and alerts',
    category: 'emphasis',
    framework: 'css',
    code: `@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}`,
    preview_url: '',
    tags: ['pulse', 'scale', 'attention'],
    difficulty: 'beginner',
    uses: 7200,
  },
  {
    id: '4',
    name: 'Spin',
    description: 'Continuous rotation for loading indicators',
    category: 'loading',
    framework: 'css',
    code: `@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 1s linear infinite;
}`,
    preview_url: '',
    tags: ['spin', 'loading', 'rotation'],
    difficulty: 'beginner',
    uses: 15600,
  },
  {
    id: '5',
    name: 'Shake',
    description: 'Horizontal shake for error feedback',
    category: 'emphasis',
    framework: 'css',
    code: `@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

.shake {
  animation: shake 0.5s ease-in-out;
}`,
    preview_url: '',
    tags: ['shake', 'error', 'feedback'],
    difficulty: 'beginner',
    uses: 5400,
  },
  {
    id: '6',
    name: 'Gradient Background',
    description: 'Animated gradient background',
    category: 'background',
    framework: 'css',
    code: `@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.gradient-bg {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
}`,
    preview_url: '',
    tags: ['gradient', 'background', 'color'],
    difficulty: 'intermediate',
    uses: 9800,
  },
  {
    id: '7',
    name: 'Float',
    description: 'Gentle floating animation for decorative elements',
    category: 'emphasis',
    framework: 'css',
    code: `@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.float {
  animation: float 3s ease-in-out infinite;
}`,
    preview_url: '',
    tags: ['float', 'gentle', 'decorative'],
    difficulty: 'beginner',
    uses: 6700,
  },
  {
    id: '8',
    name: 'Typewriter',
    description: 'Typewriter effect for text reveal',
    category: 'text',
    framework: 'css',
    code: `@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}

.typewriter {
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid;
  animation: typewriter 3s steps(40) 1s forwards,
             blink 0.75s step-end infinite;
  width: 0;
}`,
    preview_url: '',
    tags: ['typewriter', 'text', 'reveal'],
    difficulty: 'intermediate',
    uses: 11200,
  },
  {
    id: '9',
    name: '3D Card Flip',
    description: '3D card flip animation on hover',
    category: '3d',
    framework: 'css',
    code: `.card-container {
  perspective: 1000px;
}

.card {
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  transition: transform 0.8s;
}

.card:hover {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 1.5rem;
  color: white;
}

.card-front {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-back {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  transform: rotateY(180deg);
}`,
    preview_url: '',
    tags: ['3d', 'flip', 'card', 'hover'],
    difficulty: 'advanced',
    uses: 8400,
  },
  {
    id: '10',
    name: 'Stagger Children',
    description: 'Staggered animation for list items',
    category: 'entrance',
    framework: 'css',
    code: `@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stagger-item {
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
}

.stagger-item:nth-child(1) { animation-delay: 0.1s; }
.stagger-item:nth-child(2) { animation-delay: 0.2s; }
.stagger-item:nth-child(3) { animation-delay: 0.3s; }
.stagger-item:nth-child(4) { animation-delay: 0.4s; }
.stagger-item:nth-child(5) { animation-delay: 0.5s; }`,
    preview_url: '',
    tags: ['stagger', 'list', 'children', 'sequence'],
    difficulty: 'intermediate',
    uses: 7800,
  },
]

export default function AnimationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedFramework, setSelectedFramework] = useState('all')
  const [favorites, setFavorites] = useState<string[]>([])

  const categories = [
    { value: 'all', label: 'All', icon: Layers },
    { value: 'entrance', label: 'Entrance', icon: ArrowUpRight },
    { value: 'emphasis', label: 'Emphasis', icon: Zap },
    { value: 'background', label: 'Background', icon: Box },
    { value: 'loading', label: 'Loading', icon: RotateCw },
    { value: 'text', label: 'Text', icon: Sparkles },
    { value: '3d', label: '3D', icon: Eye },
  ]

  const filteredAnimations = ANIMATIONS.filter((anim) => {
    const matchesSearch = anim.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anim.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || anim.category === selectedCategory
    const matchesFramework = selectedFramework === 'all' || anim.framework === selectedFramework
    return matchesSearch && matchesCategory && matchesFramework
  })

  const handleCopyCode = (code: string) => {
    copyToClipboard(code)
    toast.success('Code copied!')
  }

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/20 text-green-500'
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-500'
      case 'advanced':
        return 'bg-red-500/20 text-red-500'
      default:
        return 'bg-gray-500/20 text-gray-500'
    }
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
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Animation Library</h1>
              <p className="text-muted-foreground">
                Browse and copy pre-built CSS animations for your projects
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
                    placeholder="Search animations..."
                    leftIcon={<Search className="h-4 w-4" />}
                  />
                </div>
                <select
                  value={selectedFramework}
                  onChange={(e) => setSelectedFramework(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-border bg-background"
                >
                  <option value="all">All Frameworks</option>
                  <option value="css">CSS</option>
                  <option value="gsap">GSAP</option>
                  <option value="framer-motion">Framer Motion</option>
                </select>
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
                <cat.icon className="h-4 w-4 mr-1" />
                {cat.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Animations Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAnimations.map((animation, index) => (
            <motion.div
              key={animation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:border-primary/50 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{animation.name}</CardTitle>
                        <Badge className={getDifficultyColor(animation.difficulty)}>
                          {animation.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {animation.description}
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleFavorite(animation.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          favorites.includes(animation.id)
                            ? 'fill-red-500 text-red-500'
                            : ''
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Preview */}
                  <div className="h-32 mb-4 rounded-lg bg-muted/30 flex items-center justify-center overflow-hidden">
                    <div className="text-center">
                      <Play className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Click to preview</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {animation.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {animation.uses.toLocaleString()} uses
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyCode(animation.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Link href={`/playground?template=${animation.id}`}>
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          Try It
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}
