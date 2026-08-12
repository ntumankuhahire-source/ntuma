'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const fadeUp: any = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: 'easeOut' as const },
  }),
}

export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="Ntuma hero — vendor to door delivery"
      className="relative min-h-[calc(100vh-84px)] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <picture className="w-full h-full">
          <source media="(min-width: 768px)" srcSet="/laptop.png" />
          <img
            src="/phone.png"
            alt="Ntuma delivery service"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        {/* Dark gradient overlay to make text pop */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/50"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-6 sm:px-10 py-16 sm:py-24 text-center">
        <motion.div
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            custom={0}
            className="font-display font-semibold text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-8"
          >
            <span className="text-white block mb-2">Tell us what you need.</span>
            <span className="text-yellow-400 block">We bring it home.</span>
          </motion.h1>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            custom={1}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <Link href="/order" className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-8 rounded-full transition-colors">
              Order now
            </Link>
            <a href="#contact" className="bg-transparent hover:bg-yellow-400/10 text-yellow-400 border border-yellow-400 font-medium py-3 px-8 rounded-full transition-colors backdrop-blur-sm">
              Contact us
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
