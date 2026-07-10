'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { TemplateCategory } from '@/types'
import { cn } from '@/lib/utils'

interface TemplateFiltersProps {
  onSearch: (search: string) => void
  onCategoryChange: (category: TemplateCategory | 'all') => void
  onSortChange: (sort: string) => void
  selectedCategory: TemplateCategory | 'all'
  selectedSort: string
}

const categories: { value: TemplateCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'hero', label: 'Hero' },
  { value: 'landing', label: 'Landing' },
  { value: 'animation', label: 'Animation' },
  { value: 'background', label: 'Background' },
  { value: 'component', label: 'Component' },
  { value: 'page', label: 'Page' },
]

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'downloads', label: 'Most Downloaded' },
]

export function TemplateFilters({
  onSearch,
  onCategoryChange,
  onSortChange,
  selectedCategory,
  selectedSort,
}: TemplateFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          leftIcon={<SlidersHorizontal className="h-4 w-4" />}
        >
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl border border-border bg-card space-y-4">
              {/* Categories */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Badge
                      key={cat.value}
                      variant={selectedCategory === cat.value ? 'default' : 'outline'}
                      className={cn(
                        'cursor-pointer transition-all',
                        selectedCategory === cat.value && 'ring-2 ring-primary'
                      )}
                      onClick={() => onCategoryChange(cat.value)}
                    >
                      {cat.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sort by</label>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant={selectedSort === option.value ? 'default' : 'outline'}
                      className={cn(
                        'cursor-pointer transition-all',
                        selectedSort === option.value && 'ring-2 ring-primary'
                      )}
                      onClick={() => onSortChange(option.value)}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters */}
      {(selectedCategory !== 'all' || searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {categories.find((c) => c.value === selectedCategory)?.label}
              <button onClick={() => onCategoryChange('all')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              "{searchQuery}"
              <button onClick={() => handleSearch('')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
