import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        top: 'bg-amber-900/60 text-yellow-300 border border-yellow-600/40',
        high: 'bg-green-900/60 text-green-300 border border-green-600/40',
        mid: 'bg-yellow-900/40 text-yellow-200 border border-yellow-700/40',
        low: 'bg-red-900/40 text-red-300 border border-red-700/40',
        action: 'bg-transparent border text-sm font-bold tracking-wide',
      },
    },
    defaultVariants: { variant: 'mid' },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
