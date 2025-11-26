interface StepIndicatorProps {
  step: number
  total: number
}

export function StepIndicator({ step, total }: StepIndicatorProps) {
  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={
            "h-1.5 w-10 rounded-full transition-all " +
            (i < step ? "bg-primary" : i === step ? "bg-blue-500" : "bg-gray-300")
          }
        />
      ))}
    </div>
  )
}
