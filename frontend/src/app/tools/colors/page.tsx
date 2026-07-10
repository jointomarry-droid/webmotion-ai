'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Copy,
  RefreshCw,
  Download,
  Lock,
  Unlock,
  Palette,
  Check,
  Shuffle,
  Plus,
  Trash2,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Color {
  hex: string
  locked: boolean
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

function generateRandomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

export default function ColorPalettePage() {
  const [colors, setColors] = useState<Color[]>([
    { hex: '#6366f1', locked: false },
    { hex: '#8b5cf6', locked: false },
    { hex: '#a855f7', locked: false },
    { hex: '#d946ef', locked: false },
    { hex: '#ec4899', locked: false },
  ])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const generatePalette = () => {
    setColors((prev) =>
      prev.map((color) =>
        color.locked ? color : { hex: generateRandomColor(), locked: false }
      )
    )
  }

  const handleCopy = (hex: string, index: number) => {
    copyToClipboard(hex)
    setCopiedIndex(index)
    toast.success(`Copied ${hex}`)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleToggleLock = (index: number) => {
    setColors((prev) =>
      prev.map((color, i) =>
        i === index ? { ...color, locked: !color.locked } : color
      )
    )
  }

  const handleAddColor = () => {
    if (colors.length < 10) {
      setColors((prev) => [...prev, { hex: generateRandomColor(), locked: false }])
    }
  }

  const handleRemoveColor = (index: number) => {
    if (colors.length > 2) {
      setColors((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleExportCSS = () => {
    const css = `:root {\n${colors
      .map((c, i) => `  --color-${i + 1}: ${c.hex};`)
      .join('\n')}\n}`
    copyToClipboard(css)
    toast.success('CSS variables copied!')
  }

  const handleExportTailwind = () => {
    const config = `colors: {\n  primary: {\n${colors
      .map((c, i) => `    ${(i + 1) * 100}: '${c.hex}',`)
      .join('\n')}\n  }\n}`
    copyToClipboard(config)
    toast.success('Tailwind config copied!')
  }

  // Generate color variations
  const getColorVariations = (hex: string) => {
    const hsl = hexToHSL(hex)
    return [
      { name: '50', hex: `hsl(${hsl.h}, ${hsl.s}%, 98%)` },
      { name: '100', hex: `hsl(${hsl.h}, ${hsl.s}%, 95%)` },
      { name: '200', hex: `hsl(${hsl.h}, ${hsl.s}%, 90%)` },
      { name: '300', hex: `hsl(${hsl.h}, ${hsl.s}%, 80%)` },
      { name: '400', hex: `hsl(${hsl.h}, ${hsl.s}%, 65%)` },
      { name: '500', hex: hex },
      { name: '600', hex: `hsl(${hsl.h}, ${hsl.s}%, 45%)` },
      { name: '700', hex: `hsl(${hsl.h}, ${hsl.s}%, 35%)` },
      { name: '800', hex: `hsl(${hsl.h}, ${hsl.s}%, 25%)` },
      { name: '900', hex: `hsl(${hsl.h}, ${hsl.s}%, 15%)` },
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Color Palette Generator</h1>
                <p className="text-muted-foreground">
                  Generate beautiful color palettes for your projects
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleExportCSS}>
                Export CSS
              </Button>
              <Button variant="outline" onClick={handleExportTailwind}>
                Export Tailwind
              </Button>
              <Button onClick={generatePalette}>
                <Shuffle className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Color Palette */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="overflow-hidden">
            <div className="flex h-64">
              {colors.map((color, index) => (
                <motion.div
                  key={index}
                  className="flex-1 relative group cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleCopy(color.hex, index)}
                  whileHover={{ flex: 1.5 }}
                >
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: getContrastColor(color.hex) }}
                  >
                    <p className="text-2xl font-bold mb-2">{color.hex}</p>
                    <p className="text-sm opacity-70">
                      {copiedIndex === index ? 'Copied!' : 'Click to copy'}
                    </p>
                  </div>

                  {/* Lock/Remove buttons */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleLock(index)
                      }}
                      className="p-1 rounded bg-black/20 hover:bg-black/30 transition-colors"
                    >
                      {color.locked ? (
                        <Lock className="h-4 w-4" style={{ color: getContrastColor(color.hex) }} />
                      ) : (
                        <Unlock className="h-4 w-4" style={{ color: getContrastColor(color.hex) }} />
                      )}
                    </button>
                    {colors.length > 2 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveColor(index)
                        }}
                        className="p-1 rounded bg-black/20 hover:bg-black/30 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" style={{ color: getContrastColor(color.hex) }} />
                      </button>
                    )}
                  </div>

                  {/* Color value */}
                  <div
                    className="absolute bottom-2 left-2 text-xs font-mono opacity-70"
                    style={{ color: getContrastColor(color.hex) }}
                  >
                    {color.hex}
                  </div>
                </motion.div>
              ))}

              {/* Add Color Button */}
              {colors.length < 10 && (
                <button
                  onClick={handleAddColor}
                  className="w-16 flex items-center justify-center bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </button>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Color Variations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Color Variations</CardTitle>
              <CardDescription>
                Shades and tints for each color in your palette
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {colors.map((color, colorIndex) => (
                  <div key={colorIndex}>
                    <p className="text-sm font-medium mb-2">
                      Color {colorIndex + 1}: {color.hex}
                    </p>
                    <div className="flex gap-1 h-12">
                      {getColorVariations(color.hex).map((variation) => (
                        <div
                          key={variation.name}
                          className="flex-1 rounded cursor-pointer hover:scale-110 transition-transform relative group"
                          style={{ backgroundColor: variation.hex }}
                          onClick={() => handleCopy(variation.hex, colorIndex)}
                        >
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-mono opacity-0 group-hover:opacity-100"
                            style={{ color: getContrastColor(variation.hex) }}
                          >
                            {variation.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Keyboard Shortcuts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <span>
                  <kbd className="px-2 py-1 rounded bg-muted font-mono">Space</kbd>
                  {' '}Generate new palette
                </span>
                <span>
                  <kbd className="px-2 py-1 rounded bg-muted font-mono">Click</kbd>
                  {' '}Copy color
                </span>
                <span>
                  <kbd className="px-2 py-1 rounded bg-muted font-mono">Lock</kbd>
                  {' '}Preserve color
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
