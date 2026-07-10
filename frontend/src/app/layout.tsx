import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'WebMotion.ai - AI-Powered Animation Prompt Engineering',
  description: 'Build, animate, and deploy stunning websites with AI. Create production-ready animations using natural language prompts.',
  keywords: [
    'AI website builder',
    'animation prompts',
    'Framer Motion',
    'GSAP',
    'web development',
    'AI-powered design',
    'motion graphics',
    'React animations',
  ],
  openGraph: {
    title: 'WebMotion.ai - AI-Powered Animation Prompt Engineering',
    description: 'Build, animate, and deploy stunning websites with AI.',
    url: 'https://webmotion.ai',
    siteName: 'WebMotion.ai',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebMotion.ai - AI-Powered Animation Prompt Engineering',
    description: 'Build, animate, and deploy stunning websites with AI.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable} suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
