'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function AppleScrollRevealDemo() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100])

  return (
    <div ref={ref} className="h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
      <motion.div
        style={{ opacity, scale, y }}
        className="text-center"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
          <span className="text-4xl text-white">🍎</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Apple-Style Reveal</h3>
        <p className="text-gray-600">Scroll to see the animation</p>
      </motion.div>
    </div>
  )
}

export const AppleScrollRevealCode = `import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function AppleScrollReveal({ children }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100])

  return (
    <motion.div ref={ref} style={{ opacity, scale, y }}>
      {children}
    </motion.div>
  )
}`
