'use client'

import { useState, useEffect, useRef, MouseEvent } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Sparkles, Code2, Zap, Globe, Wand2, Play, Check, Star,
  Layout, Type, Layers, Palette, Rocket, Shield, Clock, Users, TrendingUp,
  Eye, MousePointer, Monitor, Smartphone, ChevronDown
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

// Floating Orb Component
function FloatingOrb({ delay, duration, x, y, size, color }: { delay: number; duration: number; x: number; y: number; size: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full blur-xl opacity-30"
      style={{ width: size, height: size, background: color, left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

// Particle Field Component (deterministic positions)
function ParticleField() {
  const particles = [
    { id: 0, x: 5, y: 10, size: 2, duration: 15, delay: 0 },
    { id: 1, x: 12, y: 85, size: 1, duration: 18, delay: 1 },
    { id: 2, x: 25, y: 30, size: 3, duration: 12, delay: 2 },
    { id: 3, x: 35, y: 70, size: 1, duration: 20, delay: 0.5 },
    { id: 4, x: 48, y: 15, size: 2, duration: 16, delay: 1.5 },
    { id: 5, x: 55, y: 60, size: 1, duration: 19, delay: 3 },
    { id: 6, x: 65, y: 25, size: 2, duration: 14, delay: 2.5 },
    { id: 7, x: 75, y: 80, size: 3, duration: 17, delay: 0.8 },
    { id: 8, x: 85, y: 45, size: 1, duration: 21, delay: 1.8 },
    { id: 9, x: 92, y: 90, size: 2, duration: 13, delay: 3.5 },
    { id: 10, x: 15, y: 50, size: 1, duration: 22, delay: 4 },
    { id: 11, x: 40, y: 95, size: 2, duration: 11, delay: 0.3 },
    { id: 12, x: 70, y: 5, size: 1, duration: 23, delay: 2.2 },
    { id: 13, x: 88, y: 35, size: 3, duration: 14, delay: 1.2 },
    { id: 14, x: 30, y: 55, size: 1, duration: 18, delay: 3.8 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/40"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
}

// Animated Text Component
function AnimatedText({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ')
  
  return (
    <span className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.3em]">
          {word.split('').map((char, ci) => (
            <motion.span
              key={ci}
              className="inline-block"
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: (wi * word.length + ci) * 0.03, duration: 0.5, type: 'spring', damping: 12 }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  )
}

// Mouse Spotlight Effect
function MouseSpotlight() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const spotlightX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const spotlightY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  const handleMouseMove = (e: MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0" onMouseMove={handleMouseMove}>
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          x: spotlightX,
          y: spotlightY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

// Code Preview Animation
function CodePreview() {
  const lines = [
    { indent: 0, text: 'import { motion } from "framer-motion"', color: 'text-purple-400' },
    { indent: 0, text: '', color: '' },
    { indent: 0, text: 'export function Hero() {', color: 'text-blue-400' },
    { indent: 1, text: 'return (', color: 'text-white' },
    { indent: 2, text: '<motion.div', color: 'text-green-400' },
    { indent: 3, text: 'initial={{ opacity: 0, y: 50 }}', color: 'text-amber-400' },
    { indent: 3, text: 'animate={{ opacity: 1, y: 0 }}', color: 'text-amber-400' },
    { indent: 3, text: 'transition={{ duration: 0.8 }}', color: 'text-amber-400' },
    { indent: 2, text: '>', color: 'text-green-400' },
    { indent: 3, text: '<h1>Hello World</h1>', color: 'text-cyan-400' },
    { indent: 2, text: '</motion.div>', color: 'text-green-400' },
    { indent: 1, text: ')', color: 'text-white' },
    { indent: 0, text: '}', color: 'text-blue-400' },
  ]

  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl" />
      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <div className="ml-4 flex-1 h-6 rounded bg-slate-800/50 flex items-center px-3">
            <span className="text-xs text-slate-400">Hero.tsx</span>
          </div>
        </div>
        
        {/* Code lines */}
        <div className="p-4 font-mono text-sm">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.08, duration: 0.3 }}
              className="flex"
              style={{ paddingLeft: `${line.indent * 1.5}rem` }}
            >
              <span className="text-slate-500 w-6 text-right mr-4 select-none">{i + 1}</span>
              <span className={line.color}>{line.text}</span>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="mt-2 flex items-center gap-2"
          >
            <div className="w-2 h-4 bg-primary animate-pulse" />
            <span className="text-slate-500 text-xs">Ready to copy</span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Stats with counter animation
function AnimatedCounter({ value, label }: { value: string; label: string }) {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''))
  const suffix = value.replace(/[0-9]/g, '')
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = numericValue / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        setCount(numericValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [numericValue])

  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-primary">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-muted-foreground mt-1">{label}</div>
    </div>
  )
}

const features = [
  { icon: Sparkles, title: 'AI Animation Engine', description: 'Generate production-ready Framer Motion, GSAP, and CSS animations from natural language.' },
  { icon: Wand2, title: 'Visual Editor', description: 'Drag-and-drop builder with live preview. Create websites visually, export production code.' },
  { icon: Code2, title: 'Smart Code Generation', description: 'Get clean, typed React code with TypeScript, Tailwind CSS, and best practices built-in.' },
  { icon: Layout, title: 'Design System Generator', description: 'Generate complete design systems inspired by Apple, Stripe, Vercel, and more.' },
  { icon: Zap, title: 'Instant Deployment', description: 'Deploy to Vercel with one click. Your animated website goes live in seconds.' },
  { icon: Globe, title: 'Template Marketplace', description: 'Access hundreds of premium animation prompts and share your own creations.' },
]

const stats = [
  { value: '10000+', label: 'Developers' },
  { value: '50000+', label: 'Animations Generated' },
  { value: '999', label: 'Uptime %' },
  { value: '49', label: 'User Rating' },
]

export default function HomePage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <MouseSpotlight />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25">
                <span className="text-white font-bold text-sm">WM</span>
              </div>
              <span className="font-bold text-xl">WebMotion.ai</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              {['Templates', 'Prompts', 'Visual Editor', 'Pricing'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                  {item}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors">
                Log in
              </Link>
              <Link href="/auth/signup" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
          
          {/* Mesh Gradient */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-3xl" />
          </div>

          {/* Floating Orbs */}
          <FloatingOrb delay={0} duration={8} x={10} y={20} size={300} color="rgba(139, 92, 246, 0.15)" />
          <FloatingOrb delay={2} duration={10} x={80} y={30} size={250} color="rgba(236, 72, 153, 0.15)" />
          <FloatingOrb delay={4} duration={12} x={50} y={70} size={350} color="rgba(59, 130, 246, 0.15)" />
          <FloatingOrb delay={1} duration={9} x={20} y={80} size={200} color="rgba(168, 85, 247, 0.15)" />
          <FloatingOrb delay={3} duration={11} x={70} y={10} size={280} color="rgba(244, 114, 182, 0.15)" />

          {/* Particles */}
          <ParticleField />

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Hero Content */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4" />
                AI-Powered Animation Platform
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
                <AnimatedText text="Build" className="text-foreground" />
                <br />
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  <AnimatedText text="stunning" />
                </span>
                <br />
                <AnimatedText text="animated websites" className="text-foreground" />
              </h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
              >
                Create production-ready animations using natural language prompts. 
                Generate Framer Motion, GSAP, and Three.js code instantly. Deploy in seconds.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Link 
                  href="/auth/signup" 
                  className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-2xl text-base font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] flex items-center gap-2 overflow-hidden"
                >
                  <span className="relative z-10">Start Building Free</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link 
                  href="/editor/visual" 
                  className="group px-8 py-4 bg-background/50 backdrop-blur-sm border border-border text-foreground rounded-2xl text-base font-semibold hover:bg-background/80 transition-all flex items-center gap-2"
                >
                  <Play className="w-5 h-5 text-primary" />
                  Try Visual Editor
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Free to start
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  No credit card
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Deploy instantly
                </div>
              </motion.div>
            </div>

            {/* Right Column - Code Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
              className="hidden lg:block"
            >
              <CodePreview />
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-muted-foreground"
            >
              <span className="text-xs">Scroll to explore</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-y border-border/50 bg-background/80 backdrop-blur-xl relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AnimatedCounter value={stat.value} label={stat.label} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to create</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From AI-powered animation generation to one-click deployment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to build something amazing?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of developers using WebMotion.ai to create stunning animated websites.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup" className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2">
                Get Started for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/templates" className="px-8 py-4 bg-background/50 backdrop-blur-sm border border-border text-foreground rounded-2xl text-lg font-semibold hover:bg-background/80 transition-all">
                Browse Templates
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">WM</span>
                </div>
                <span className="font-bold">WebMotion.ai</span>
              </div>
              <p className="text-sm text-muted-foreground">AI-powered animation platform for building stunning websites.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/templates" className="hover:text-foreground transition-colors">Templates</Link></li>
                <li><Link href="/prompts" className="hover:text-foreground transition-colors">Prompt Library</Link></li>
                <li><Link href="/editor/visual" className="hover:text-foreground transition-colors">Visual Editor</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/changelog" className="hover:text-foreground transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2026 WebMotion.ai. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="https://twitter.com/webmotion" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</Link>
              <Link href="https://github.com/webmotion" className="text-muted-foreground hover:text-foreground transition-colors">GitHub</Link>
              <Link href="https://discord.gg/webmotion" className="text-muted-foreground hover:text-foreground transition-colors">Discord</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
