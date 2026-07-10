'use client'

import { motion } from 'framer-motion'

export function StaggeredGridDemo() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', damping: 15 }
    },
  }

  const colors = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-amber-400 to-amber-600',
    'from-emerald-400 to-emerald-600',
    'from-cyan-400 to-cyan-600',
    'from-rose-400 to-rose-600',
    'from-indigo-400 to-indigo-600',
    'from-teal-400 to-teal-600',
  ]

  return (
    <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-3"
      >
        {colors.map((color, index) => (
          <motion.div
            key={index}
            variants={item}
            className={`w-20 h-20 rounded-xl bg-gradient-to-br ${color} shadow-lg cursor-pointer`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          />
        ))}
      </motion.div>
    </div>
  )
}

export const StaggeredGridCode = `import { motion } from 'framer-motion'

export function StaggeredGrid() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', damping: 15 }
    },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-3 gap-3">
      {[...Array(9)].map((_, index) => (
        <motion.div key={index} variants={item} className="w-20 h-20 rounded-xl bg-primary" />
      ))}
    </motion.div>
  )
}`
