'use client'

import { useState, useEffect } from 'react'
import {
  Clock,
  GitBranch,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronUp,
  User,
  Diff,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Version {
  id: string
  version_number: number
  title: string
  description?: string
  code: string
  created_by: string
  created_at: string
  is_current: boolean
}

interface VersionHistoryProps {
  projectId: string
  currentCode: string
  onRestore: (code: string) => void
}

export function VersionHistory({
  projectId,
  currentCode,
  onRestore,
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null)
  const [previewCode, setPreviewCode] = useState<string | null>(null)

  useEffect(() => {
    fetchVersions()
  }, [projectId])

  const fetchVersions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/v1/projects/${projectId}/versions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      const data = await response.json()
      setVersions(data.versions)
    } catch (error) {
      console.error('Failed to fetch versions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestore = async (version: Version) => {
    try {
      await fetch(`/api/v1/projects/${projectId}/versions/${version.id}/restore`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      onRestore(version.code)
      toast.success('Version restored!')
      fetchVersions()
    } catch (error) {
      toast.error('Failed to restore version')
    }
  }

  const handleSaveVersion = async () => {
    try {
      await fetch(`/api/v1/projects/${projectId}/versions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          code: currentCode,
          title: `Version ${versions.length + 1}`,
        }),
      })
      toast.success('Version saved!')
      fetchVersions()
    } catch (error) {
      toast.error('Failed to save version')
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedVersion(expandedVersion === id ? null : id)
  }

  const showPreview = (code: string) => {
    setPreviewCode(code)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Version History
          </CardTitle>
          <Button size="sm" onClick={handleSaveVersion}>
            Save Version
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[calc(100vh-200px)]">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No versions yet</p>
            <p className="text-xs">Save a version to track changes</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-4">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className="relative pl-10"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-2.5 top-4 w-3 h-3 rounded-full border-2 ${
                      version.is_current
                        ? 'bg-primary border-primary'
                        : 'bg-background border-border'
                    }`}
                  />

                  <div
                    className={`p-3 rounded-lg border transition-all ${
                      version.is_current
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {version.title}
                          </span>
                          {version.is_current && (
                            <Badge variant="default" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {version.created_by}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(version.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleExpand(version.id)}
                        >
                          {expandedVersion === version.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        {!version.is_current && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRestore(version)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedVersion === version.id && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="h-24 rounded bg-muted/30 p-2 overflow-auto">
                          <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap">
                            {version.code.slice(0, 300)}...
                          </pre>
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => showPreview(version.code)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {previewCode && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl h-[80vh] bg-background rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold">Version Preview</h3>
                <Button variant="ghost" onClick={() => setPreviewCode(null)}>
                  Close
                </Button>
              </div>
              <iframe
                srcDoc={previewCode}
                className="w-full h-full border-0"
                title="Preview"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
