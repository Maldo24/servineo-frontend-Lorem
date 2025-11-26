"use client"

import type { ReactNode } from "react"
import { useTabs } from "./Tabs"

export interface TabsTriggerProps {
  value: string
  className?: string
  children: ReactNode
}

const TabsTrigger = ({ value, className, children }: TabsTriggerProps) => {
  const { value: activeTab, onValueChange } = useTabs()
  const isActive = value === activeTab

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onValueChange(value)}
      className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
        ${isActive
          ? "bg-white text-gray-950 shadow-sm"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
        }
        ${className || ""}
      `}
    >
      {children}
    </button>
  )
}

export default TabsTrigger
