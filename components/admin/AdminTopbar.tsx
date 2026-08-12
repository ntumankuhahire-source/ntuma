'use client'

import { Plus, Download } from 'lucide-react'

interface AdminTopbarProps {
  title: string;
  /** Primary action (green "+ Label" button). Only rendered when both are provided. */
  actionLabel?: string;
  onAction?: () => void;
  /** Optional ghost action (e.g. "Export"). Only rendered when both are provided. */
  ghostActionLabel?: string;
  onGhostAction?: () => void;
}

export function AdminTopbar({
  title,
  actionLabel,
  onAction,
  ghostActionLabel,
  onGhostAction,
}: AdminTopbarProps) {
  return (
    <div className="flex items-center justify-between h-20 border-b border-slate-200 bg-white px-8">
      <h1 className="font-display font-bold text-2xl text-emerald-950 ml-10 lg:ml-0">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        {/* Ghost secondary action (e.g. Export) */}
        {ghostActionLabel && onGhostAction && (
          <button
            onClick={onGhostAction}
            className="inline-flex items-center justify-center gap-2 border border-emerald-700 text-emerald-700 hover:bg-emerald-50 font-body font-medium text-sm px-4 py-2 rounded-card transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
          >
            <Download className="h-4 w-4" />
            {ghostActionLabel}
          </button>
        )}

        {/* Primary action */}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-body font-medium text-sm px-5 py-2.5 rounded-card transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
