import * as React from "react"
import { cn } from "../../lib/utils"

const Progress = React.forwardRef(({ className, value, indicatorClassName, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-white/20",
      className
    )}
    {...props}
  >
    <div
      className={cn(
        "h-full w-full flex-1 bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-300 ease-out",
        indicatorClassName
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }
