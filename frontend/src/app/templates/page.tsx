'use client'

import { TemplateGallery } from '@/components/templates/TemplateGallery'

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <a href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">WM</span>
                </div>
                <span className="font-bold text-xl">WebMotion.ai</span>
              </a>
              <nav className="hidden md:flex items-center gap-6">
                <a href="/templates" className="text-foreground font-medium">
                  Templates
                </a>
                <a href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
                <a href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Docs
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <a href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors">
                Log in
              </a>
              <a
                href="/auth/signup"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TemplateGallery />
      </main>
    </div>
  )
}
