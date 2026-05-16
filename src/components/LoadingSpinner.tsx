import { cn } from '../lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'slate' | 'white' | 'primary'
  fullPage?: boolean
  label?: string
  className?: string
  showLabel?: boolean
}

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-4',
  lg: 'w-14 h-14 border-4',
}

const colorMap = {
  blue: 'border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400',
  slate: 'border-slate-200 border-t-slate-700 dark:border-slate-700 dark:border-t-slate-300',
  white: 'border-white/40 border-t-white',
  primary: 'border-primary/30 border-t-primary',
}

const LoadingSpinner = ({
  size = 'md',
  color = 'blue',
  fullPage = false,
  label = 'Loading',
  className,
  showLabel = false,
}: LoadingSpinnerProps) => {
  const spinner = (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-full animate-spin',
        sizeMap[size],
        colorMap[color]
      )}
    />
  )

  const status = (
    <div
      className={cn("inline-flex items-center justify-center gap-2", className)}
      role="status"
      aria-live="polite"
    >
      {spinner}
      <span className={showLabel ? "text-sm font-medium text-slate-600 dark:text-slate-300" : "sr-only"}>
        {label}
      </span>
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        {status}
      </div>
    )
  }

  return status
}

export default LoadingSpinner
