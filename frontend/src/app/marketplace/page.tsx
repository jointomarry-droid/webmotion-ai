'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Download,
  Star,
  Heart,
  ExternalLink,
  Filter,
  Grid,
  List,
  Code,
  Eye,
  TrendingUp,
  Clock,
  Zap,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { formatNumber } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Component {
  id: string
  name: string
  description: string
  author: string
  author_avatar: string
  downloads: number
  rating: number
  price: number
  tags: string[]
  preview_image: string
  code_preview: string
  framework: string
  animation_type: string
  created_at: string
}

export default function MarketplacePage() {
  const [components, setComponents] = useState<Component[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFramework, setSelectedFramework] = useState<string>('all')
  const [selectedAnimationType, setSelectedAnimationType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular')

  useEffect(() => {
    fetchComponents()
  }, [selectedFramework, selectedAnimationType, sortBy])

  const fetchComponents = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        framework: selectedFramework,
        animation_type: selectedAnimationType,
        sort: sortBy,
        search: searchQuery,
      })

      const response = await fetch(`/api/v1/marketplace/components?${params}`)
      const data = await response.json()
      setComponents(data.components)
    } catch (error) {
      console.error('Failed to fetch components:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    fetchComponents()
  }

  const frameworks = [
    { value: 'all', label: 'All Frameworks' },
    { value: 'framer-motion', label: 'Framer Motion' },
    { value: 'gsap', label: 'GSAP' },
    { value: 'css', label: 'CSS Animations' },
    { value: 'three.js', label: 'Three.js' },
  ]

  const animationTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'scroll', label: 'Scroll' },
    { value: 'hover', label: 'Hover' },
    { value: 'page', label: 'Page Transitions' },
    { value: '3d', label: '3D' },
    { value: 'loading', label: 'Loading' },
  ]

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
              <h1 className="text-3xl font-bold">Component Marketplace</h1>
              <p className="text-muted-foreground">
                Discover and share animated components for your projects
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search components..."
                    leftIcon={<Search className="h-4 w-4" />}
                  />
                </div>
                <select
                  value={selectedFramework}
                  onChange={(e) => setSelectedFramework(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-border bg-background"
                >
                  {frameworks.map((fw) => (
                    <option key={fw.value} value={fw.value}>{fw.label}</option>
                  ))}
                </select>
                <select
                  value={selectedAnimationType}
                  onChange={(e) => setSelectedAnimationType(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-border bg-background"
                >
                  {animationTypes.map((at) => (
                    <option key={at.value} value={at.value}>{at.label}</option>
                  ))}
                </select>
                <Button onClick={handleSearch}>Search</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sort and View Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-between mb-6"
        >
          <Tabs defaultValue={sortBy} value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <TabsList>
              <TabsTrigger value="popular">
                <TrendingUp className="h-4 w-4 mr-1" />
                Popular
              </TabsTrigger>
              <TabsTrigger value="newest">
                <Clock className="h-4 w-4 mr-1" />
                Newest
              </TabsTrigger>
              <TabsTrigger value="rating">
                <Star className="h-4 w-4 mr-1" />
                Top Rated
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Components Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={
            viewMode === 'grid'
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted/50 rounded-t-xl" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted/50 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-muted/50 rounded w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : components.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-8 text-center">
                <Zap className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No components found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          ) : (
            components.map((component, index) => (
              <motion.div
                key={component.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:border-primary/50 transition-all cursor-pointer">
                  <div className="relative h-48 overflow-hidden rounded-t-xl bg-muted/30">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Code className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Download className="h-4 w-4 mr-1" />
                          Install
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{component.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {component.description}
                        </p>
                      </div>
                      {component.price > 0 ? (
                        <Badge variant="secondary">${component.price}</Badge>
                      ) : (
                        <Badge variant="success">Free</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {formatNumber(component.downloads)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        {component.rating.toFixed(1)}
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        {component.framework}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </main>
    </div>
  )
}
