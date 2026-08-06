'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    name: 'Vegetables and fruits',
    image: '/vegetable.webp',
    href: '/order?category=vegetables',
  },
  {
    name: 'Meat & Poultry',
    image: '/chicken.png',
    href: '/order?category=meat',
  },
  {
    name: 'Supermarket',
    image: '/supermarket.png',
    href: '/order?category=supermarket',
  },
  {
    name: 'Others',
    image: '/other.png',
    href: '/order?category=others',
  },
]

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
}

export default function Products() {
  return (
    <section id="shop" className="py-20 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10% 0px' }}
            className="max-w-2xl"
          >
            <motion.p variants={fadeUp} custom={0} className="eyebrow mb-3 text-emerald-700">
              EXPLORE OUR CATALOG
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-5xl font-semibold text-brand-black tracking-tight">
              What do you need today?
            </motion.h2>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              href="/order" 
              className="group flex items-center gap-2 text-emerald-700 font-medium hover:text-emerald-800 transition-colors"
            >
              See all categories
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-10% 0px' }}
              custom={index + 2}
              variants={fadeUp}
            >
              <Link
                href={category.href}
                className="group block rounded-2xl bg-white p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100"
              >
                <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="px-3 pb-2 flex flex-col gap-3">
                  <h3 className="font-medium text-brand-black text-lg">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-100">
                    <span className="text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                      Order now
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-700 transition-colors">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-10% 0px' }}
          variants={fadeUp}
          className="mt-12 md:mt-16 flex justify-center"
        >
          <Link
            href="/order"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3.5 px-8 rounded-full transition-colors inline-flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            Start your order
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
