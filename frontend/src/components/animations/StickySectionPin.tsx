'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function StickySectionPinDemo() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 0])

  return (
    <div ref={containerRef} className="h-[600px] relative">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-900 to-teal-900 rounded-xl">
        <motion.div style={{ scale, opacity }} className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl">
            <span className="text-5xl">📌</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">Sticky Section Pin</h3>
          <p className="text-emerald-200">Scroll to see the pin effect</p>
          <div className="mt-8 flex gap-4 justify-center">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                style={{ opacity: useTransform(scrollYProgress, [i * 0.2, i * 0.3], [0, 1]) }}
                className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export const StickySectionPinCode = `import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function StickySectionPin({ children }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 0])

  return (
    <div ref={containerRef} className="h-[300vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <motion.div style={{ scale, opacity }}>
          {children}
        </motion.div>
      </div>
    </div>
  )
}`
