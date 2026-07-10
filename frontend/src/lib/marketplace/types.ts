export interface MarketplaceTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  framework: AnimationFramework
  price: number // 0 = free
  preview: string // GIF or image URL
  code: string
  author: {
    name: string
    avatar: string
  }
  stats: {
    downloads: number
    rating: number
    reviews: number
  }
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type TemplateCategory =
  | 'hero-sections'
  | 'pricing-tables'
  | 'feature-grids'
  | 'testimonials'
  | 'call-to-action'
  | 'navigation'
  | 'footers'
  | 'gallery'
  | 'animations'
  | 'full-pages'

export type AnimationFramework = 'framer-motion' | 'gsap' | 'css' | 'threejs'

export interface MarketplaceFilter {
  category?: TemplateCategory
  framework?: AnimationFramework
  price?: 'free' | 'paid' | 'all'
  sort?: 'popular' | 'newest' | 'rating' | 'price-low' | 'price-high'
  search?: string
}

export interface MarketplacePurchase {
  id: string
  templateId: string
  userId: string
  amount: number
  createdAt: string
}
