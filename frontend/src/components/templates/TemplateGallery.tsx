'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { TemplateCard } from './TemplateCard'
import { TemplateFilters } from './TemplateFilters'
import { Button } from '@/components/ui/Button'
import { Template, TemplateCategory } from '@/types'

// Sample templates for when API is unavailable
const sampleTemplates: Template[] = [
  {
    id: '1',
    title: 'Smooth Fade In',
    description: 'Elegant fade-in animation with slight upward movement',
    category: 'transitions',
    prompt_content: 'Create a smooth fade-in animation with 0.5s duration and 20px upward movement',
    code_output: `import { motion } from 'framer-motion'\n\nexport function FadeIn({ children }) {\n  return (\n    <motion.div\n      initial={{ opacity: 0, y: 20 }}\n      animate={{ opacity: 1, y: 0 }}\n      transition={{ duration: 0.5, ease: 'easeOut' }}\n    >\n      {children}\n    </motion.div>\n  )\n}`,
    tags: ['fade', 'entrance', 'subtle'],
    is_premium: false,
    price: 0,
    downloads: 1247,
    rating: 4.8,
    rating_count: 89,
    status: 'approved',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Bounce Hover Effect',
    description: 'Playful bounce animation on hover with spring physics',
    category: 'hover',
    prompt_content: 'Add a bounce effect on hover using spring physics with 0.3 stiffness',
    code_output: `import { motion } from 'framer-motion'\n\nexport function BounceHover({ children }) {\n  return (\n    <motion.div\n      whileHover={{ scale: 1.05, y: -5 }}\n      transition={{ type: 'spring', stiffness: 300, damping: 20 }}\n    >\n      {children}\n    </motion.div>\n  )\n}`,
    tags: ['bounce', 'hover', 'interactive'],
    is_premium: false,
    price: 0,
    downloads: 892,
    rating: 4.6,
    rating_count: 67,
    status: 'approved',
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z',
  },
  {
    id: '3',
    title: 'Parallax Scroll',
    description: 'Smooth parallax scrolling effect for hero sections',
    category: 'scroll',
    prompt_content: 'Create a parallax scrolling effect where background moves slower than foreground',
    code_output: `import { useScroll, useTransform, motion } from 'framer-motion'\n\nexport function ParallaxHero() {\n  const { scrollY } = useScroll()\n  const y = useTransform(scrollY, [0, 500], [0, 150])\n\n  return (\n    <motion.div style={{ y }} className="h-screen">\n      <h1>Parallax Content</h1>\n    </motion.div>\n  )\n}`,
    tags: ['parallax', 'scroll', 'hero'],
    is_premium: true,
    price: 9.99,
    downloads: 2341,
    rating: 4.9,
    rating_count: 156,
    status: 'approved',
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z',
  },
  {
    id: '4',
    title: 'Stagger Children',
    description: 'Animate multiple elements with staggered delays',
    category: 'orchestration',
    prompt_content: 'Stagger the animation of child elements with 0.1s delay between each',
    code_output: `import { motion } from 'framer-motion'\n\nconst container = {\n  hidden: { opacity: 0 },\n  show: {\n    opacity: 1,\n    transition: { staggerChildren: 0.1 }\n  }\n}\n\nconst item = {\n  hidden: { opacity: 0, y: 20 },\n  show: { opacity: 1, y: 0 }\n}\n\nexport function StaggerList({ items }) {\n  return (\n    <motion.div variants={container} initial="hidden" animate="show">\n      {items.map((item, i) => (\n        <motion.div key={i} variants={item}>{item}</motion.div>\n      ))}\n    </motion.div>\n  )\n}`,
    tags: ['stagger', 'list', 'orchestration'],
    is_premium: false,
    price: 0,
    downloads: 1567,
    rating: 4.7,
    rating_count: 112,
    status: 'approved',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
  },
  {
    id: '5',
    title: 'Morphing Shape',
    description: 'Smooth shape morphing animation with path transitions',
    category: 'shapes',
    prompt_content: 'Create a shape that morphs between circle and square with smooth transition',
    code_output: `import { motion } from 'framer-motion'\n\nexport function MorphingShape() {\n  return (\n    <motion.div\n      animate={{\n        borderRadius: ['0%', '50%', '0%'],\n        rotate: [0, 180, 360]\n      }}\n      transition={{ duration: 2, repeat: Infinity }}\n      className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500"\n    />\n  )\n}`,
    tags: ['morph', 'shape', 'creative'],
    is_premium: true,
    price: 14.99,
    downloads: 756,
    rating: 4.5,
    rating_count: 45,
    status: 'approved',
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T10:00:00Z',
  },
  {
    id: '6',
    title: 'Text Typewriter',
    description: 'Classic typewriter effect for text reveal',
    category: 'text',
    prompt_content: 'Create a typewriter effect that reveals text character by character',
    code_output: `import { motion, useAnimation } from 'framer-motion'\nimport { useEffect } from 'react'\n\nexport function Typewriter({ text }) {\n  const controls = useAnimation()\n\n  useEffect(() => {\n    controls.start({\n      width: '100%',\n      transition: { duration: text.length * 0.05 }\n    })\n  }, [text])\n\n  return (\n    <motion.div\n      animate={controls}\n      className="overflow-hidden whitespace-nowrap"\n      style={{ width: 0 }}\n    >\n      {text}\n    </motion.div>\n  )\n}`,
    tags: ['typewriter', 'text', 'reveal'],
    is_premium: false,
    price: 0,
    downloads: 2103,
    rating: 4.8,
    rating_count: 178,
    status: 'approved',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: '7',
    title: 'GSAP ScrollTrigger',
    description: 'Powerful scroll-triggered animations with GSAP',
    category: 'scroll',
    prompt_content: 'Use GSAP ScrollTrigger to animate elements as they enter the viewport',
    code_output: `import { useEffect, useRef } from 'react'\nimport gsap from 'gsap'\nimport { ScrollTrigger } from 'gsap/ScrollTrigger'\n\ngsap.registerPlugin(ScrollTrigger)\n\nexport function ScrollReveal() {\n  const ref = useRef(null)\n\n  useEffect(() => {\n    gsap.from(ref.current, {\n      y: 100,\n      opacity: 0,\n      duration: 1,\n      scrollTrigger: {\n        trigger: ref.current,\n        start: 'top 80%'\n      }\n    })\n  }, [])\n\n  return <div ref={ref}>Reveal on scroll</div>\n}`,
    tags: ['gsap', 'scroll', 'scrolltrigger'],
    is_premium: true,
    price: 19.99,
    downloads: 1834,
    rating: 4.9,
    rating_count: 201,
    status: 'approved',
    created_at: '2024-01-09T10:00:00Z',
    updated_at: '2024-01-09T10:00:00Z',
  },
  {
    id: '8',
    title: '3D Card Flip',
    description: 'Interactive 3D card flip animation on hover',
    category: 'hover',
    prompt_content: 'Create a 3D card flip effect that shows back content on hover',
    code_output: `import { motion } from 'framer-motion'\n\nexport function CardFlip({ front, back }) {\n  return (\n    <motion.div\n      className="relative w-64 h-96 cursor-pointer"\n      style={{ perspective: 1000 }}\n    >\n      <motion.div\n        className="absolute inset-0"\n        style={{ transformStyle: 'preserve-3d' }}\n        whileHover={{ rotateY: 180 }}\n        transition={{ duration: 0.6 }}\n      >\n        <div className="absolute inset-0 backface-hidden">{front}</div>\n        <div className="absolute inset-0 backface-hidden rotate-y-180">{back}</div>\n      </motion.div>\n    </motion.div>\n  )\n}`,
    tags: ['3d', 'card', 'flip'],
    is_premium: false,
    price: 0,
    downloads: 1123,
    rating: 4.6,
    rating_count: 89,
    status: 'approved',
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z',
  },
  {
    id: '9',
    title: 'Loading Spinner',
    description: 'Beautiful animated loading spinner with gradient',
    category: 'loaders',
    prompt_content: 'Create an elegant loading spinner with rotating gradient effect',
    code_output: `import { motion } from 'framer-motion'\n\nexport function LoadingSpinner({ size = 40 }) {\n  return (\n    <motion.div\n      className="rounded-full border-4 border-primary/20 border-t-primary"\n      style={{ width: size, height: size }}\n      animate={{ rotate: 360 }}\n      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}\n    />\n  )\n}`,
    tags: ['loader', 'spinner', 'loading'],
    is_premium: false,
    price: 0,
    downloads: 3201,
    rating: 4.7,
    rating_count: 234,
    status: 'approved',
    created_at: '2024-01-07T10:00:00Z',
    updated_at: '2024-01-07T10:00:00Z',
  },
]

interface TemplateGalleryProps {
  initialTemplates?: Template[]
}

export function TemplateGallery({ initialTemplates = [] }: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<TemplateCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState('newest')

  const fetchTemplates = async (reset = false) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category !== 'all') params.set('category', category)
      params.set('sort_by', sortBy)
      params.set('page', reset ? '1' : String(page))
      params.set('limit', '12')

      const response = await fetch(`/api/v1/templates?${params}`)
      const data = await response.json()

      if (reset) {
        setTemplates(data.templates)
        setPage(1)
      } else {
        setTemplates((prev) => [...prev, ...data.templates])
      }
      setHasMore(data.has_more)
    } catch (error) {
      // Use sample templates when API is unavailable
      console.log('Using sample templates')
      if (initialTemplates.length > 0) {
        setTemplates(initialTemplates)
      } else {
        // Filter sample templates based on current filters
        let filtered = [...sampleTemplates]
        
        if (search) {
          const searchLower = search.toLowerCase()
          filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(searchLower) ||
            t.description?.toLowerCase().includes(searchLower) ||
            t.tags.some(tag => tag.toLowerCase().includes(searchLower))
          )
        }
        
        if (category !== 'all') {
          filtered = filtered.filter(t => t.category === category)
        }
        
        // Sort
        if (sortBy === 'popular') {
          filtered.sort((a, b) => b.downloads - a.downloads)
        } else if (sortBy === 'rating') {
          filtered.sort((a, b) => b.rating - a.rating)
        } else if (sortBy === 'newest') {
          filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        }
        
        setTemplates(filtered)
      }
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates(true)
  }, [search, category, sortBy])

  const handleLoadMore = () => {
    setPage((prev) => prev + 1)
    fetchTemplates(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Animation Templates
          </h2>
          <p className="text-muted-foreground mt-1">
            Browse and copy production-ready animation prompts
          </p>
        </div>
      </div>

      {/* Filters */}
      <TemplateFilters
        onSearch={setSearch}
        onCategoryChange={setCategory}
        onSortChange={setSortBy}
        selectedCategory={category}
        selectedSort={sortBy}
      />

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {templates.map((template, index) => (
            <TemplateCard key={template.id} template={template} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {!isLoading && templates.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Load More */}
      {!isLoading && hasMore && templates.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            isLoading={isLoading}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
