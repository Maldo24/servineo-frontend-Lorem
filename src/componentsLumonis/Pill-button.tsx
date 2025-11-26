import type React from "react"

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
    size?: "sm" | "md" | "lg"
}

export function PillButton({
    className = "",
    variant = "primary",
    size = "md",
    ...props
}: PillButtonProps) {

    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        outline: "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm"
    }

    const sizes = {
        sm: "h-8 px-4 text-xs",
        md: "h-10 px-6 text-sm",
        lg: "h-12 px-8 text-base"
    }

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

    return (
        <button className={classes} {...props} />
    )
}
