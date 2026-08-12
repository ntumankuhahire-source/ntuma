'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { MessageSquare, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

const fadeUp: any = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: 'easeOut' as const },
  }),
}

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section-pad bg-slate-50 relative overflow-hidden"
    >
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="max-w-2xl mb-16 mx-auto text-center flex flex-col items-center"
        >
          <motion.div variants={fadeUp} custom={0} className="bg-emerald-50 text-emerald-700 font-mono text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            GET IN TOUCH
          </motion.div>
          <motion.h2
            id="contact-heading"
            variants={fadeUp}
            custom={1}
            className="section-heading"
          >
            Let's Connect & Grow
          </motion.h2>
          <motion.div variants={fadeUp} custom={2} className="w-16 h-1 bg-brand-yellow mt-6 rounded-full" />
          <motion.p
            variants={fadeUp}
            custom={3}
            className="mt-6 text-slate-500 font-body"
          >
            Ready to order, ask about our standards, or visit one of our distribution centers? Select an option below to connect with us instantly.
          </motion.p>
        </motion.div>

        {/* Card grid */}
        <motion.div
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {/* Card 1 */}
          <motion.div
            variants={fadeUp}
            custom={4}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-50"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 flex items-center justify-center flex-shrink-0 mb-6">
              <MessageSquare className="text-white w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-xl text-brand-black mb-3">
              Direct Ordering
            </h3>
            <p className="font-body text-sm text-slate-500 leading-relaxed mb-6 flex-grow">
              Call us or start a WhatsApp chat for immediate order processing, prices, and delivery inquiries.
            </p>
            <div className="space-y-2.5">
              <a href="https://wa.me/250787800703" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium px-4 py-3 rounded-xl transition-colors text-sm">
                <MessageSquare className="w-4 h-4 shrink-0" />
                +250 787 800 703
              </a>
              <a href="https://wa.me/250788524634" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium px-4 py-3 rounded-xl transition-colors text-sm">
                <MessageSquare className="w-4 h-4 shrink-0" />
                +250 788 524 634
              </a>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={fadeUp}
            custom={5}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-50"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-yellow/10 flex items-center justify-center flex-shrink-0 mb-6 border border-brand-yellow/20">
              <Mail className="text-brand-yellow w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-xl text-brand-black mb-3">
              Email &amp; Support
            </h3>
            <p className="font-body text-sm text-slate-500 leading-relaxed mb-4 flex-grow">
              Have feedback, custom business partnerships, or special requests? Send us an email anytime.
            </p>
            <div className="space-y-1.5 mb-6">
              <a href="mailto:info@ntumankuhahire.com" className="font-mono text-sm font-semibold text-emerald-700 hover:underline block">
                info@ntumankuhahire.com
              </a>
              <a href="mailto:ntumankuhahire@gmail.com" className="font-mono text-sm font-semibold text-emerald-700 hover:underline block">
                ntumankuhahire@gmail.com
              </a>
            </div>
            <Link href="/contact" className="w-full inline-flex items-center justify-center gap-2 border border-emerald-700 text-emerald-700 hover:bg-emerald-50 font-medium px-6 py-3.5 rounded-xl transition-colors mt-auto">
              Go to Contact Page
            </Link>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={fadeUp}
            custom={6}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-50"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0 mb-6">
              <MapPin className="text-emerald-700 w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-xl text-brand-black mb-3">
              Our Locations
            </h3>
            <p className="font-body text-sm text-slate-500 leading-relaxed mb-8 flex-grow">
              We operate exclusively across Kigali, serving Gasabo, Kicukiro, and Nyarugenge districts.
            </p>
            <button className="w-full inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-[#eab308] text-brand-black font-medium px-6 py-3.5 rounded-xl transition-colors mt-auto">
              <MapPin className="w-4 h-4" />
              View Locations
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
