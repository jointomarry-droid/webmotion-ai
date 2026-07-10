'use client'

import { useEffect, useRef, useState } from 'react'
import { RefreshCw, ExternalLink, Loader2, AlertCircle } from 'lucide-react'

interface LivePreviewProps {
  code: string
  framework?: string
}

export function LivePreview({ code, framework = 'framer-motion' }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code || !iframeRef.current) return

    setIsLoading(true)
    setError(null)

    // Build the HTML document for the iframe
    const html = buildPreviewHTML(code, framework)

    // Write to iframe
    const iframe = iframeRef.current
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    
    if (doc) {
      doc.open()
      doc.write(html)
      doc.close()
    }
  }, [code, framework])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setError('Failed to render preview')
  }

  const handleRefresh = () => {
    if (!iframeRef.current) return
    setIsLoading(true)
    setError(null)
    const html = buildPreviewHTML(code, framework)
    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
    if (doc) {
      doc.open()
      doc.write(html)
      doc.close()
    }
  }

  const handleOpenExternal = () => {
    const html = buildPreviewHTML(code, framework)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Loader2 className="h-8 w-8 opacity-30" />
          </div>
          <p>Your animation preview will appear here</p>
          <p className="text-sm mt-2 text-gray-300">Type a prompt to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-2 text-xs text-gray-500">preview.html</span>
        </div>
        <div className="flex items-center gap-1">
          {isLoading && (
            <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
          )}
          {error && (
            <AlertCircle className="h-3 w-3 text-red-500" />
          )}
          <button
            onClick={handleRefresh}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-3 w-3 text-gray-500" />
          </button>
          <button
            onClick={handleOpenExternal}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="h-3 w-3 text-gray-500" />
          </button>
        </div>
      </div>

      {/* iframe */}
      <div className="flex-1 bg-white relative">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
            <div className="text-center text-red-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 text-xs underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="Animation Preview"
        />
      </div>
    </div>
  )
}

/**
 * Build a self-contained HTML document for previewing the animation
 */
function buildPreviewHTML(code: string, framework: string): string {
  // Extract component name from code
  const componentNameMatch = code.match(/export\s+(?:default\s+)?(?:function|const)\s+(\w+)/)
  const componentName = componentNameMatch?.[1] || 'AnimatedComponent'

  // Determine which CDN scripts to include based on framework
  const scripts: string[] = []
  const styles: string[] = []

  // React & ReactDOM
  scripts.push(`
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
  `)

  // Babel for JSX transformation
  scripts.push(`<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>`)

  // Tailwind CSS
  styles.push(`
    <script src="https://cdn.tailwindcss.com"><\/script>
    <style>
      body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
      * { box-sizing: border-box; }
    </style>
  `)

  // Framework-specific CDN
  if (framework === 'framer-motion') {
    // Framer Motion - we need to use a compatible approach
    // Since framer-motion doesn't have a UMD build, we'll use CSS animations as fallback
    // and keep the code as reference
    styles.push(`
      <style>
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .motion-fade { animation: fadeIn 0.6s ease-out forwards; }
        .motion-slide { animation: slideIn 0.6s ease-out forwards; }
        .motion-scale { animation: scaleIn 0.5s ease-out forwards; }
      </style>
    `)
  } else if (framework === 'gsap') {
    scripts.push(`<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>`)
    scripts.push(`<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>`)
  }

  // Convert JSX/TSX to renderable HTML
  // We'll create a simplified preview that shows the visual result
  const previewHTML = generatePreviewFromCode(code, framework)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Animation Preview</title>
  ${styles.join('\n')}
</head>
<body>
  <div id="root"></div>
  ${scripts.join('\n')}
  
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    
    ${framework === 'framer-motion' ? `
      // Simplified framer-motion simulation
      const motion = new Proxy({}, {
        get: (target, prop) => {
          if (prop === 'div' || prop === 'section' || prop === 'button' || prop === 'h1' || prop === 'p' || prop === 'span') {
            return React.forwardRef((props, ref) => {
              const { initial, animate, whileHover, whileTap, transition, variants, ...rest } = props;
              const style = { ...rest.style };
              
              // Apply initial styles if provided
              if (initial) {
                Object.entries(initial).forEach(([key, value]) => {
                  if (key === 'opacity') style.opacity = value;
                  if (key === 'y') style.transform = \`translateY(\${value}px)\`;
                  if (key === 'x') style.transform = \`translateX(\${value}px)\`;
                  if (key === 'scale') style.transform = \`scale(\${value})\`;
                });
              }
              
              // Add animation class
              style.animation = 'fadeIn 0.6s ease-out forwards';
              
              return React.createElement(prop, { ...rest, ref, style });
            });
          }
          return React.createElement('div');
        }
      });
      
      const useScroll = () => ({ scrollYProgress: { current: 0 } });
      const useTransform = () => 0;
      const useSpring = (v) => v;
    ` : ''}
    
    ${framework === 'gsap' ? `
      const gsap = window.gsap || { from: () => {}, fromTo: () => {}, to: () => {} };
    ` : ''}

    ${previewHTML}

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(${componentName}));
  <\/script>
</body>
</html>`
}

/**
 * Generate a simplified preview component from the code
 */
function generatePreviewFromCode(code: string, framework: string): string {
  // Extract text content from the code
  const headings = code.match(/<(?:h[1-6]|motion\.h[1-6])[^>]*>([^<]+)</g) || []
  const paragraphs = code.match(/<(?:p|motion\.p)[^>]*>([^<]+)</g) || []
  const buttons = code.match(/<(?:button|motion\.button)[^>]*>([^<]+)</g) || []

  // Clean extracted text
  const cleanText = (arr: string[]) => arr.map(t => 
    t.replace(/<[^>]+>/g, '').trim()
  ).filter(t => t.length > 0)

  const h1Texts = cleanText(headings.filter(h => h.includes('h1')))
  const h2Texts = cleanText(headings.filter(h => h.includes('h2')))
  const pTexts = cleanText(paragraphs)
  const btnTexts = cleanText(buttons)

  // Build a visual representation
  const sections: string[] = []

  // Hero if detected
  if (code.includes('min-h-screen') || code.includes('hero')) {
    sections.push(`
      <section style="min-height: 80vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%); padding: 2rem; text-align: center;">
        <div style="max-width: 800px;">
          ${h1Texts.length > 0 
            ? `<h1 style="font-size: 3.5rem; font-weight: bold; color: white; margin-bottom: 1.5rem;">${h1Texts[0]}</h1>`
            : '<h1 style="font-size: 3.5rem; font-weight: bold; color: white; margin-bottom: 1.5rem;">Your Heading Here</h1>'
          }
          ${pTexts.length > 0
            ? `<p style="font-size: 1.25rem; color: rgba(255,255,255,0.7); margin-bottom: 2.5rem;">${pTexts[0]}</p>`
            : '<p style="font-size: 1.25rem; color: rgba(255,255,255,0.7); margin-bottom: 2.5rem;">Your description here</p>'
          }
          ${btnTexts.length > 0
            ? `<button style="padding: 1rem 2rem; background: white; color: #1e1b4b; border: none; border-radius: 0.75rem; font-weight: 600; font-size: 1.1rem; cursor: pointer;">${btnTexts[0]}</button>`
            : '<button style="padding: 1rem 2rem; background: white; color: #1e1b4b; border: none; border-radius: 0.75rem; font-weight: 600; font-size: 1.1rem; cursor: pointer;">Get Started</button>'
          }
        </div>
      </section>
    `)
  }

  // Features grid if detected
  if (code.includes('grid') || code.includes('feature')) {
    const featureCount = (code.match(/Feature \d/g) || []).length || 3
    const cards = Array.from({ length: featureCount }, (_, i) => `
      <div style="padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 1rem; background: white;">
        <div style="width: 3rem; height: 3rem; border-radius: 0.75rem; background: linear-gradient(135deg, #a855f7, #ec4899); margin-bottom: 1rem;"></div>
        <h3 style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">Feature ${i + 1}</h3>
        <p style="color: #6b7280; font-size: 0.875rem;">Describe your feature here.</p>
      </div>
    `).join('')

    sections.push(`
      <section style="padding: 4rem 1rem; background: #f9fafb;">
        <div style="max-width: 1100px; margin: 0 auto;">
          ${h2Texts.length > 0
            ? `<h2 style="font-size: 2.25rem; font-weight: bold; text-align: center; margin-bottom: 3rem;">${h2Texts[0]}</h2>`
            : '<h2 style="font-size: 2.25rem; font-weight: bold; text-align: center; margin-bottom: 3rem;">Features</h2>'
          }
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            ${cards}
          </div>
        </div>
      </section>
    `)
  }

  // Pricing if detected
  if (code.includes('pricing') || code.includes('price') || code.includes('plan')) {
    sections.push(`
      <section style="padding: 4rem 1rem;">
        <div style="max-width: 1100px; margin: 0 auto;">
          <h2 style="font-size: 2.25rem; font-weight: bold; text-align: center; margin-bottom: 3rem;">Pricing</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            ${['Starter', 'Pro', 'Enterprise'].map((name, i) => `
              <div style="padding: 2rem; border: 2px solid ${i === 1 ? '#a855f7' : '#e5e7eb'}; border-radius: 1rem; background: white; ${i === 1 ? 'box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);' : ''}">
                <h3 style="font-weight: 600; font-size: 1.25rem; margin-bottom: 0.5rem;">${name}</h3>
                <div style="margin-bottom: 1.5rem;">
                  <span style="font-size: 2.5rem; font-weight: bold;">$${[0, 29, 99][i]}</span>
                  <span style="color: #6b7280;">/mo</span>
                </div>
                <button style="width: 100%; padding: 0.75rem; border-radius: 0.75rem; font-weight: 600; border: none; background: ${i === 1 ? '#a855f7' : '#f3f4f6'}; color: ${i === 1 ? 'white' : '#374151'}; cursor: pointer;">
                  Choose Plan
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `)
  }

  // Default: show a generic component
  if (sections.length === 0) {
    sections.push(`
      <section style="padding: 4rem 1rem;">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
          ${h1Texts.length > 0
            ? `<h1 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1.5rem;">${h1Texts[0]}</h1>`
            : `<h1 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1.5rem;">Your Component</h1>`
          }
          ${h2Texts.length > 0
            ? `<h2 style="font-size: 1.5rem; color: #6b7280; margin-bottom: 2rem;">${h2Texts[0]}</h2>`
            : ''
          }
          <div style="display: flex; gap: 1rem; justify-content: center;">
            ${(btnTexts.length > 0 ? btnTexts : ['Button 1', 'Button 2']).slice(0, 2).map(t => 
              `<button style="padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; border: 1px solid #e5e7eb; background: white; cursor: pointer;">${t}</button>`
            ).join('')}
          </div>
        </div>
      </section>
    `)
  }

  return sections.join('\n')
}
