'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Code,
  Eye,
  Settings,
  Layers,
  Smartphone,
  Monitor,
  Tablet,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'

type DeviceView = 'desktop' | 'tablet' | 'mobile'

const DEFAULT_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Animation Playground</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      font-family: system-ui, sans-serif;
      overflow: hidden;
    }
    
    .container {
      text-align: center;
    }
    
    .box {
      width: 120px;
      height: 120px;
      background: linear-gradient(45deg, #ff6b6b, #feca57);
      border-radius: 20px;
      margin: 0 auto 2rem;
      animation: float 3s ease-in-out infinite;
      box-shadow: 0 20px 40px rgba(255, 107, 107, 0.3);
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) rotate(5deg);
      }
    }
    
    h1 {
      color: white;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      animation: fadeInUp 0.8s ease-out;
    }
    
    p {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.1rem;
      animation: fadeInUp 0.8s ease-out 0.2s backwards;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="box"></div>
    <h1>Hello, WebMotion!</h1>
    <p>Start editing to see your animation come to life</p>
  </div>
</body>
</html>`

export default function PlaygroundPage() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [isPlaying, setIsPlaying] = useState(true)
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showConsole, setShowConsole] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    updatePreview()
  }, [code])

  const updatePreview = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc) {
        doc.open()
        doc.write(code)
        doc.close()
      }
    }
  }

  const handleCopyCode = () => {
    copyToClipboard(code)
    toast.success('Code copied!')
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'animation.html'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Downloaded!')
  }

  const handleReset = () => {
    setCode(DEFAULT_CODE)
    toast.success('Code reset!')
  }

  const getDeviceWidth = () => {
    switch (deviceView) {
      case 'mobile':
        return 'max-w-[375px]'
      case 'tablet':
        return 'max-w-[768px]'
      default:
        return 'max-w-full'
    }
  }

  const templates = [
    {
      name: 'Gradient Animation',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
    }
    
    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    h1 {
      color: white;
      font-size: 3rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  <h1>Gradient Animation</h1>
</body>
</html>`,
    },
    {
      name: 'Spinner',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a2e;
    }
    
    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255,255,255,0.1);
      border-top-color: #ff6b6b;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="spinner"></div>
</body>
</html>`,
    },
    {
      name: 'Bounce',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f0f23;
    }
    
    .ball {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      animation: bounce 0.6s ease-in-out infinite alternate;
    }
    
    @keyframes bounce {
      from {
        transform: translateY(0);
        box-shadow: 0 20px 20px rgba(102, 126, 234, 0.4);
      }
      to {
        transform: translateY(-80px);
        box-shadow: 0 40px 40px rgba(102, 126, 234, 0.2);
      }
    }
  </style>
</head>
<body>
  <div class="ball"></div>
</body>
</html>`,
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-full mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <span className="font-semibold">Code Playground</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Device Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
                <Button
                  size="sm"
                  variant={deviceView === 'desktop' ? 'default' : 'ghost'}
                  onClick={() => setDeviceView('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={deviceView === 'tablet' ? 'default' : 'ghost'}
                  onClick={() => setDeviceView('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={deviceView === 'mobile' ? 'default' : 'ghost'}
                  onClick={() => setDeviceView('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>

              <Button size="sm" variant="ghost" onClick={handleCopyCode}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="w-1/2 flex flex-col border-r border-border">
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-muted-foreground ml-2">index.html</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm bg-muted/30 resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 flex flex-col">
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Preview</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <div
            ref={containerRef}
            className={`flex-1 bg-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
          >
            <div className={`h-full mx-auto ${getDeviceWidth()} transition-all duration-300`}>
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                title="Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Templates Bar */}
      <div className="border-t border-border bg-muted/30">
        <div className="px-4 py-2">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quick Templates:</span>
            {templates.map((template) => (
              <Button
                key={template.name}
                size="sm"
                variant="ghost"
                onClick={() => setCode(template.code)}
              >
                {template.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
