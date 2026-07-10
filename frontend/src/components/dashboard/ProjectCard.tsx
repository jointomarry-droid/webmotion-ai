'use client'

import { motion } from 'framer-motion'
import { MoreVertical, ExternalLink, GitBranch, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  index?: number
}

const statusStyles = {
  draft: 'bg-gray-500/10 text-gray-600',
  building: 'bg-yellow-500/10 text-yellow-600',
  deploying: 'bg-blue-500/10 text-blue-600',
  success: 'bg-green-500/10 text-green-600',
  failed: 'bg-red-500/10 text-red-600',
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card hover className="group">
        {/* Preview */}
        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 rounded-t-2xl">
          {project.deployment_url ? (
            <img
              src={`https://api.microlink.io/?url=${project.deployment_url}&screenshot=true&meta=false&embed=screenshot.url`}
              alt={project.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Eye className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={statusStyles[project.deployment_status]}>
              {project.deployment_status}
            </Badge>
          </div>

          {/* Actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link href={`/editor/${project.id}`}>
              <Button size="icon" variant="secondary">
                <GitBranch className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {project.description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {formatDate(project.updated_at)}
            </span>
            {project.deployment_url && (
              <a
                href={project.deployment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                View Live
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
