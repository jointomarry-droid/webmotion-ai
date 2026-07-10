'use client'

import { useState } from 'react'
import {
  Download,
  FileCode,
  FileArchive,
  Copy,
  Check,
  Folder,
  Package,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
  code: string
  assets?: { name: string; content: string }[]
}

type ExportFormat = 'html' | 'nextjs' | 'react' | 'zip'

export function ExportModal({
  isOpen,
  onClose,
  projectName,
  code,
  assets = [],
}: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('html')
  const [isExporting, setIsExporting] = useState(false)

  const formats = [
    {
      id: 'html' as ExportFormat,
      name: 'HTML/CSS/JS',
      description: 'Single HTML file with embedded styles and scripts',
      icon: FileCode,
      badge: 'Simple',
    },
    {
      id: 'nextjs' as ExportFormat,
      name: 'Next.js Project',
      description: 'Complete Next.js project with TypeScript',
      icon: Package,
      badge: 'Recommended',
      recommended: true,
    },
    {
      id: 'react' as ExportFormat,
      name: 'React Component',
      description: 'Standalone React component file',
      icon: FileCode,
      badge: 'Component',
    },
    {
      id: 'zip' as ExportFormat,
      name: 'Download ZIP',
      description: 'Compressed archive with all files',
      icon: FileArchive,
      badge: 'Archive',
    },
  ]

  const handleExport = async () => {
    setIsExporting(true)

    try {
      if (selectedFormat === 'html') {
        const blob = new Blob([code], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}.html`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('Downloaded!')
      } else if (selectedFormat === 'zip') {
        // In production, this would use a library like JSZip
        toast.success('ZIP download coming soon!')
      } else {
        toast.success('Export format coming soon!')
      }
    } catch (error) {
      toast.error('Export failed')
    } finally {
      setIsExporting(false)
      onClose()
    }
  }

  const handleCopyCode = () => {
    copyToClipboard(code)
    toast.success('Code copied!')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Project"
      size="lg"
    >
      <div className="space-y-6">
        {/* Project Info */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Folder className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{projectName}</p>
              <p className="text-sm text-muted-foreground">
                {code.length.toLocaleString()} characters
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopyCode}>
            <Copy className="h-4 w-4 mr-1" />
            Copy Code
          </Button>
        </div>

        {/* Format Selection */}
        <div>
          <p className="text-sm font-medium mb-3">Select Export Format</p>
          <div className="grid gap-3">
            {formats.map((format) => (
              <div
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedFormat === format.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <format.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{format.name}</p>
                      {format.recommended && (
                        <Badge variant="default" className="text-xs">
                          {format.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format.description}
                    </p>
                  </div>
                  {selectedFormat === format.id && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        {selectedFormat === 'html' && (
          <div>
            <p className="text-sm font-medium mb-2">Preview</p>
            <div className="h-32 rounded-xl border border-border bg-muted/30 p-3 overflow-auto">
              <pre className="text-xs text-muted-foreground font-mono">
                {code.slice(0, 500)}...
              </pre>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} isLoading={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            Export {formats.find((f) => f.id === selectedFormat)?.name}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
