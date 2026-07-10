'use client'

import { ImgHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    const initials = fallback || alt?.charAt(0)?.toUpperCase() || '?'

    if (!src) {
      return (
        <div
          className={cn(
            'relative flex shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary to-purple-500',
            sizeStyles[size],
            className
          )}
        >
          <span className="flex h-full w-full items-center justify-center text-white font-medium">
            {initials}
          </span>
        </div>
      )
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full object-cover',
          sizeStyles[size],
          className
        )}
        {...props}
      />
    )
  }
)

Avatar.displayName = 'Avatar'
