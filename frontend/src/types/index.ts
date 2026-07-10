// User Types
export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  subscription_tier: SubscriptionTier
  ai_credits: number
  lifetime_deal?: boolean
  created_at: string
  updated_at: string
}

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'team' | 'enterprise'

export interface Subscription {
  id: string
  user_id: string
  tier: SubscriptionTier
  status: 'active' | 'canceled' | 'past_due'
  current_period_start: string
  current_period_end: string
  cancel_at: string | null
}

// Template Types
export interface Template {
  id: string
  creator_id?: string | null
  title: string
  description: string | null
  category: TemplateCategory
  subcategory?: string | null
  prompt_content: string
  code_output?: string | null
  framework?: string
  preview_image?: string | null
  preview_video?: string | null
  tags: string[]
  is_premium: boolean
  price: number
  downloads: number
  rating: number
  rating_count: number
  status: TemplateStatus
  created_at: string
  updated_at: string
  creator?: User
}

export type TemplateCategory = 
  | 'hero' 
  | 'landing' 
  | 'animation' 
  | 'background' 
  | 'component' 
  | 'page'
  | 'transitions'
  | 'hover'
  | 'scroll'
  | 'entrance'
  | 'interactive'
  | '3d'
  | 'loading'
  | 'navigation'
  | 'ecommerce'
  | 'dashboard'
  | 'blog'
  | 'portfolio'
  | 'orchestration'
  | 'physics'
  | 'text'
  | 'svg'
  | 'cursor'
  | 'layout'
  | 'effect'
  | 'gradient'
  | string

export type TemplateStatus = 'draft' | 'pending' | 'approved' | 'rejected'

export interface TemplateFilters {
  category?: TemplateCategory
  search?: string
  is_premium?: boolean
  sort_by?: 'newest' | 'popular' | 'rating' | 'downloads'
  page?: number
  limit?: number
}

// Project Types
export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  template_id: string | null
  generated_code: string | null
  deployment_url: string | null
  deployment_status: DeploymentStatus
  settings: ProjectSettings
  created_at: string
  updated_at: string
  template?: Template
}

export type DeploymentStatus = 'draft' | 'building' | 'deploying' | 'success' | 'failed'

export interface ProjectSettings {
  theme?: 'light' | 'dark' | 'system'
  primary_color?: string
  font_family?: string
  [key: string]: any
}

// AI Types
export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  model?: string
  tokens?: number
}

export interface AIChat {
  id: string
  user_id: string
  project_id: string | null
  messages: AIMessage[]
  model_used: string
  tokens_input: number
  tokens_output: number
  cost_usd: number
  created_at: string
}

export type AIModel = 
  | 'gpt-4' 
  | 'gpt-4-turbo' 
  | 'claude-3-opus' 
  | 'claude-3-sonnet' 
  | 'gemini-pro'
  | 'deepseek-chat'

export interface AIGenerationRequest {
  prompt: string
  model?: AIModel
  context?: string
  max_tokens?: number
  temperature?: number
}

export interface AIGenerationResponse {
  content: string
  model: AIModel
  tokens_used: number
  cost_usd: number
  suggestions?: string[]
}

// Animation Types
export interface AnimationPrompt {
  id: string
  name: string
  description: string
  framework: AnimationFramework
  code: string
  preview_url?: string
  tags: string[]
}

export type AnimationFramework = 'framer-motion' | 'gsap' | 'css' | 'threejs'

export interface AnimationConfig {
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'parallax' | 'scroll'
  duration: number
  delay?: number
  easing?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  trigger?: 'mount' | 'scroll' | 'hover' | 'click'
}

// Deployment Types
export interface Deployment {
  id: string
  project_id: string
  provider: 'vercel' | 'github' | 'netlify'
  repository_url: string | null
  deployment_url: string | null
  status: DeploymentStatus
  logs: string | null
  created_at: string
  updated_at: string
}

// Billing Types
export interface PricingPlan {
  id: string
  name: string
  description: string
  price_monthly: number
  price_yearly: number
  features: string[]
  ai_credits: number
  is_popular?: boolean
}

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  currency: string
  stripe_payment_id: string | null
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  metadata: Record<string, any>
  created_at: string
}

export type TransactionType = 
  | 'subscription' 
  | 'credit_purchase' 
  | 'template_purchase' 
  | 'refund'

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  has_more: boolean
}
