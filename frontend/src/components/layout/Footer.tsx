'use client'

import Link from 'next/link'
import {
  Github, Twitter, Linkedin, Youtube,
  Heart
} from 'lucide-react'

export function Footer() {
  const footerLinks = {
    product: [
      { label: 'Features', href: '/features' },
      { label: 'Templates', href: '/templates' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Changelog', href: '/changelog' },
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api-docs' },
      { label: 'Blog', href: '/blog' },
      { label: 'Community', href: '/community' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact', href: '/contact' },
      { label: 'Status', href: '/status' },
      { label: 'Security', href: '/security' },
    ],
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block">
              <div
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
                <span className="font-bold text-xl">WebMotion.ai</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Build stunning animated websites with AI-powered prompts. 
              Create production-ready animations in seconds.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {[
                { icon: Github, href: 'https://github.com/webmotion' },
                { icon: Twitter, href: 'https://twitter.com/webmotion' },
                { icon: Linkedin, href: 'https://linkedin.com/company/webmotion' },
                { icon: Youtube, href: 'https://youtube.com/@webmotion' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4 capitalize">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} WebMotion.ai. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by WebMotion Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
