
import React from 'react'
import { cn } from '../lib/utils'

export default function GlassCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('glass rounded-2xl p-5 shadow-glass', className)}>
      {children}
    </div>
  )
}
