'use client'

import { motion } from 'framer-motion'

export function MorphingShapeDemo() {
  return (
    <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl">
      <div className="relative">
        <motion.div
          className="w-32 h-32 bg-gradient-to-br from-pink-500 to-rose-500"
          animate={{
            borderRadius: [
              '20% 50% 50% 20%',
              '50% 20% 20% 50%',
              '50% 50% 20% 50%',
              '20% 50% 50% 20%',
            ],
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1, 0.9, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-rose-400 to-pink-400 opacity-50"
          animate={{
            borderRadius: [
              '50% 20% 50% 20%',
              '20% 50% 20% 50%',
              '50% 20% 50% 20%',
              '50% 50% 50% 20%',
            ],
            rotate: [360, 270, 180, 90, 0],
            scale: [0.9, 1, 1.1, 1, 0.9],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  )
}

export const MorphingShapeCode = `import { motion } from 'framer-motion'

export function MorphingShape() {
  return (
    <motion.div
      className="w-32 h-32 bg-gradient-to-br from-pink-500 to-rose-500"
      animate={{
        borderRadius: [
          '20% 50% 50% 20%',
          '50% 20% 20% 50%',
          '50% 50% 20% 50%',
          '20% 50% 50% 20%',
        ],
        rotate: [0, 90, 180, 270, 360],
        scale: [1, 1.1, 1, 0.9, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}`
