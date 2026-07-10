export interface PromptTemplate {
  id: string
  title: string
  description: string
  category: string
  framework: string
  prompt: string
  code: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  uses: number
  previewImage?: string
  previewGif?: string
  isPremium?: boolean
  price?: number
}

export const PROMPT_CATEGORIES = [
  { id: 'all', name: 'All Prompts', count: 23 },
  { id: 'hero', name: 'Hero Sections', count: 8 },
  { id: 'animation', name: 'Animations', count: 6 },
  { id: 'effects', name: 'Effects', count: 5 },
  { id: 'portfolio', name: 'Portfolio', count: 4 },
]

export const PROMPT_LIBRARY: PromptTemplate[] = [
  // ============================================
  // FROM motion.txt - User's own prompts
  // ============================================
  {
    id: 'lithos-spotlight',
    title: 'Lithos - Cursor Spotlight Reveal',
    description: 'Full-screen dark hero with cursor-following spotlight that reveals a second image through a soft circular mask. Geology brand style with premium animations.',
    category: 'hero',
    framework: 'React + Vite + Tailwind',
    prompt: `Build a full-screen, dark-themed hero section for a geology brand called **Lithos**, using **React 18 + TypeScript + Vite + Tailwind CSS** and **lucide-react** for icons. The signature feature is a **cursor-following spotlight that reveals a second image** through a soft circular mask on top of a base image.

### Fonts
- Body/UI font: **Inter**
- Display/wordmark accent: **Playfair Display, italic**

### Layout & structure
Root wrapper: min-h-screen bg-white tracking-[-0.02em]

**Section**: relative w-full overflow-hidden h-screen bg-black

Layers, by z-index:
1. **Base image** (z-10): absolute inset-0 bg-center bg-cover bg-no-repeat
2. **Reveal layer** (z-30): RevealLayer component showing second image
3. **Heading** (z-50): absolute top-[14%] centered, "Layers hold / tales of time"
4. **Bottom-left paragraph** (z-50): Description text
5. **Bottom-right block** (z-50): CTA button "Start Digging"

### The cursor spotlight reveal (core mechanic)
Track mouse with smoothing (lerp 0.1). RevealLayer uses canvas with radial gradient mask:
- Radius 0 → 260px
- Gradient stops: 0 → 1, 0.4 → 1, 0.6 → 0.75, 0.75 → 0.4, 0.88 → 0.12, 1 → 0
- Apply as maskImage on reveal div

### Animations (premium, on load)
- heroReveal: opacity 0→1, translateY 28px→0, blur 12px→0
- heroFadeUp: opacity 0→1, translateY 20px→0
- heroZoom: scale 1.12→1 (Ken Burns)`,
    code: `// Lithos Cursor Spotlight Hero
'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const SPOTLIGHT_R = 260
const BG_IMAGE_1 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85'
const BG_IMAGE_2 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85'

function RevealLayer({ image, cursorX, cursorY }: { image: string; cursorX: number; cursorY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mask, setMask] = useState('')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)')
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)')
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2)
    ctx.fill()

    setMask(\`url('\${canvas.toDataURL()}')\`)
  }, [cursorX, cursorY])

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: \`url('\${image}')\`,
          maskImage: mask,
          WebkitMaskImage: mask,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
        }}
      />
    </>
  )
}

export default function LithosHero() {
  const mouse = useRef({ x: 0, y: 0 })
  const smooth = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>()
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1
      setCursorPos({ x: smooth.current.x, y: smooth.current.y })
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current!)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <section className="relative w-full overflow-hidden h-screen bg-black" style={{ height: '100dvh' }}>
        {/* Base Image */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
          style={{ backgroundImage: \`url('\${BG_IMAGE_1}')\` }}
        />

        {/* Reveal Layer */}
        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

        {/* Heading */}
        <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 z-50 pointer-events-none">
          <h1 className="text-white leading-[0.95]">
            <span className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal" style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}>
              Layers hold
            </span>
            <span className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal" style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}>
              tales of time
            </span>
          </h1>
        </div>

        {/* Bottom Left */}
        <div className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade" style={{ animationDelay: '0.7s' }}>
          <p className="text-sm text-white/80 leading-relaxed">
            Every layer of sediment records a chapter of our planet, from ancient seabeds to drifting ash, layered across millions of years beneath us.
          </p>
        </div>

        {/* Bottom Right */}
        <div className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade" style={{ animationDelay: '0.85s' }}>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Our interactive maps let you peel back the crust to trace how stones, fossils, and deep time combine to shape the ground beneath your feet.
          </p>
          <button className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30">
            Start Digging
          </button>
        </div>
      </section>
    </div>
  )
}`,
    tags: ['cursor', 'spotlight', 'reveal', 'parallax', 'hero', 'interactive'],
    difficulty: 'advanced',
    estimatedTime: '45 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
    isPremium: true,
    price: 29,
  },
  {
    id: 'jack-3d-portfolio',
    title: 'Jack - 3D Creator Portfolio',
    description: 'Full 3D creator portfolio with hero, marquee scroll, about section, services list, and sticky project cards. Dark theme with Kanit font.',
    category: 'portfolio',
    framework: 'React + Framer Motion + Tailwind',
    prompt: `Build a 3D Creator portfolio landing page for "Jack" using React, TypeScript, Tailwind CSS, Framer Motion, and Lucide React.

### Hero Section
- Full viewport height with massive heading "Hi, i'm jack"
- Gradient text using .hero-heading class
- Navigation: About, Price, Projects, Contact
- Portrait image with Magnet (mouse-following) effect
- FadeIn animations with staggered delays

### Marquee Section
- Two rows of 21 GIF images scrolling horizontally
- Row 1 moves RIGHT on scroll
- Row 2 moves LEFT on scroll
- Images tripled for seamless loop

### About Section
- Full-height centered with decorative 3D images in corners
- Character-by-character scroll-reveal text animation
- Contact button with gradient

### Services Section
- White background with rounded top corners
- 5 services: 3D Modeling, Rendering, Motion Design, Branding, Web Design
- Numbered list with descriptions

### Projects Section
- Dark background with sticky-stacking cards
- 3 project cards that scale down on scroll
- Card stacking effect using useScroll`,
    code: `// 3D Creator Portfolio - Full Implementation
'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const projects = [
  { num: '01', title: 'Nextlevel Studio', category: 'Client' },
  { num: '02', title: 'Aura Brand Identity', category: 'Personal' },
  { num: '03', title: 'Solaris Digital', category: 'Client' },
]

const services = [
  { num: '01', name: '3D Modeling', desc: 'Creation of detailed objects, characters, or environments tailored to specific client needs.' },
  { num: '02', name: 'Rendering', desc: 'High-quality, photorealistic renders that showcase designs with custom lighting and textures.' },
  { num: '03', name: 'Motion Design', desc: 'Dynamic animations and motion graphics that add energy and storytelling.' },
  { num: '04', name: 'Branding', desc: 'Crafting cohesive visual identities from logos to full brand systems.' },
  { num: '05', name: 'Web Design', desc: 'Designing clean, modern, and conversion-focused websites.' },
]

function ProjectCard({ project, index, total }: { project: any; index: number; total: number }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])

  return (
    <div ref={ref} className="h-[85vh] flex items-center justify-center sticky top-24 md:top-32">
      <motion.div
        style={{ scale }}
        className="w-full max-w-6xl bg-[#0C0C0C] border-2 border-[#D7E2EA] rounded-[40px] p-4 sm:p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-6xl font-black text-[#0C0C0C]">{project.num}</span>
          <span className="text-[#D7E2EA] text-sm uppercase tracking-widest">{project.category}</span>
        </div>
        <h3 className="text-2xl font-bold text-[#D7E2EA] mb-4">{project.title}</h3>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2 space-y-4">
            <div className="h-40 bg-gray-800 rounded-3xl" />
            <div className="h-56 bg-gray-800 rounded-3xl" />
          </div>
          <div className="col-span-3">
            <div className="h-full min-h-[320px] bg-gray-800 rounded-3xl" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Portfolio3D() {
  return (
    <div className="bg-[#0C0C0C] min-h-screen" style={{ fontFamily: "'Kanit', sans-serif" }}>
      {/* Hero */}
      <section className="h-screen flex flex-col justify-between px-6 md:px-10 pt-6 md:pt-8">
        <nav className="flex justify-between text-[#D7E2EA] text-sm md:text-lg uppercase tracking-wider">
          <a href="#about" className="hover:opacity-70 transition-opacity">About</a>
          <a href="#price" className="hover:opacity-70 transition-opacity">Price</a>
          <a href="#projects" className="hover:opacity-70 transition-opacity">Projects</a>
          <a href="#contact" className="hover:opacity-70 transition-opacity">Contact</a>
        </nav>
        <h1 className="text-[14vw] md:text-[17.5vw] font-black uppercase tracking-tight leading-none hero-heading text-center">
          Hi, i&apos;m jack
        </h1>
      </section>

      {/* Projects */}
      <section className="px-5 sm:px-8 md:px-10 py-20">
        <h2 className="text-[12vw] font-black uppercase hero-heading mb-16">Project</h2>
        {projects.map((project, i) => (
          <ProjectCard key={project.num} project={project} index={i} total={projects.length} />
        ))}
      </section>

      {/* Services */}
      <section className="bg-white rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 md:py-32">
        <h2 className="text-[12vw] font-black uppercase text-[#0C0C0C] text-center mb-28">Services</h2>
        <div className="max-w-5xl mx-auto">
          {services.map((s, i) => (
            <div key={s.num} className="flex gap-8 py-10 border-b border-[#0C0C0C]/15">
              <span className="text-[10vw] font-black text-[#0C0C0C]">{s.num}</span>
              <div>
                <h3 className="text-2xl font-medium uppercase">{s.name}</h3>
                <p className="text-[#0C0C0C]/60 mt-2 max-w-2xl">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}`,
    tags: ['portfolio', '3d', 'scroll', 'sticky', 'marquee', 'dark'],
    difficulty: 'advanced',
    estimatedTime: '60 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
    isPremium: true,
    price: 39,
  },
  {
    id: 'axion-shader-agency',
    title: 'Axion Studio - Shader Agency',
    description: 'Design agency landing with animated shader background, live clock, text-roll hover effects, and case study cards with video.',
    category: 'hero',
    framework: 'React + Shaders + Tailwind',
    prompt: `Build a React + Vite + Tailwind CSS landing page for "Axion Studio" - a design agency site. Use the shaders package for the hero background.

### Hero Section
- Light gray #EFEFEF background with animated shader overlay
- Shader stack: Swirl, ChromaFlow, FlutedGlass, FilmGrain
- Pill-shaped white navbar with logo, nav links, live London time
- CTA button with text-roll hover animation
- Headline: "We craft digital experiences for brands ready to dominate"

### About Section
- White background with badge row
- Heading: "Strategy-led creatives, delivering results"
- Responsive grid: paragraph + button + images
- Desktop: 3-column layout

### Case Studies
- Light gray background with video cards
- Card 1: Narrativ with hover expand button
- Card 2: Luminar with dark hover button
- Auto-playing muted videos`,
    code: `// Axion Studio - Shader Agency Landing
'use client'
import { useState, useEffect } from 'react'

function LiveClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
      }))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])
  return <span>{time} in London</span>
}

function TextRollButton({ text, className = '' }: { text: string; className?: string }) {
  return (
    <button className={\`group flex items-center gap-3 \${className}\`}>
      <span className="overflow-hidden h-[20px] flex flex-col">
        <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">{text}</span>
        <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">{text}</span>
      </span>
      <span className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-[-45deg]">
        →
      </span>
    </button>
  )
}

export default function AxionStudio() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#EFEFEF]">
      {/* Hero */}
      <section className="relative h-screen flex flex-col">
        {/* Shader Background */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Add shaders/react components here */}
        </div>

        {/* Nav */}
        <nav className="relative z-20 max-w-[1440px] mx-auto w-full p-2 sm:p-3">
          <div className="bg-white rounded-full px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] sm:text-[11px] font-bold tracking-tight">AX</span>
              </div>
              <div className="hidden md:flex gap-6 text-sm text-gray-900">
                <a href="#" className="hover:text-gray-500 transition-colors">Projects</a>
                <a href="#" className="hover:text-gray-500 transition-colors">Studio</a>
                <a href="#" className="hover:text-gray-500 transition-colors">Journal</a>
                <a href="#" className="hover:text-gray-500 transition-colors">Connect</a>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <LiveClock />
              </div>
              <TextRollButton text="Book a strategy call" className="bg-gray-900 text-white text-sm font-medium pl-5 pr-2 py-2 rounded-full" />
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-20 flex-1 flex items-end max-w-[1440px] mx-auto w-full px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
          <div>
            <p className="text-sm text-gray-900 tracking-wide mb-5 sm:mb-8">Axion Studio</p>
            <h1 className="text-[7vw] sm:text-[5vw] lg:text-[4.2rem] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900">
              We craft digital experiences<br className="hidden sm:block" />
              for brands ready to dominate<br className="hidden sm:block" />
              their category online.
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-8 sm:mt-12">
              <TextRollButton text="Start a project" className="bg-[#F26522] text-white text-sm font-medium pl-5 sm:pl-6 pr-2 py-2 rounded-full" />
              <div className="flex items-center gap-2 bg-white rounded-[4px] px-3 py-2 shadow-sm">
                <span className="text-sm font-medium">Certified Partner</span>
                <span className="bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded">Featured</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-900 text-white rounded-full flex items-center justify-center text-[11px] font-semibold">2</span>
            <span className="text-xs sm:text-sm font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1">Featured client work</span>
          </div>
          <h2 className="text-[7vw] sm:text-[5vw] lg:text-[4.2rem] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-16">
            Our projects
          </h2>
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
            {[
              { name: 'Narrativ', desc: 'Winner of Site of the Month 2025' },
              { name: 'Luminar', desc: 'Transforming a dated platform' },
            ].map((project) => (
              <div key={project.name} className="group cursor-pointer">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#1a1d2e] relative">
                  <video autoPlay muted loop playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-4">
                    <div className="h-9 w-9 bg-white rounded-full flex items-center justify-center group-hover:w-[148px] transition-all duration-300 overflow-hidden">
                      <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity delay-100 whitespace-nowrap">Learn more</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">{project.desc}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{project.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}`,
    tags: ['agency', 'shader', 'video', 'dark', 'interactive', 'live-clock'],
    difficulty: 'advanced',
    estimatedTime: '50 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
    isPremium: true,
    price: 35,
  },

  // ============================================
  // 20 MORE PROMPTS FROM MOTIONSITE.AI STYLE
  // ============================================
  {
    id: 'stellar-ai-hero',
    title: 'Stellar AI - Futuristic Hero',
    description: 'AI SaaS hero section with glowing orbs, gradient meshes, and typing text animation. Dark space theme.',
    category: 'hero',
    framework: 'Framer Motion',
    prompt: 'Create a futuristic AI hero section with floating gradient orbs, typing text animation, and glassmorphism CTA buttons.',
    code: `'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const words = ['Intelligence', 'Automation', 'Generation', 'Optimization']

export function StellarAIHero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1))
        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        setText(currentWord.substring(0, text.length - 1))
        if (text === '') {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex])

  return (
    <section className="relative min-h-screen bg-[#0a0a0f] overflow-hidden flex items-center justify-center">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-600/30 to-blue-600/30 blur-[120px]"
        animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '10%', left: '10%' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-500/20 to-pink-500/20 blur-[100px]"
        animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        style={{ bottom: '10%', right: '10%' }}
      />

      <div className="relative z-10 text-center px-5 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm text-white/80 mb-8">
            Powered by Advanced AI
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-bold text-white mb-6 leading-tight"
        >
          The Future of
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
            {text}
            <span className="animate-pulse">|</span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-white/60 mb-10 max-w-2xl mx-auto"
        >
          Build intelligent applications with our AI-powered platform.
          Automate workflows, generate content, and scale effortlessly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-full hover:scale-105 transition-transform">
            Start Free Trial
          </button>
          <button className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-colors">
            Watch Demo
          </button>
        </motion.div>
      </div>
    </section>
  )
}`,
    tags: ['ai', 'saas', 'typing', 'gradient', 'orbs', 'dark'],
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
    isPremium: false,
  },
  {
    id: 'terra-eco-landing',
    title: 'Terra - Eco/Sustainability Landing',
    description: 'Nature-inspired landing with organic shapes, earthy colors, and scroll-triggered animations.',
    category: 'hero',
    framework: 'Framer Motion + GSAP',
    prompt: 'Create an eco-friendly landing page with organic blob shapes, parallax earth imagery, and scroll-triggered text reveals.',
    code: `'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function TerraHero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen bg-gradient-to-b from-green-900 to-emerald-950 overflow-hidden">
      {/* Organic Blob */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[80px]"
        animate={{
          borderRadius: ['60% 40% 30% 70%/60% 30% 70% 40%', '30% 60% 70% 40%/50% 60% 30% 60%'],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div style={{ y, opacity }} className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-emerald-400 text-sm font-medium tracking-widest uppercase mb-6"
        >
          Sustainable Future
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-bold text-white text-center leading-tight"
        >
          Protecting
          <br />
          <span className="text-emerald-400">Our Planet</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-white/70 text-center max-w-xl mt-6"
        >
          Join the movement towards a greener tomorrow. Every action counts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mt-10"
        >
          <button className="px-8 py-4 bg-emerald-500 text-white font-semibold rounded-full hover:bg-emerald-600 transition-colors">
            Get Involved
          </button>
          <button className="px-8 py-4 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
            Learn More
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <motion.div className="w-1.5 h-1.5 bg-white rounded-full" animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>
  )
}`,
    tags: ['eco', 'nature', 'parallax', 'organic', 'green', 'scroll'],
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
    isPremium: false,
  },
  {
    id: 'skyelite-finance',
    title: 'SkyElite - Finance Dashboard Hero',
    description: 'Modern fintech hero with animated charts, glassmorphism cards, and real-time data visualization.',
    category: 'hero',
    framework: 'Framer Motion + Recharts',
    prompt: 'Create a finance dashboard hero with animated line charts, glassmorphism stat cards, and counter animations.',
    code: `'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const increment = target / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [target, duration])
  return <span>{count.toLocaleString()}</span>
}

export function SkyEliteHero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-5 w-full grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-blue-400 text-sm font-medium tracking-widest uppercase"
            >
              Next-Gen Finance
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl font-bold text-white mt-4 leading-tight"
            >
              Smart Investing
              <br />
              <span className="text-blue-400">Made Simple</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-lg mt-6"
            >
              Track your portfolio, analyze trends, and make data-driven decisions.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4 mt-8"
            >
              <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                Start Trading
              </button>
              <button className="px-6 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                View Demo
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Total Balance', value: 284521, prefix: '$' },
                { label: 'Monthly Profit', value: 12847, prefix: '+' },
                { label: 'Active Trades', value: 24, prefix: '' },
                { label: 'Win Rate', value: 94, suffix: '%' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/50 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.prefix}<AnimatedCounter target={stat.value} />{stat.suffix}
                  </p>
                </div>
              ))}
            </div>
            <div className="h-32 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-xl relative overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 100">
                <motion.path
                  d="M0,80 Q50,60 100,70 T200,40 T300,50 T400,20"
                  fill="none"
                  stroke="rgb(59,130,246)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}`,
    tags: ['finance', 'dashboard', 'charts', 'glassmorphism', 'dark', 'fintech'],
    difficulty: 'intermediate',
    estimatedTime: '25 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
    isPremium: true,
    price: 19,
  },
  {
    id: 'aethera-saas',
    title: 'Aethera - SaaS Landing',
    description: 'Clean SaaS landing with feature grid, pricing table, and testimonial carousel.',
    category: 'hero',
    framework: 'Framer Motion',
    prompt: 'Create a modern SaaS landing with animated feature cards, tiered pricing, and auto-scrolling testimonials.',
    code: `'use client'
import { motion } from 'framer-motion'

const features = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized for speed' },
  { icon: '🔒', title: 'Secure by Default', desc: 'Enterprise-grade security' },
  { icon: '🎨', title: 'Beautiful Design', desc: 'Crafted with care' },
  { icon: '📱', title: 'Mobile Ready', desc: 'Works everywhere' },
  { icon: '🔧', title: 'Easy Setup', desc: 'Ready in minutes' },
  { icon: '📊', title: 'Analytics', desc: 'Track everything' },
]

export function AetheraHero() {
  return (
    <section className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-purple-600 bg-purple-100 px-4 py-2 rounded-full">
            Introducing Aethera v2.0
          </span>
          <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mt-6">
            Build Better
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Products Faster</span>
          </h1>
          <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">
            The all-in-one platform for modern teams. Ship features 10x faster.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <button className="px-8 py-4 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors">
              Get Started Free
            </button>
            <button className="px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors">
              Book Demo
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all"
            >
              <span className="text-4xl">{f.icon}</span>
              <h3 className="text-xl font-semibold text-gray-900 mt-4">{f.title}</h3>
              <p className="text-gray-600 mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}`,
    tags: ['saas', 'landing', 'features', 'pricing', 'clean', 'minimal'],
    difficulty: 'beginner',
    estimatedTime: '15 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
    isPremium: false,
  },
  {
    id: 'cursor-glow-trail',
    title: 'Cursor Glow Trail Effect',
    description: 'Beautiful cursor-following glow that trails behind mouse movement with elastic physics.',
    category: 'effects',
    framework: 'Framer Motion',
    prompt: 'Create a cursor glow trail effect that follows mouse movement with smooth easing and glow gradient.',
    code: `'use client'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CursorGlowTrail() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { stiffness: 150, damping: 15 }
  const x = useSpring(cursorX, springConfig)
  const y = useSpring(cursorY, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    cursorX.set(e.clientX - 150)
    cursorY.set(e.clientY - 150)
  }

  return (
    <div
      className="min-h-screen bg-slate-950 relative overflow-hidden cursor-none"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="fixed w-[300px] h-[300px] rounded-full pointer-events-none z-50"
        style={{
          x,
          y,
          background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(59,130,246,0.2) 50%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <div className="relative z-10 flex items-center justify-center h-screen">
        <h1 className="text-6xl font-bold text-white text-center">
          Move your cursor
          <br />
          <span className="text-purple-400">around the screen</span>
        </h1>
      </div>

      {/* Floating elements */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
          style={{ left: \`\${Math.random() * 100}%\`, top: \`\${Math.random() * 100}%\` }}
          animate={{ y: [-20, 20, -20], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}
    </div>
  )
}`,
    tags: ['cursor', 'glow', 'trail', 'interactive', 'mouse', 'effect'],
    difficulty: 'beginner',
    estimatedTime: '10 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
    isPremium: false,
  },
  {
    id: 'magnetic-hover-cards',
    title: 'Magnetic Hover Cards Grid',
    description: 'Grid of cards that attract towards cursor on hover with magnetic physics effect.',
    category: 'effects',
    framework: 'Framer Motion',
    prompt: 'Create a grid of cards with magnetic hover effect where cards slightly move towards the cursor.',
    code: `'use client'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'

function MagneticCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.15)
    y.set((e.clientY - centerY) * 0.15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl cursor-pointer transition-colors hover:border-purple-500/50"
    >
      {children}
    </motion.div>
  )
}

export function MagneticCardsGrid() {
  const cards = [
    { title: 'Design', desc: 'Create stunning interfaces', icon: '🎨' },
    { title: 'Develop', desc: 'Build with modern tools', icon: '💻' },
    { title: 'Deploy', desc: 'Ship to production', icon: '🚀' },
    { title: 'Analyze', desc: 'Track performance', icon: '📊' },
    { title: 'Optimize', desc: 'Improve speed', icon: '⚡' },
    { title: 'Scale', desc: 'Grow without limits', icon: '📈' },
  ]

  return (
    <section className="min-h-screen bg-slate-950 py-20 px-5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Interactive Cards
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <MagneticCard key={card.title} index={i}>
              <span className="text-4xl">{card.icon}</span>
              <h3 className="text-xl font-semibold text-white mt-4">{card.title}</h3>
              <p className="text-white/60 mt-2">{card.desc}</p>
            </MagneticCard>
          ))}
        </div>
      </div>
    </section>
  )
}`,
    tags: ['magnetic', 'cards', 'hover', 'interactive', 'grid', 'physics'],
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
    isPremium: false,
  },
  {
    id: 'text-split-gradient',
    title: 'Text Split Gradient Animation',
    description: 'Headline text that splits and reveals gradient colors with staggered animation.',
    category: 'animation',
    framework: 'Framer Motion',
    prompt: 'Create a text split animation where each word animates from different directions with gradient color reveal.',
    code: `'use client'
import { motion } from 'framer-motion'

const words = ['Build', 'Beautiful', 'Websites', 'With', 'AI']

export function TextSplitGradient() {
  return (
    <section className="min-h-screen bg-slate-950 flex items-center justify-center px-5">
      <div className="text-center">
        <h1 className="text-6xl sm:text-8xl font-bold">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: i * 0.1,
                duration: 0.6,
                type: 'spring',
                damping: 12,
              }}
              className="inline-block mr-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
            >
              {word}
            </motion.span>
          ))}
        </h1>
      </div>
    </section>
  )
}`,
    tags: ['text', 'split', 'gradient', 'stagger', 'reveal', 'animation'],
    difficulty: 'beginner',
    estimatedTime: '8 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
    isPremium: false,
  },
  {
    id: 'glassmorphism-nav',
    title: 'Glassmorphism Navigation Bar',
    description: 'Frosted glass navigation that blurs background content with smooth transitions.',
    category: 'components',
    framework: 'Tailwind CSS',
    prompt: 'Create a glassmorphism navigation bar with backdrop blur, border glow, and smooth mobile menu transition.',
    code: `'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function GlassNav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-white">Logo</span>

          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Features', 'Pricing', 'About'].map((item) => (
              <a key={item} href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm text-white/80 hover:text-white transition-colors">Login</button>
            <button className="px-4 py-2 bg-white text-slate-900 text-sm font-semibold rounded-full hover:bg-white/90 transition-colors">
              Sign Up
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-2 mx-auto max-w-6xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
          >
            {['Home', 'Features', 'Pricing', 'About'].map((item) => (
              <a key={item} href="#" className="block py-3 text-white/80 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}`,
    tags: ['glassmorphism', 'navigation', 'navbar', 'blur', 'frosted', 'mobile'],
    difficulty: 'beginner',
    estimatedTime: '10 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
    isPremium: false,
  },
  {
    id: 'parallax-scroll-hero',
    title: 'Parallax Scroll Multi-Layer',
    description: 'Deep parallax with multiple layers moving at different speeds creating depth illusion.',
    category: 'animation',
    framework: 'Framer Motion + GSAP',
    prompt: 'Create a multi-layer parallax hero where background, midground, and foreground elements move at different scroll speeds.',
    code: `'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function ParallaxMultiLayer() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 300])
  const midY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const fgY = useTransform(scrollYProgress, [0, 1], [0, 50])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background Layer */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-purple-900"
        />

        {/* Stars/Midground */}
        <motion.div style={{ y: midY }} className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: \`\${Math.random() * 100}%\`,
                top: \`\${Math.random() * 100}%\`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Foreground Mountains */}
        <motion.div style={{ y: fgY }} className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 400" className="w-full">
            <path
              d="M0,400 L0,300 Q200,100 400,250 T800,200 T1200,280 T1440,220 L1440,400 Z"
              fill="rgba(0,0,0,0.3)"
            />
            <path
              d="M0,400 L0,320 Q300,200 600,300 T1200,280 T1440,320 L1440,400 Z"
              fill="rgba(0,0,0,0.5)"
            />
            <path
              d="M0,400 L0,350 Q400,280 800,350 T1440,340 L1440,400 Z"
              fill="rgba(0,0,0,0.8)"
            />
          </svg>
        </motion.div>

        {/* Text */}
        <motion.div
          style={{ y: textY, opacity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center px-5">
            <h1 className="text-6xl sm:text-8xl font-bold text-white">
              Scroll to Explore
            </h1>
            <p className="text-xl text-white/60 mt-6">Experience the depth of parallax</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}`,
    tags: ['parallax', 'scroll', 'layers', 'depth', 'mountains', 'sky'],
    difficulty: 'advanced',
    estimatedTime: '25 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
    isPremium: true,
    price: 15,
  },
  {
    id: 'gradient-mesh-bg',
    title: 'Animated Gradient Mesh Background',
    description: 'Smooth animated gradient mesh that shifts colors with organic movement.',
    category: 'effects',
    framework: 'CSS + Framer Motion',
    prompt: 'Create an animated gradient mesh background with multiple color blobs that move and blend together.',
    code: `'use client'
import { motion } from 'framer-motion'

export function GradientMeshBackground() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Gradient Blobs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)' }}
        animate={{
          x: ['-20%', '20%', '-20%'],
          y: ['-10%', '30%', '-10%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)', top: '20%', right: '10%' }}
        animate={{
          x: ['10%', '-20%', '10%'],
          y: ['20%', '-20%', '20%'],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)', bottom: '10%', left: '30%' }}
        animate={{
          x: ['5%', '15%', '5%'],
          y: ['10%', '-10%', '10%'],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-5">
        <h1 className="text-6xl sm:text-8xl font-bold text-white text-center">
          Gradient
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Mesh Magic
          </span>
        </h1>
      </div>
    </section>
  )
}`,
    tags: ['gradient', 'mesh', 'background', 'animated', 'colors', 'blur'],
    difficulty: 'beginner',
    estimatedTime: '8 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
    isPremium: false,
  },
  {
    id: 'scroll-progress-bar',
    title: 'Scroll Progress Indicator',
    description: 'Animated progress bar that fills as user scrolls with glow effect.',
    category: 'components',
    framework: 'Framer Motion',
    prompt: 'Create a scroll progress indicator bar at the top of the page with gradient fill and glow effect.',
    code: `'use client'
import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 origin-left z-50"
        style={{ scaleX }}
      />

      <section className="min-h-screen bg-slate-950 py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-12">Scroll Down</h1>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-40 bg-white/5 rounded-2xl mb-8 flex items-center justify-center">
              <span className="text-white/40 text-lg">Section {i + 1}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}`,
    tags: ['scroll', 'progress', 'indicator', 'bar', 'glow', 'navigation'],
    difficulty: 'beginner',
    estimatedTime: '5 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
    isPremium: false,
  },
  {
    id: 'text-reveal-scroll',
    title: 'Scroll-Triggered Text Reveal',
    description: 'Text that reveals character by character as user scrolls down the page.',
    category: 'typography',
    framework: 'Framer Motion',
    prompt: 'Create a scroll-triggered text reveal where each character fades in based on scroll progress.',
    code: `'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

function AnimatedChar({ char, index, total }: { char: string; index: number; total: number }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1])

  return (
    <motion.span ref={ref} style={{ opacity }} className="inline-block">
      {char === ' ' ? '\\u00A0' : char}
    </motion.span>
  )
}

export function TextRevealScroll() {
  const text = 'Every great journey begins with a single step into the unknown.'

  return (
    <section className="min-h-screen bg-slate-950 flex items-center justify-center px-5">
      <p className="text-3xl sm:text-5xl font-bold text-white max-w-4xl leading-relaxed">
        {text.split('').map((char, i) => (
          <AnimatedChar key={i} char={char} index={i} total={text.length} />
        ))}
      </p>
    </section>
  )
}`,
    tags: ['text', 'reveal', 'scroll', 'character', 'fade', 'typography'],
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
    isPremium: false,
  },
  {
    id: 'hover-card-3d',
    title: '3D Perspective Card Hover',
    description: 'Cards that tilt in 3D space following cursor with realistic lighting effect.',
    category: 'effects',
    framework: 'Framer Motion',
    prompt: 'Create a 3D perspective card that tilts towards the cursor with a gradient light effect following the mouse.',
    code: `'use client'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useRef } from 'react'

function PerspectiveCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15])
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 cursor-pointer overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: useTransform([x, y], ([xVal, yVal]) => {
            return \`radial-gradient(circle at \${(xVal + 1) * 50}% \${(yVal + 1) * 50}%, rgba(255,255,255,0.1), transparent 50%)\`
          }),
        }}
      />
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </motion.div>
  )
}

export function HoverCard3D() {
  return (
    <section className="min-h-screen bg-slate-950 flex items-center justify-center px-5">
      <PerspectiveCard>
        <div className="text-center">
          <span className="text-6xl">🃏</span>
          <h3 className="text-2xl font-bold text-white mt-4">3D Card</h3>
          <p className="text-white/60 mt-2">Hover to see the effect</p>
        </div>
      </PerspectiveCard>
    </section>
  )
}`,
    tags: ['3d', 'card', 'perspective', 'tilt', 'hover', 'lighting'],
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
    isPremium: false,
  },
  {
    id: 'loading-skeleton',
    title: 'Animated Loading Skeleton',
    description: 'Beautiful shimmer loading skeleton with gradient animation for content placeholders.',
    category: 'components',
    framework: 'CSS + Framer Motion',
    prompt: 'Create animated loading skeleton components with shimmer gradient effect for cards and text.',
    code: `'use client'
import { motion } from 'framer-motion'

function SkeletonLine({ width }: { width?: string }) {
  return (
    <div className="relative overflow-hidden bg-white/10 rounded" style={{ width: width || '100%', height: '16px' }}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white/5 rounded-2xl p-6 space-y-4">
      <SkeletonLine width="60px" />
      <SkeletonLine width="200px" />
      <SkeletonLine />
      <SkeletonLine width="80%" />
      <div className="flex gap-4 pt-4">
        <SkeletonLine width="100px" />
        <SkeletonLine width="100px" />
      </div>
    </div>
  )
}

export function LoadingSkeleton() {
  return (
    <section className="min-h-screen bg-slate-950 flex items-center justify-center px-5">
      <div className="max-w-4xl w-full grid md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  )
}`,
    tags: ['loading', 'skeleton', 'shimmer', 'placeholder', 'animation', 'ui'],
    difficulty: 'beginner',
    estimatedTime: '8 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
    isPremium: false,
  },
  {
    id: 'hero-image-reveal',
    title: 'Hero Image Clip Reveal',
    description: 'Image that reveals from center with expanding clip-path animation on load.',
    category: 'animation',
    framework: 'Framer Motion + CSS',
    prompt: 'Create a hero image that reveals using clip-path circle expansion from center with smooth easing.',
    code: `'use client'
import { motion } from 'framer-motion'

export function HeroImageReveal() {
  return (
    <section className="min-h-screen bg-slate-950 flex items-center justify-center px-5">
      <div className="relative max-w-4xl w-full">
        <motion.div
          className="aspect-video rounded-3xl overflow-hidden"
          initial={{ clipPath: 'circle(0% at 50% 50%)' }}
          animate={{ clipPath: 'circle(75% at 50% 50%)' }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <img
            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1280&q=80"
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-8 left-8 right-8 text-center"
        >
          <h1 className="text-4xl sm:text-6xl font-bold text-white drop-shadow-lg">
            Discover Nature
          </h1>
          <p className="text-white/80 mt-4 text-lg">Explore the beauty of our world</p>
        </motion.div>
      </div>
    </section>
  )
}`,
    tags: ['hero', 'image', 'reveal', 'clip-path', 'circle', 'animation'],
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
    isPremium: false,
  },
  {
    id: 'bento-grid',
    title: 'Bento Grid Layout',
    description: 'Modern bento box grid layout with varying card sizes and hover effects.',
    category: 'components',
    framework: 'Tailwind CSS + Framer Motion',
    prompt: 'Create a bento grid layout with varying card sizes, hover animations, and modern aesthetic.',
    code: `'use client'
import { motion } from 'framer-motion'

const items = [
  { title: 'Analytics', desc: 'Track your metrics', span: 'col-span-2 row-span-2', bg: 'from-purple-600 to-pink-600' },
  { title: 'Revenue', desc: '$12,345', span: 'col-span-1', bg: 'from-blue-600 to-cyan-600' },
  { title: 'Users', desc: '1,234', span: 'col-span-1', bg: 'from-green-600 to-emerald-600' },
  { title: 'Growth', desc: '+23%', span: 'col-span-1', bg: 'from-orange-600 to-red-600' },
  { title: 'Performance', desc: '99.9%', span: 'col-span-1', bg: 'from-indigo-600 to-purple-600' },
]

export function BentoGrid() {
  return (
    <section className="min-h-screen bg-slate-950 flex items-center justify-center px-5 py-20">
      <div className="max-w-4xl w-full">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Dashboard</h2>
        <div className="grid grid-cols-3 gap-4 auto-rows-[120px]">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={\`bg-gradient-to-br \${item.bg} rounded-2xl p-6 \${item.span} cursor-pointer\`}
            >
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="text-white/70 text-3xl font-bold mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}`,
    tags: ['bento', 'grid', 'layout', 'dashboard', 'modern', 'cards'],
    difficulty: 'beginner',
    estimatedTime: '10 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
    isPremium: false,
  },
  {
    id: 'orbit-3d',
    title: 'Orbiting Elements Animation',
    description: 'Elements that orbit around a central point with 3D rotation and depth effect.',
    category: 'animation',
    framework: 'Framer Motion + CSS',
    prompt: 'Create orbiting elements animation where icons/text rotate around a central point with 3D perspective.',
    code: `'use client'
import { motion } from 'framer-motion'

const orbitItems = [
  { label: 'React', angle: 0 },
  { label: 'Next.js', angle: 45 },
  { label: 'TypeScript', angle: 90 },
  { label: 'Tailwind', angle: 135 },
  { label: 'Framer', angle: 180 },
  { label: 'Vercel', angle: 225 },
  { label: 'Node.js', angle: 270 },
  { label: 'GraphQL', angle: 315 },
]

export function Orbit3D() {
  return (
    <section className="min-h-screen bg-slate-950 flex items-center justify-center px-5 overflow-hidden">
      <div className="relative w-[500px] h-[500px]">
        {/* Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center z-10">
          <span className="text-white font-bold">WM</span>
        </div>

        {/* Orbit Ring */}
        <div className="absolute inset-10 border border-white/10 rounded-full" />

        {/* Orbiting Items */}
        {orbitItems.map((item, i) => (
          <motion.div
            key={item.label}
            className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6"
            animate={{
              rotate: [item.angle, item.angle + 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <motion.div
              className="w-12 h-12 bg-white/10 backdrop-blur border border-white/20 rounded-xl flex items-center justify-center"
              style={{ transform: \`translateX(180px) rotate(-\${item.angle}deg)\` }}
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <span className="text-xs font-medium text-white">{item.label}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}`,
    tags: ['orbit', '3d', 'rotation', 'circular', 'animation', 'tech'],
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
    isPremium: false,
  },
  {
    id: 'hero-gradient-text',
    title: 'Animated Gradient Text',
    description: 'Large headline text with animated gradient that shifts colors continuously.',
    category: 'typography',
    framework: 'CSS Animation',
    prompt: 'Create large headline text with an animated gradient that shifts colors in a continuous loop.',
    code: `'use client'
import { motion } from 'framer-motion'

export function AnimatedGradientText() {
  return (
    <section className="min-h-screen bg-slate-950 flex items-center justify-center px-5">
      <div className="text-center">
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tight leading-none">
          <span
            className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease infinite',
            }}
          >
            Creative
          </span>
          <br />
          <span
            className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease infinite 0.5s',
            }}
          >
            Vision
          </span>
        </h1>
        <p className="text-xl text-white/60 mt-8 max-w-xl mx-auto">
          Where imagination meets technology
        </p>
      </div>

      <style jsx>{\`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      \`}</style>
    </section>
  )
}`,
    tags: ['text', 'gradient', 'animated', 'color', 'shift', 'typography'],
    difficulty: 'beginner',
    estimatedTime: '5 min',
    uses: 0,
    previewGif: 'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
    isPremium: false,
  },
]
