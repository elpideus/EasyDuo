import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c8a84b] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#3a2008] border border-[#c8a84b] text-[#e8d5a3] hover:bg-[#5a3010]',
        ghost: 'border border-[#3a2510] text-[#8a6a35] hover:border-[#c8a84b] hover:text-[#c8a84b]',
        active: 'bg-[#c8a84b] border border-[#c8a84b] text-[#0f0c07] font-bold',
        destructive: 'bg-transparent border border-[#3a2510] text-[#6a5035] hover:border-[#8a6035]',
        log: 'bg-[#2a1a08] border border-[#c8a84b] text-[#c8a84b] hover:bg-[#3a2a10]',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-7 px-3 text-xs',
        icon: 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
})
Button.displayName = 'Button'

export { Button, buttonVariants }
