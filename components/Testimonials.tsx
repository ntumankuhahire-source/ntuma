'use client'

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

const testimonials = [
  {
    initials: 'A.M.',
    name: 'Amina M.',
    neighborhood: 'Nyagatare',
    quote:
      "I sent a list and a budget on WhatsApp. An hour later my groceries were at the door. The invoice was detailed — I knew exactly what was bought and at what price.",
  },
  {
    initials: 'J.K.',
    name: 'Jean-Paul K.',
    neighborhood: 'Kigali, Kacyiru',
    quote:
      "I've tried other couriers but they always called asking for more money halfway through. Ntuma stuck to the budget I set. That trust is worth everything.",
  },
  {
    initials: 'C.U.',
    name: 'Claudine U.',
    neighborhood: 'Kigali, Remera',
    quote:
      "The runner knew my market by name and got exactly the right cut of meat. It felt like sending a family member to shop.",
  },
]

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative section-pad"
    >
      {/* Dark overlay and background image */}
      <div 
        className="absolute inset-0 z-0 bg-brand-black"
        style={{
          backgroundImage: 'url(/laptop.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: 0.3
        }}
      />
      <div className="absolute inset-0 z-0 bg-brand-black/80" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="max-w-2xl mx-auto text-center flex flex-col items-center mb-16"
        >
          <motion.div variants={fadeUp} custom={0} className="bg-white/10 backdrop-blur-sm text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-white/10">
            WHAT BUYERS SAY
          </motion.div>
          <motion.h2
            id="testimonials-heading"
            variants={fadeUp}
            custom={1}
            className="section-heading text-white"
          >
            Trusted by people who'd rather not queue.
          </motion.h2>
          <motion.div variants={fadeUp} custom={2} className="w-16 h-1 bg-brand-yellow mt-6 rounded-full" />
        </motion.div>

        {/* Card row — horizontal scroll on mobile, 3-across on desktop */}
        <motion.div
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="flex gap-6 overflow-x-auto pb-8 pt-4 px-4 -mx-4 scroll-snap-x scroll-px-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:px-0 md:mx-0"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              custom={i + 2}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative flex-shrink-0 w-[calc(100vw-48px)] md:w-auto snap-start flex flex-col gap-6 bg-white/10 backdrop-blur-md rounded-[32px] p-8 shadow-2xl border border-white/20 transition-all duration-300"
            >
              {/* Oversized quotation mark watermark */}
              <span
                aria-hidden="true"
                className="absolute top-4 right-6 font-display text-[7rem] leading-none text-emerald-500/20 select-none pointer-events-none"
              >
                "
              </span>

              {/* Quote */}
              <blockquote className="font-body text-base text-white leading-relaxed relative z-10 flex-grow font-medium">
                "{t.quote}"
              </blockquote>

              {/* Attribution */}
              <div className="flex items-center gap-4 mt-auto border-t border-white/10 pt-6">
                {/* Initials avatar */}
                <div
                  className="w-12 h-12 rounded-2xl bg-brand-yellow flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  <span className="font-mono text-sm font-bold text-brand-black">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-white leading-tight mb-0.5">
                    {t.name}
                  </p>
                  <p className="font-body text-xs text-slate-300">{t.neighborhood}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
