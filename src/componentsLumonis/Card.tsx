import type React from "react"
interface CardProps {
  title?: string,
  className?: string,
  children: React.ReactNode
}

export function Card({ title, children, className }: CardProps) {
  return (
    <div className={`neon-border glass-panel rounded-2xl border border-primary p-5 shadow-sm animate-slide-up ${className}`}>
      <h3 className="mb-3 text-center text-lg font-semibold">{title}</h3>
      {children}
    </div>
  )
}
