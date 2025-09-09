import * as React from "react"
import { cn } from "../../lib/utils"

const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      className={cn("grid gap-4", className)}
      {...props}
      ref={ref}
      role="radiogroup"
    />
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef(({ className, children, value, checked, onChange, ...props }, ref) => {
  return (
    <label
      className={cn(
        "flex items-center space-x-3 cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 font-medium",
        checked
          ? "border-[#3CD4AB] bg-[#3CD4AB]/10 text-white"
          : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-700",
        className
      )}
    >
      <input
        type="radio"
        className="sr-only"
        value={value}
        checked={checked}
        onChange={onChange}
        ref={ref}
        {...props}
      />
      <div className={cn(
        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
        checked
          ? "border-[#3CD4AB] bg-[#3CD4AB]"
          : "border-gray-500"
      )}>
        {checked && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
      <span className="flex-1">{children}</span>
    </label>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem } 