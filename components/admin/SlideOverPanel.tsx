'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface SlideOverPanelProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  onSave: () => void
  saveDisabled?: boolean
  isSaving?: boolean
}

export function SlideOverPanel({
  open,
  onClose,
  title,
  children,
  onSave,
  saveDisabled = false,
  isSaving = false,
}: SlideOverPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-6 bg-emerald-950 sm:px-8">
          <h2 className="text-xl font-display font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 -mr-2 p-2 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {children}
        </div>

        {/* Pinned footer */}
        <div className="flex shrink-0 justify-end gap-3 px-6 py-4 sm:px-8 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="rounded-card px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saveDisabled || isSaving}
            className="rounded-card px-5 py-2.5 text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 transition-colors"
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </>
  )
}
