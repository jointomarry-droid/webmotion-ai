'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, MouseEvent } from 'react'

export function CardTiltDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100 rounded-xl" style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-64 h-40 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center cursor-pointer"
      >
        <div style={{ transform: 'translateZ(50px)' }} className="text-center">
          <span className="text-4xl">🃏</span>
          <p className="text-white font-bold mt-2">3D Tilt Card</p>
        </div>
      </motion.div>
    </div>
  )
}

export const CardTiltCode = `import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, MouseEvent } from 'react'

export function CardTilt({ children }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div style={{ transform: 'translateZ(50px)' }}>
          {children}
        </div>
      </motion.div>
    </div>
  )
}`
