'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

export function ParallaxBackgroundDemo() {
  const { scrollYProgress } = useScroll()
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <div className="h-[400px] relative overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 rounded-xl">
      {/* Stars layer */}
      <motion.div style={{ y: y1 }} className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </motion.div>

      {/* Mountains layer */}
      <motion.div style={{ y: y2 }} className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 200" className="w-full">
          <path
            d="M0,200 L0,120 Q150,40 300,100 Q450,160 600,80 Q750,0 900,60 Q1050,120 1200,80 L1200,200 Z"
            fill="rgba(99, 102, 241, 0.3)"
          />
        </svg>
      </motion.div>

      {/* Foreground layer */}
      <motion.div style={{ y: y3 }} className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 150" className="w-full">
          <path
            d="M0,150 L0,100 Q200,60 400,90 Q600,120 800,70 Q1000,20 1200,60 L1200,150 Z"
            fill="rgba(236, 72, 153, 0.4)"
          />
        </svg>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-3xl font-bold text-white text-center drop-shadow-lg">
          Parallax Layers
        </h3>
      </div>
    </div>
  )
}

export const ParallaxBackgroundCode = `import { motion, useScroll, useTransform } from 'framer-motion'

export function ParallaxBackground() {
  const { scrollYProgress } = useScroll()
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Stars layer - moves fastest */}
      <motion.div style={{ y: y1 }} className="absolute inset-0">
        {/* Star elements */}
      </motion.div>

      {/* Mountains layer - moves medium */}
      <motion.div style={{ y: y2 }} className="absolute bottom-0">
        {/* Mountain SVG */}
      </motion.div>

      {/* Foreground layer - moves slowest */}
      <motion.div style={{ y: y3 }} className="absolute bottom-0">
        {/* Foreground elements */}
      </motion.div>
    </div>
  )
}`
