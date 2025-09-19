import React, { useState, useMemo, useCallback, createContext, useContext } from 'react'

const AccordionContext = createContext(null)

export function Accordion({ type = 'single', collapsible = true, defaultValue = null, className = '', children }) {
  const [openItems, setOpenItems] = useState(() => {
    if (type === 'single') return defaultValue ? [defaultValue] : []
    return Array.isArray(defaultValue) ? defaultValue : []
  })

  const toggleItem = useCallback((value) => {
    setOpenItems((prev) => {
      const isOpen = prev.includes(value)
      if (type === 'single') {
        if (isOpen) return collapsible ? [] : prev
        return [value]
      } else {
        if (isOpen) return prev.filter((v) => v !== value)
        return [...prev, value]
      }
    })
  }, [type, collapsible])

  const ctx = useMemo(() => ({ openItems, toggleItem }), [openItems, toggleItem])

  return (
    <AccordionContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  )
}

export function AccordionItem({ value, className = '', children }) {
  return (
    <div data-value={value} className={`border border-white/10 rounded-xl bg-white/5 ${className}`}>
      {children}
    </div>
  )
}

export function AccordionTrigger({ value, children }) {
  const { openItems, toggleItem } = useContext(AccordionContext)
  const open = openItems.includes(value)
  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      aria-expanded={open}
      className="w-full flex items-center justify-between px-5 py-4 text-left text-white hover:bg-white/10 rounded-xl"
    >
      <span className="font-medium">{children}</span>
      <svg className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.126l3.71-3.894a.75.75 0 111.08 1.04l-4.24 4.45a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd"/></svg>
    </button>
  )
}

export function AccordionContent({ value, children }) {
  const { openItems } = useContext(AccordionContext)
  const open = openItems.includes(value)
  return (
    <div className={`px-5 pb-5 text-white/90 ${open ? 'block' : 'hidden'}`}>
      {children}
    </div>
  )
}

export default Accordion 