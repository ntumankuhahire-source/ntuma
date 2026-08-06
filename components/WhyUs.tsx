'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  ShoppingBag,
  Wallet,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: 'easeOut' as const },
  }),
}

const cards = [
  {
    icon: ShoppingBag,
    title: 'Any vendor, one order',
    description:
      'Request from multiple shops in one go — we consolidate it into a single delivery.',
  },
  {
    icon: Wallet,
    title: 'Budget-safe',
    description:
      'Set a spending limit upfront. You see the running total before anything is bought.',
  },
  {
    icon: MessageSquareText,
    title: 'Live on WhatsApp',
    description:
      'Every order confirmation and update lands where you already are.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified runners',
    description:
      'Every runner is vetted and tracked — not a random courier off the street.',
  },
]

/** Dashed route-line motif SVG — used exactly once, behind this section */
function RouteMotif() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      viewBox="0 0 900 400"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dashed route path */}
      <path
        d="M 60 200 C 200 80, 380 320, 540 180 S 760 80, 860 200"
        stroke="#047857"
        strokeOpacity="0.10"
        strokeWidth="2"
        strokeDasharray="8 12"
        strokeLinecap="round"
      />
      {/* Waypoint dots */}
      <circle cx="60" cy="200" r="6" fill="#047857" fillOpacity="0.15" />
      <circle cx="60" cy="200" r="3" fill="#047857" fillOpacity="0.25" />

      <circle cx="540" cy="180" r="6" fill="#047857" fillOpacity="0.15" />
      <circle cx="540" cy="180" r="3" fill="#047857" fillOpacity="0.25" />

      <circle cx="860" cy="200" r="6" fill="#047857" fillOpacity="0.15" />
      <circle cx="860" cy="200" r="3" fill="#047857" fillOpacity="0.25" />

      {/* Pulse rings on waypoints */}
      <circle cx="60" cy="200" r="12" stroke="#047857" strokeOpacity="0.07" strokeWidth="1.5" />
      <circle cx="860" cy="200" r="12" stroke="#047857" strokeOpacity="0.07" strokeWidth="1.5" />
    </svg>
  )
}

export default function WhyUs() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section
      id="why-us"
      aria-labelledby="why-us-heading"
      className="relative section-pad bg-slate-50 overflow-hidden"
    >
      {/* Route-line motif — one hero moment */}
      <RouteMotif />

      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        ref={ref}
      >
        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="max-w-xl mb-16 mx-auto text-center flex flex-col items-center"
        >
          <motion.div variants={fadeUp} custom={0} className="bg-emerald-50 text-emerald-700 font-mono text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            WHY NTUMA
          </motion.div>
          <motion.h2
            id="why-us-heading"
            variants={fadeUp}
            custom={1}
            className="section-heading"
          >
            Shopping, without the trip.
          </motion.h2>
          <motion.div variants={fadeUp} custom={2} className="w-16 h-1 bg-brand-yellow mt-6 rounded-full" />
        </motion.div>

        {/* Card grid */}
        <motion.div
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                variants={fadeUp}
                custom={i + 2}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[24px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center gap-2 border border-slate-50"
              >
                {/* Icon container */}
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mb-3">
                  <Icon
                    size={24}
                    strokeWidth={1.5}
                    className="text-emerald-700"
                  />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-brand-black mb-3">
                    {card.title}
                  </h3>
                  <p className="font-body text-sm text-slate-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
