import { NextRequest, NextResponse } from 'next/server'

interface Section {
  id: string
  type: string
  name: string
  props: Record<string, any>
  styles: Record<string, string>
  visible: boolean
  locked: boolean
  children?: Section[]
}

interface LayoutRequest {
  prompt: string
  mode: 'replace' | 'append'
  existingSections: number
}

// Layout templates organized by category
const LAYOUT_TEMPLATES: Record<string, () => Section[]> = {
  hero: () => [
    {
      id: `hero-${Date.now()}`,
      type: 'hero',
      name: 'Hero Section',
      props: {
        title: 'Build Something Amazing',
        subtitle: 'Create beautiful, modern websites with AI-powered tools and stunning animations.',
        ctaText: 'Get Started Free',
        ctaLink: '/signup',
      },
      styles: {
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '100px 20px',
        textAlign: 'center',
      },
      visible: true,
      locked: false,
    },
  ],

  features: () => [
    {
      id: `features-${Date.now()}`,
      type: 'features',
      name: 'Features Section',
      props: {
        title: 'Powerful Features',
        subtitle: 'Everything you need to build modern web experiences',
        items: [
          { title: 'AI-Powered', description: 'Generate beautiful layouts and components with artificial intelligence', icon: 'sparkles' },
          { title: 'Lightning Fast', description: 'Optimized performance with automatic code splitting and lazy loading', icon: 'zap' },
          { title: 'Fully Responsive', description: 'Looks great on every device, from mobile to desktop', icon: 'smartphone' },
          { title: 'Easy to Use', description: 'Drag-and-drop interface that anyone can master in minutes', icon: 'mouse' },
          { title: 'Customizable', description: 'Fine-tune every detail with our powerful style editor', icon: 'palette' },
          { title: 'Export Ready', description: 'Download clean, production-ready code with one click', icon: 'download' },
        ],
      },
      styles: {
        padding: '80px 20px',
        backgroundColor: '#ffffff',
      },
      visible: true,
      locked: false,
    },
  ],

  pricing: () => [
    {
      id: `pricing-${Date.now()}`,
      type: 'pricing',
      name: 'Pricing Section',
      props: {
        title: 'Simple, Transparent Pricing',
        subtitle: 'Choose the plan that works for you',
        plans: [
          {
            name: 'Starter',
            price: '$0',
            period: 'forever',
            description: 'Perfect for trying out',
            features: ['5 projects', 'Basic animations', 'Community support', '1 GB storage'],
            cta: 'Start Free',
            popular: false,
          },
          {
            name: 'Pro',
            price: '$29',
            period: '/month',
            description: 'For professionals',
            features: ['Unlimited projects', 'Advanced animations', 'Priority support', '50 GB storage', 'Custom domains', 'Team collaboration'],
            cta: 'Start Pro Trial',
            popular: true,
          },
          {
            name: 'Enterprise',
            price: '$99',
            period: '/month',
            description: 'For teams and businesses',
            features: ['Everything in Pro', 'Dedicated support', 'SSO & SAML', 'Unlimited storage', 'Custom integrations', 'SLA guarantee'],
            cta: 'Contact Sales',
            popular: false,
          },
        ],
      },
      styles: {
        padding: '80px 20px',
        backgroundColor: '#f8fafc',
      },
      visible: true,
      locked: false,
    },
  ],

  testimonials: () => [
    {
      id: `testimonials-${Date.now()}`,
      type: 'testimonials',
      name: 'Testimonials Section',
      props: {
        title: 'Loved by Developers',
        subtitle: 'See what our users have to say',
        items: [
          {
            quote: 'This tool has completely transformed how I build websites. The AI generation is incredibly accurate.',
            author: 'Sarah Chen',
            role: 'Senior Developer',
            company: 'TechCorp',
          },
          {
            quote: 'We shipped our new landing page in half the time. The animations are butter-smooth.',
            author: 'Marcus Johnson',
            role: 'Product Lead',
            company: 'StartupXYZ',
          },
          {
            quote: 'The best website builder I have ever used. Period. The code quality is production-ready.',
            author: 'Elena Rodriguez',
            role: 'CTO',
            company: 'DesignStudio',
          },
        ],
      },
      styles: {
        padding: '80px 20px',
        backgroundColor: '#ffffff',
      },
      visible: true,
      locked: false,
    },
  ],

  cta: () => [
    {
      id: `cta-${Date.now()}`,
      type: 'cta',
      name: 'Call to Action',
      props: {
        title: 'Ready to Build Something Amazing?',
        subtitle: 'Join thousands of developers creating beautiful websites with AI.',
        ctaText: 'Start Building for Free',
        ctaLink: '/signup',
      },
      styles: {
        padding: '80px 20px',
        backgroundColor: '#7c3aed',
        color: '#ffffff',
        textAlign: 'center',
      },
      visible: true,
      locked: false,
    },
  ],

  footer: () => [
    {
      id: `footer-${Date.now()}`,
      type: 'footer',
      name: 'Footer',
      props: {
        brand: 'WebMotion.ai',
        tagline: 'Build beautiful websites with AI-powered animations.',
        columns: [
          {
            title: 'Product',
            links: ['Features', 'Pricing', 'Templates', 'Changelog'],
          },
          {
            title: 'Company',
            links: ['About', 'Blog', 'Careers', 'Contact'],
          },
          {
            title: 'Resources',
            links: ['Documentation', 'API Reference', 'Community', 'Support'],
          },
          {
            title: 'Legal',
            links: ['Privacy', 'Terms', 'Security', 'Cookies'],
          },
        ],
        copyright: `© ${new Date().getFullYear()} WebMotion.ai. All rights reserved.`,
      },
      styles: {
        padding: '60px 20px 30px',
        backgroundColor: '#0f172a',
        color: '#ffffff',
      },
      visible: true,
      locked: false,
    },
  ],

  contact: () => [
    {
      id: `contact-${Date.now()}`,
      type: 'contact',
      name: 'Contact Section',
      props: {
        title: 'Get in Touch',
        subtitle: 'Have a question? We would love to hear from you.',
        fields: [
          { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
          { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
          { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Your message...' },
        ],
        submitText: 'Send Message',
      },
      styles: {
        padding: '80px 20px',
        backgroundColor: '#f8fafc',
      },
      visible: true,
      locked: false,
    },
  ],

  navbar: () => [
    {
      id: `navbar-${Date.now()}`,
      type: 'navbar',
      name: 'Navigation Bar',
      props: {
        brand: 'WebMotion.ai',
        links: [
          { label: 'Features', href: '#features' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'About', href: '#about' },
          { label: 'Contact', href: '#contact' },
        ],
        ctaText: 'Get Started',
        ctaLink: '/signup',
      },
      styles: {
        padding: '16px 20px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
      },
      visible: true,
      locked: false,
    },
  ],

  faq: () => [
    {
      id: `faq-${Date.now()}`,
      type: 'faq',
      name: 'FAQ Section',
      props: {
        title: 'Frequently Asked Questions',
        subtitle: 'Everything you need to know',
        items: [
          {
            question: 'How does the AI generation work?',
            answer: 'Our AI analyzes your description and generates production-ready code using advanced language models. It understands design patterns and best practices.',
          },
          {
            question: 'Can I customize the generated layouts?',
            answer: 'Absolutely! Every generated component can be fully customized through our visual editor. Change colors, fonts, spacing, and more.',
          },
          {
            question: 'Is the generated code production-ready?',
            answer: 'Yes! The code follows React best practices, uses TypeScript, and is optimized for performance. You can deploy it directly.',
          },
          {
            question: 'Do I need coding experience?',
            answer: 'Not at all! Our visual editor lets anyone create beautiful websites. However, developers can also export and modify the code directly.',
          },
        ],
      },
      styles: {
        padding: '80px 20px',
        backgroundColor: '#ffffff',
      },
      visible: true,
      locked: false,
    },
  ],

  stats: () => [
    {
      id: `stats-${Date.now()}`,
      type: 'stats',
      name: 'Stats Section',
      props: {
        items: [
          { value: '10K+', label: 'Active Users' },
          { value: '50K+', label: 'Projects Created' },
          { value: '99.9%', label: 'Uptime' },
          { value: '4.9/5', label: 'User Rating' },
        ],
      },
      styles: {
        padding: '60px 20px',
        backgroundColor: '#f1f5f9',
      },
      visible: true,
      locked: false,
    },
  ],

  newsletter: () => [
    {
      id: `newsletter-${Date.now()}`,
      type: 'newsletter',
      name: 'Newsletter Signup',
      props: {
        title: 'Stay Updated',
        subtitle: 'Get the latest news and updates delivered to your inbox.',
        placeholder: 'Enter your email',
        ctaText: 'Subscribe',
      },
      styles: {
        padding: '60px 20px',
        backgroundColor: '#1e293b',
        color: '#ffffff',
        textAlign: 'center',
      },
      visible: true,
      locked: false,
    },
  ],
}

// Prompt analysis keywords
const SECTION_KEYWORDS: Record<string, string[]> = {
  hero: ['hero', 'banner', 'header', 'landing', 'main', 'top', 'intro', 'welcome', 'headline'],
  features: ['features', 'capabilities', 'benefits', 'services', 'what we offer', 'highlights'],
  pricing: ['pricing', 'price', 'plans', 'subscription', 'cost', 'tiers', 'packages'],
  testimonials: ['testimonials', 'reviews', 'feedback', 'what people say', 'quotes', 'social proof'],
  cta: ['cta', 'call to action', 'sign up', 'get started', 'join', 'convert', 'action'],
  footer: ['footer', 'bottom', 'links', 'copyright', 'site footer'],
  contact: ['contact', 'get in touch', 'reach out', 'form', 'message us', 'support form'],
  faq: ['faq', 'frequently asked', 'questions', 'answers', 'help'],
  stats: ['stats', 'numbers', 'metrics', 'statistics', 'achievements', 'milestones'],
  newsletter: ['newsletter', 'subscribe', 'email signup', 'mailing list', 'stay updated'],
  navbar: ['navbar', 'navigation', 'nav', 'menu', 'header nav', 'top nav'],
}

function analyzePrompt(prompt: string): string[] {
  const lower = prompt.toLowerCase()
  const detectedSections: string[] = []

  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        detectedSections.push(section)
        break
      }
    }
  }

  // If no sections detected, generate a sensible default layout
  if (detectedSections.length === 0) {
    // Check for specific page types
    if (lower.includes('landing') || lower.includes('saas') || lower.includes('startup')) {
      return ['hero', 'features', 'pricing', 'testimonials', 'cta', 'footer']
    }
    if (lower.includes('portfolio') || lower.includes('personal')) {
      return ['hero', 'stats', 'features', 'testimonials', 'contact', 'footer']
    }
    if (lower.includes('ecommerce') || lower.includes('store') || lower.includes('shop')) {
      return ['hero', 'features', 'pricing', 'testimonials', 'newsletter', 'footer']
    }
    if (lower.includes('agency') || lower.includes('creative')) {
      return ['hero', 'features', 'stats', 'testimonials', 'cta', 'footer']
    }
    // Default full page layout
    return ['hero', 'features', 'pricing', 'testimonials', 'cta', 'footer']
  }

  // Always include navbar and footer for complete pages
  if (!detectedSections.includes('navbar') && detectedSections.length > 2) {
    detectedSections.unshift('navbar')
  }
  if (!detectedSections.includes('footer') && detectedSections.length > 2) {
    detectedSections.push('footer')
  }

  return detectedSections
}

function generateLayoutFromSections(sectionTypes: string[]): Section[] {
  const sections: Section[] = []

  for (const sectionType of sectionTypes) {
    const generator = LAYOUT_TEMPLATES[sectionType]
    if (generator) {
      sections.push(...generator())
    }
  }

  return sections
}

// Customization based on prompt keywords
function customizeSections(sections: Section[], prompt: string): Section[] {
  const lower = prompt.toLowerCase()

  return sections.map((section) => {
    const customized = { ...section }

    // Color scheme customization
    if (lower.includes('dark') || lower.includes('midnight') || lower.includes('noir')) {
      if (['hero', 'cta', 'footer', 'newsletter'].includes(section.type)) {
        customized.styles = { ...customized.styles, backgroundColor: '#0a0a0a' }
      } else {
        customized.styles = { ...customized.styles, backgroundColor: '#111827', color: '#ffffff' }
      }
    }

    if (lower.includes('blue') || lower.includes('ocean') || lower.includes('sky')) {
      if (section.type === 'hero') {
        customized.styles = { ...customized.styles, backgroundColor: '#0ea5e9' }
      }
      if (section.type === 'cta') {
        customized.styles = { ...customized.styles, backgroundColor: '#0284c7' }
      }
    }

    if (lower.includes('green') || lower.includes('nature') || lower.includes('eco')) {
      if (section.type === 'hero') {
        customized.styles = { ...customized.styles, backgroundColor: '#059669' }
      }
      if (section.type === 'cta') {
        customized.styles = { ...customized.styles, backgroundColor: '#047857' }
      }
    }

    if (lower.includes('purple') || lower.includes('violet') || lower.includes('lavender')) {
      if (section.type === 'hero') {
        customized.styles = { ...customized.styles, backgroundColor: '#7c3aed' }
      }
      if (section.type === 'cta') {
        customized.styles = { ...customized.styles, backgroundColor: '#6d28d9' }
      }
    }

    // Content customization based on industry
    if (lower.includes('school') || lower.includes('education') || lower.includes('learning')) {
      if (section.type === 'hero') {
        customized.props = {
          ...customized.props,
          title: 'Transform Education with Technology',
          subtitle: 'Empower students and teachers with modern digital tools.',
        }
      }
      if (section.type === 'features') {
        customized.props = {
          ...customized.props,
          title: 'Why Schools Love Us',
          items: [
            { title: 'Student Management', description: 'Track attendance, grades, and progress in one place', icon: 'users' },
            { title: 'Online Exams', description: 'Create and manage secure online assessments', icon: 'file' },
            { title: 'Parent Portal', description: 'Keep parents informed with real-time updates', icon: 'home' },
            { title: 'AI Analytics', description: 'Insights into student performance and trends', icon: 'chart' },
          ],
        }
      }
    }

    if (lower.includes('health') || lower.includes('medical') || lower.includes('clinic')) {
      if (section.type === 'hero') {
        customized.props = {
          ...customized.props,
          title: 'Modern Healthcare Solutions',
          subtitle: 'Streamline your practice with intelligent management tools.',
        }
      }
    }

    if (lower.includes('restaurant') || lower.includes('food') || lower.includes('cafe')) {
      if (section.type === 'hero') {
        customized.props = {
          ...customized.props,
          title: 'Delicious Food, Delivered Fast',
          subtitle: 'Order your favorites online with easy delivery.',
        }
      }
    }

    return customized
  })
}

export async function POST(request: NextRequest) {
  try {
    const body: LayoutRequest = await request.json()
    const { prompt, mode } = body

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Analyze prompt to determine sections
    const sectionTypes = analyzePrompt(prompt)

    // Generate sections
    let sections = generateLayoutFromSections(sectionTypes)

    // Customize based on prompt details
    sections = customizeSections(sections, prompt)

    return NextResponse.json({
      success: true,
      sections,
      sectionCount: sections.length,
      detectedTypes: sectionTypes,
    })
  } catch (error) {
    console.error('Layout generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate layout' },
      { status: 500 }
    )
  }
}
