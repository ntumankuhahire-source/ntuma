'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const fadeUp: any = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: 'easeOut' as const },
  }),
}

/** Placeholder stats — client to confirm values before launch */
const stats = [
  { value: '50+', label: 'Vendors in network' },
  { value: '~2hrs', label: 'Avg. delivery time' },
  { value: '3', label: 'Districts in Kigali' },
]

export default function AboutUs() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-pad bg-white"
    >
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >
        {/* Left: copy */}
        <motion.div
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="order-2 lg:order-1"
        >
          <motion.p variants={fadeUp} custom={0} className="eyebrow">
            OUR STORY
          </motion.p>
          <motion.h2
            id="about-heading"
            variants={fadeUp}
            custom={1}
            className="section-heading mb-6"
          >
            Built for how Kigali shops.
          </motion.h2>

          <motion.div
            variants={fadeUp}
            custom={2}
            className="font-body text-base text-slate-600 leading-relaxed space-y-4 mb-10"
          >
            <p>
              Ntuma is your trusted delivery partner connecting you with vendors across Kigali. 
              Whether you need daily groceries, supermarket essentials, or any other items, 
              we handle the shopping and bring it straight to your door. Set your budget, 
              and we'll handle the rest with real-time WhatsApp updates.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-mono text-2xl md:text-3xl font-medium text-emerald-700">
                  {stat.value}
                </span>
                <span className="font-body text-xs text-slate-500 leading-snug">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: image */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' as const }}
          className="order-1 lg:order-2 relative aspect-[4/3] w-full rounded-card overflow-hidden border border-slate-100"
        >
          <Image
            src="/ChatGPT Image Aug 5, 2026, 11_32_02 PM.png"
            alt="About Ntuma"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            loading="lazy"
          />
          {/* Subtle emerald accent bar */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-700 z-10"
          />
        </motion.div>
      </div>
    </section>
  )
}
