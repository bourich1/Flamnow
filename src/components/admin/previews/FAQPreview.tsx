'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQPreviewProps {
  question: string
  answer: string
  focusedField?: string | null
}

export default function FAQPreview({ question, answer, focusedField }: FAQPreviewProps) {
  const getHighlight = (field: string) => {
    return focusedField === field ? 'ring-2 ring-[#ED3F27] rounded transition-all' : ''
  }
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 text-left w-full max-w-lg mx-auto shadow-2xl">
      <div className="faq-row">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center text-left text-white hover:text-[#ED3F27] transition-colors duration-300"
        >
          <span className={`text-sm sm:text-base font-bold pr-4 font-body ${getHighlight('formQuestion')}`}>
            {question || 'Frequently Asked Question?'}
          </span>
          <ChevronDown
            className={`h-4.5 w-4.5 text-white/40 shrink-0 transition-transform duration-300 ${
              isOpen ? 'rotate-180 text-[#ED3F27]' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={true}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
              className="overflow-hidden"
            >
              <p className={`text-white/60 text-xs sm:text-sm leading-relaxed mt-3 pl-1 pr-4 ${getHighlight('formAnswer')}`}>
                {answer || 'Write the answer to your FAQ here.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
