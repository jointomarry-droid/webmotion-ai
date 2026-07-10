'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Lightbulb,
  Plus,
  Layout,
  Type,
  CreditCard,
  MessageSquare,
  HelpCircle,
  BarChart3,
  Mail,
  Navigation,
  ArrowRight,
} from 'lucide-react'

interface Component {
  id: string
  type: string
  name: string
  props: Record<string, any>
  styles: Record<string, string>
  visible: boolean
  locked: boolean
  children?: Component[]
}

interface AISuggestionsProps {
  currentSections: Component[]
  onAddSection: (type: string) => void
}

interface Suggestion {
  type: string
  name: string
  icon: any
  reason: string
  priority: 'high' | 'medium' | 'low'
}

const SECTION_ICONS: Record<string, any> = {
  hero: Layout,
  features: Type,
  pricing: CreditCard,
  testimonials: MessageSquare,
  faq: HelpCircle,
  stats: BarChart3,
  newsletter: Mail,
  navbar: Navigation,
  cta: ArrowRight,
  footer: Layout,
  contact: MessageSquare,
}

function analyzeLayout(sections: Component[]): Suggestion[] {
  const existingTypes = new Set(sections.map((s) => s.type))
  const suggestions: Suggestion[] = []

  // High priority suggestions based on what's missing
  if (!existingTypes.has('hero')) {
    suggestions.push({
      type: 'hero',
      name: 'Hero Section',
      icon: Layout,
      reason: 'Every page needs a strong hero section to capture attention',
      priority: 'high',
    })
  }

  if (!existingTypes.has('features') && sections.length > 0) {
    suggestions.push({
      type: 'features',
      name: 'Features Grid',
      icon: Type,
      reason: 'Showcase your product benefits with a features section',
      priority: 'high',
    })
  }

  if (!existingTypes.has('cta') && sections.length > 1) {
    suggestions.push({
      type: 'cta',
      name: 'Call to Action',
      icon: ArrowRight,
      reason: 'Convert visitors with a compelling call-to-action',
      priority: 'high',
    })
  }

  if (!existingTypes.has('footer')) {
    suggestions.push({
      type: 'footer',
      name: 'Footer',
      icon: Layout,
      reason: 'Complete your page with navigation and legal links',
      priority: 'high',
    })
  }

  // Medium priority suggestions
  if (!existingTypes.has('testimonials') && sections.length > 2) {
    suggestions.push({
      type: 'testimonials',
      name: 'Testimonials',
      icon: MessageSquare,
      reason: 'Build trust with social proof from happy customers',
      priority: 'medium',
    })
  }

  if (!existingTypes.has('pricing') && sections.length > 2) {
    suggestions.push({
      type: 'pricing',
      name: 'Pricing Table',
      icon: CreditCard,
      reason: 'Display your pricing plans clearly',
      priority: 'medium',
    })
  }

  if (!existingTypes.has('faq') && sections.length > 3) {
    suggestions.push({
      type: 'faq',
      name: 'FAQ Section',
      icon: HelpCircle,
      reason: 'Answer common questions to reduce support tickets',
      priority: 'medium',
    })
  }

  if (!existingTypes.has('stats') && sections.length > 2) {
    suggestions.push({
      type: 'stats',
      name: 'Stats / Numbers',
      icon: BarChart3,
      reason: 'Showcase key metrics and achievements',
      priority: 'medium',
    })
  }

  if (!existingTypes.has('newsletter') && sections.length > 3) {
    suggestions.push({
      type: 'newsletter',
      name: 'Newsletter Signup',
      icon: Mail,
      reason: 'Capture leads with email subscriptions',
      priority: 'medium',
    })
  }

  if (!existingTypes.has('contact') && sections.length > 3) {
    suggestions.push({
      type: 'contact',
      name: 'Contact Form',
      icon: MessageSquare,
      reason: 'Let visitors get in touch easily',
      priority: 'medium',
    })
  }

  if (!existingTypes.has('navbar')) {
    suggestions.push({
      type: 'navbar',
      name: 'Navigation Bar',
      icon: Navigation,
      reason: 'Help visitors navigate your site',
      priority: 'medium',
    })
  }

  // Sort by priority
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

export function AISuggestions({ currentSections, onAddSection }: AISuggestionsProps) {
  const suggestions = useMemo(() => analyzeLayout(currentSections), [currentSections])

  if (suggestions.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Your layout looks complete!</p>
        <p className="text-xs mt-1">Try adjusting styles or adding content</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        <h3 className="text-sm font-semibold">Suggested Next Steps</h3>
      </div>

      <div className="space-y-2">
        {suggestions.slice(0, 6).map((suggestion) => (
          <motion.button
            key={suggestion.type}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => onAddSection(suggestion.type)}
            className="w-full flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
              <suggestion.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{suggestion.name}</span>
                {suggestion.priority === 'high' && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 rounded">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{suggestion.reason}</p>
            </div>
            <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
          </motion.button>
        ))}
      </div>

      {suggestions.length > 6 && (
        <p className="text-xs text-muted-foreground text-center pt-2">
          +{suggestions.length - 6} more suggestions
        </p>
      )}
    </div>
  )
}
