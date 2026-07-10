'use client'

import { motion } from 'framer-motion'

export function TextCharacterAnimationDemo() {
  const text = "Hello World"
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const child = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: 'blur(10px)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', damping: 12 }
    }
  }

  return (
    <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100 rounded-xl">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex"
      >
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            variants={child}
            className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

export const TextCharacterAnimationCode = `import { motion } from 'framer-motion'

export function TextCharacterAnimation({ text }) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const child = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: 'blur(10px)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', damping: 12 }
    }
  }

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="flex">
      {text.split('').map((char, index) => (
        <motion.span key={index} variants={child}>
          {char === ' ' ? '\\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  )
}`
