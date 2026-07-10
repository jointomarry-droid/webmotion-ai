'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Code2, Eye, Download, Copy, Check, Globe, FileCode, Settings, Sparkles } from 'lucide-react'
import { WebsiteGenerator } from '@/components/ai'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import toast from 'react-hot-toast'

export default function GeneratorPage() {
  const [generatedCode, setGeneratedCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('preview')

  const handleCodeGenerated = (code: string) => {
    setGeneratedCode(code)
    // Try to parse JSON if it's a full project
    try {
      const parsed = JSON.parse(code)
      if (typeof parsed === 'object' && parsed['package.json']) {
        // It's a full project JSON
        setActiveTab('files')
      }
    } catch {
      // Not JSON, treat as single file
    }
  }

  const handleCopyCode = async (code?: string) => {
    const codeToCopy = code || generatedCode
    if (!codeToCopy) return
    
    await navigator.clipboard.writeText(codeToCopy)
    setCopied(true)
    toast.success('Code copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadCode = (code?: string, filename: string = 'website.tsx') => {
    const codeToDownload = code || generatedCode
    if (!codeToDownload) return
    
    const blob = new Blob([codeToDownload], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Code downloaded!')
  }

  const handleDownloadAll = (files: Record<string, string>) => {
    // Create a zip-like download (just download as JSON for now)
    const json = JSON.stringify(files, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'webmotion-project.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Project downloaded as JSON!')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-semibold">AI Website Generator</h1>
                <p className="text-xs text-muted-foreground">
                  Describe your website and get a complete Next.js project with animations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(v: string) => setActiveTab(v)} className="hidden md:flex">
                <TabsList className="grid w-auto grid-cols-3 bg-transparent p-0">
                  <TabsTrigger value="preview" className="text-xs px-3">
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="code" className="text-xs px-3">
                    <Code2 className="h-3 w-3 mr-1" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="files" className="text-xs px-3">
                    <FileCode className="h-3 w-3 mr-1" />
                    Files
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* Mobile Tab Bar */}
          <div className="md:hidden h-10 border-t border-border">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(v: string) => setActiveTab(v)}>
              <TabsList className="flex h-full w-full bg-transparent p-0">
                <TabsTrigger value="preview" className="flex-1 text-xs py-1">Preview</TabsTrigger>
                <TabsTrigger value="code" className="flex-1 text-xs py-1">Code</TabsTrigger>
                <TabsTrigger value="files" className="flex-1 text-xs py-1">Files</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Chat Panel */}
        <div className="w-full lg:w-1/2 border-r border-border flex flex-col min-h-0">
          <WebsiteGenerator onCodeGenerated={handleCodeGenerated} />
        </div>

        {/* Preview/Code/Files Panel */}
        <div className="hidden lg:flex lg:w-1/2 flex-col min-h-0">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(v: string) => setActiveTab(v)} className="flex-1 flex flex-col min-h-0">
            <div className="border-b border-border px-4">
              <TabsList>
                <TabsTrigger value="preview" className="text-xs">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="text-xs">
                  <Code2 className="h-4 w-4 mr-1" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="files" className="text-xs">
                  <FileCode className="h-4 w-4 mr-1" />
                  Files
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="preview" className="flex-1 m-0 min-h-0">
              <WebsitePreview code={generatedCode} />
            </TabsContent>

            <TabsContent value="code" className="flex-1 p-4 m-0 min-h-0">
              <div className="h-full rounded-xl border border-border bg-slate-950 overflow-auto">
                {generatedCode ? (
                  <div className="relative">
                    <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-slate-900/95 backdrop-blur border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        <span className="ml-3 text-xs text-slate-400">page.tsx</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleCopyCode()}
                        >
                          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copied ? 'Copied' : 'Copy'}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDownloadCode()}
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <pre className="p-4 text-sm font-mono text-slate-300 overflow-x-auto">
                      <code>{generatedCode}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500">
                    <div className="text-center">
                      <Code2 className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p>Your generated website code will appear here</p>
                      <p className="text-sm mt-2 text-slate-600">
                        Describe your website in the chat to generate a complete project
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="files" className="flex-1 p-4 m-0 min-h-0">
              <div className="h-full rounded-xl border border-border bg-slate-950 overflow-hidden">
                <WebsiteFilesView 
                  code={generatedCode}
                  onCopy={handleCopyCode}
                  onDownload={handleDownloadCode}
                  onDownloadAll={handleDownloadAll}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function WebsitePreview({ code }: { code: string }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Live Preview (Simulated)</span>
        <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          ✓ Responsive
        </span>
      </div>
      <div className="flex-1 bg-white dark:bg-gray-900 relative">
        <iframe
          srcDoc={generatePreviewHTML(code)}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="Website Preview"
        />
      </div>
    </div>
  )
}

function WebsiteFilesView({ 
  code, 
  onCopy, 
  onDownload, 
  onDownloadAll 
}: { 
  code: string
  onCopy: (code: string) => void
  onDownload: (code: string, filename?: string) => void
  onDownloadAll: (files: Record<string, string>) => void
}) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Parse files from generated code
  let files: Record<string, string> = {}
  try {
    const parsed = JSON.parse(code)
    if (typeof parsed === 'object' && parsed['package.json']) {
      files = parsed
    }
  } catch {
    // Not JSON, treat as single file
    if (code.trim()) {
      files['src/app/page.tsx'] = code
    }
  }

  const fileEntries = Object.entries(files)

  if (fileEntries.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        <div className="text-center">
          <FileCode className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p>No files generated yet</p>
          <p className="text-sm mt-2">Describe a website in the chat to generate files</p>
        </div>
      </div>
    )
  }

  const handleCopy = async (codeToCopy: string) => {
    await onCopy(codeToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between p-3 border-b border-border bg-background">
        <h3 className="font-medium text-sm">Project Files ({fileEntries.length})</h3>
        <Button size="sm" variant="outline" onClick={() => onDownloadAll(files)}>
          <Download className="h-3 w-3 mr-1" />
          Download All
        </Button>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree */}
        <div className="w-64 border-r border-border bg-muted/30 overflow-y-auto p-2">
          <div className="space-y-1">
            {fileEntries.map(([path]) => (
              <button
                key={path}
                onClick={() => setSelectedFile(path)}
                className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors ${
                  selectedFile === path ? 'bg-primary text-primary-foreground' : ''
                }`}
              >
                <FileCode className="h-3 w-3 inline mr-1" />
                {path}
              </button>
            ))}
          </div>
        </div>

        {/* File Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedFile && files[selectedFile] && (
            <>
              <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-slate-900/95 backdrop-blur border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-xs text-slate-400">{selectedFile}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCopy(files[selectedFile] || '')}
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onDownload(files[selectedFile] || '', selectedFile.split('/').pop() || 'file.ts')}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <pre className="flex-1 p-4 text-sm font-mono text-slate-300 overflow-auto bg-slate-950">
                <code>{files[selectedFile]}</code>
              </pre>
            </>
          )}
          {!selectedFile && (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <p>Select a file to view its content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function generatePreviewHTML(pageCode: string): string {
  let fileCount = 1
  try {
    if (pageCode && pageCode.trim()) {
      const parsed = JSON.parse(pageCode)
      if (typeof parsed === 'object' && parsed['package.json']) {
        fileCount = Object.keys(parsed).length
      }
    }
  } catch {
    // Not valid JSON, use default
  }
  
  return `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script crossorigin src="https://esm.sh/react@19"></script>
  <script crossorigin src="https://esm.sh/react-dom@19/client"></script>
  <script src="https://esm.sh/framer-motion@11"></script>
  <script type="module">
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import { motion } from 'framer-motion'
    
    const App = () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              Website Generated Successfully!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
            >
              Your Next.js project has been generated with ${fileCount} files.
              Check the "Files" tab to see all generated files, or "Code" tab for the main component.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold text-lg"
            >
              View Generated Files
            </motion.button>
          </div>
        </section>
      </div>
    )
    
    const root = ReactDOM.createRoot(document.getElementById('root'))
    root.render(<App />)
  </script>
</body>
</html>`
}