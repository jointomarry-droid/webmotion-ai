import { MarketplaceTemplate } from './types'

export const marketplaceTemplates: MarketplaceTemplate[] = [
  {
    id: 'hero-parallax-1',
    name: 'Parallax Hero Section',
    description: 'A stunning hero section with parallax scroll effects, gradient backgrounds, and floating elements.',
    category: 'hero-sections',
    framework: 'framer-motion',
    price: 0,
    preview: '/templates/hero-parallax.gif',
    code: `'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function ParallaxHero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
        style={{ scale }}
      />
      
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
        >
          Build something{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            amazing
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto"
        >
          Create beautiful, animated websites with the power of AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg shadow-xl shadow-white/20"
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold text-lg"
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}`,
    author: { name: 'WebMotion', avatar: '/avatars/webmotion.png' },
    stats: { downloads: 1250, rating: 4.9, reviews: 89 },
    tags: ['parallax', 'hero', 'gradient', 'scroll'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'pricing-cards-1',
    name: 'Animated Pricing Cards',
    description: 'Three-column pricing table with hover effects, staggered animations, and popular badge.',
    category: 'pricing-tables',
    framework: 'framer-motion',
    price: 0,
    preview: '/templates/pricing-cards.gif',
    code: `'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: 0,
    period: 'forever',
    features: ['5 projects', 'Basic analytics', 'Community support'],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: 29,
    period: 'month',
    features: ['Unlimited projects', 'Advanced analytics', 'Priority support', 'Custom domain'],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    period: 'month',
    features: ['Everything in Pro', 'Team features', 'Dedicated support', 'SLA'],
    cta: 'Contact Sales',
    popular: false,
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function PricingCards() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16"
        >
          Simple, transparent pricing
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={item}
              whileHover={{ y: -8, scale: 1.02 }}
              className={\`relative p-8 rounded-2xl border-2 transition-all \${
                plan.popular
                  ? 'border-purple-500 bg-white shadow-xl shadow-purple-500/20'
                  : 'border-gray-200 bg-white/50'
              }\`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">\${plan.price}</span>
                <span className="text-gray-500">/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={\`w-full py-3 rounded-xl font-semibold \${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }\`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}`,
    author: { name: 'WebMotion', avatar: '/avatars/webmotion.png' },
    stats: { downloads: 2100, rating: 4.8, reviews: 156 },
    tags: ['pricing', 'cards', 'tables', 'comparison'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: 'stagger-grid-1',
    name: 'Staggered Grid Gallery',
    description: 'A responsive grid with staggered animations, hover effects, and overlay details.',
    category: 'gallery',
    framework: 'framer-motion',
    price: 0,
    preview: '/templates/stagger-grid.gif',
    code: `'use client'

import { motion } from 'framer-motion'

const items = [
  { id: 1, title: 'Project One', category: 'Web Design', gradient: 'from-purple-500 to-pink-500' },
  { id: 2, title: 'Project Two', category: 'Branding', gradient: 'from-blue-500 to-cyan-500' },
  { id: 3, title: 'Project Three', category: 'App Design', gradient: 'from-orange-500 to-red-500' },
  { id: 4, title: 'Project Four', category: 'UI/UX', gradient: 'from-green-500 to-emerald-500' },
  { id: 5, title: 'Project Five', category: 'Development', gradient: 'from-indigo-500 to-purple-500' },
  { id: 6, title: 'Project Six', category: 'Strategy', gradient: 'from-pink-500 to-rose-500' },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function StaggeredGrid() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16"
        >
          Our Work
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={item}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
            >
              <div className={\`absolute inset-0 bg-gradient-to-br \${item.gradient}\`} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white/70 text-sm mb-1">{item.category}</span>
                <h3 className="text-white text-xl font-bold">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}`,
    author: { name: 'WebMotion', avatar: '/avatars/webmotion.png' },
    stats: { downloads: 1800, rating: 4.7, reviews: 134 },
    tags: ['grid', 'gallery', 'stagger', 'portfolio'],
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
  },
  {
    id: 'testimonial-cards-1',
    name: 'Testimonial Cards',
    description: 'Animated testimonial cards with star ratings, avatars, and smooth transitions.',
    category: 'testimonials',
    framework: 'framer-motion',
    price: 0,
    preview: '/templates/testimonial-cards.gif',
    code: `'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Frontend Developer',
    content: 'This tool transformed how I build animations. Incredible quality.',
    rating: 5,
    avatar: 'SC',
  },
  {
    name: 'Mike Johnson',
    role: 'Design Lead',
    content: 'The AI generates exactly what I need. Production-ready code every time.',
    rating: 5,
    avatar: 'MJ',
  },
  {
    name: 'Emma Wilson',
    role: 'Full Stack Dev',
    content: 'Best animation tool I have ever used. The prompt-to-code flow is seamless.',
    rating: 5,
    avatar: 'EW',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function TestimonialCards() {
  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16"
        >
          Loved by developers
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -5 }}
              className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}`,
    author: { name: 'WebMotion', avatar: '/avatars/webmotion.png' },
    stats: { downloads: 950, rating: 4.6, reviews: 67 },
    tags: ['testimonials', 'reviews', 'cards', 'social-proof'],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
  },
  {
    id: 'feature-grid-1',
    name: 'Feature Grid Section',
    description: 'Responsive feature grid with icons, hover effects, and staggered reveal animations.',
    category: 'feature-grids',
    framework: 'framer-motion',
    price: 0,
    preview: '/templates/feature-grid.gif',
    code: `'use client'

import { motion } from 'framer-motion'
import { Zap, Palette, Code2, Rocket, Shield, Globe } from 'lucide-react'

const features = [
  { icon: Zap, title: 'Lightning Fast', description: 'Generate animations in seconds.', color: 'from-yellow-500 to-orange-500' },
  { icon: Palette, title: 'Beautiful Design', description: 'AI-crafted modern animations.', color: 'from-pink-500 to-rose-500' },
  { icon: Code2, title: 'Clean Code', description: 'TypeScript, best practices.', color: 'from-blue-500 to-cyan-500' },
  { icon: Rocket, title: 'Instant Deploy', description: 'Live in seconds.', color: 'from-purple-500 to-indigo-500' },
  { icon: Shield, title: 'Enterprise Ready', description: 'Built for scale.', color: 'from-green-500 to-emerald-500' },
  { icon: Globe, title: 'Global CDN', description: '200+ edge locations.', color: 'from-teal-500 to-cyan-500' },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function FeatureGrid() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16"
        >
          Everything you need
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl border border-gray-200 hover:border-purple-500/50 transition-colors group"
            >
              <div className={\`w-12 h-12 rounded-xl bg-gradient-to-br \${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform\`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}`,
    author: { name: 'WebMotion', avatar: '/avatars/webmotion.png' },
    stats: { downloads: 1450, rating: 4.8, reviews: 98 },
    tags: ['features', 'grid', 'icons', 'benefits'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
  },
  {
    id: 'scroll-reveal-1',
    name: 'Scroll Reveal Section',
    description: 'Content that reveals on scroll with parallax effects and smooth transitions.',
    category: 'animations',
    framework: 'framer-motion',
    price: 0,
    preview: '/templates/scroll-reveal.gif',
    code: `'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function ScrollReveal() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9])

  return (
    <section ref={ref} className="py-32 px-4 overflow-hidden">
      <motion.div
        style={{ opacity, y, scale }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Beautiful scroll animations
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Elements fade in, scale up, and slide into view as you scroll.
          Create immersive experiences that engage your users.
        </p>
      </motion.div>
    </section>
  )
}`,
    author: { name: 'WebMotion', avatar: '/avatars/webmotion.png' },
    stats: { downloads: 820, rating: 4.5, reviews: 45 },
    tags: ['scroll', 'parallax', 'reveal', 'animation'],
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
  },
]

export function getTemplateById(id: string): MarketplaceTemplate | undefined {
  return marketplaceTemplates.find(t => t.id === id)
}

export function getTemplatesByCategory(category: string): MarketplaceTemplate[] {
  return marketplaceTemplates.filter(t => t.category === category)
}

export function getFreeTemplates(): MarketplaceTemplate[] {
  return marketplaceTemplates.filter(t => t.price === 0)
}

export function getPopularTemplates(limit: number = 6): MarketplaceTemplate[] {
  return [...marketplaceTemplates]
    .sort((a, b) => b.stats.downloads - a.stats.downloads)
    .slice(0, limit)
}
