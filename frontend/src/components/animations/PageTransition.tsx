'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export function PageTransitionDemo() {
  const [currentPage, setCurrentPage] = useState(0)
  const pages = [
    { title: 'Home', color: 'from-rose-500 to-pink-500', icon: '🏠' },
    { title: 'About', color: 'from-amber-500 to-orange-500', icon: 'ℹ️' },
    { title: 'Contact', color: 'from-emerald-500 to-teal-500', icon: '📧' },
  ]

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  const [direction, setDirection] = useState(0)

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentPage((prev) => {
      const next = prev + newDirection
      if (next < 0) return pages.length - 1
      if (next >= pages.length) return 0
      return next
    })
  }

  return (
    <div className="h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
      <div className="relative w-64 h-40">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${pages[currentPage].color} flex flex-col items-center justify-center shadow-xl`}
          >
            <span className="text-5xl mb-2">{pages[currentPage].icon}</span>
            <h3 className="text-xl font-bold text-white">{pages[currentPage].title}</h3>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => paginate(-1)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={() => paginate(1)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export const PageTransitionCode = `import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export function PageTransition({ pages }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState(0)

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  const paginate = (newDirection) => {
    setDirection(newDirection)
    setCurrentPage((prev) => (prev + newDirection + pages.length) % pages.length)
  }

  return (
    <AnimatePresence initial={false} custom={direction} mode="wait">
      <motion.div
        key={currentPage}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {pages[currentPage]}
      </motion.div>
    </AnimatePresence>
  )
}`
