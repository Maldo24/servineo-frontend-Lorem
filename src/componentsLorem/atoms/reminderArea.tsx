import React from "react";

interface ReminderAreaProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    time: string;
    className?: string;
    labelWidth?: string;
    inputWidth?: string;
}

export const ReminderArea = React.forwardRef<HTMLInputElement, ReminderAreaProps>(
    ({ label, time, className = "", labelWidth = "w-32", inputWidth = "w-64", ...rest }, ref) => {
        return (
            <div className={`flex items-center ${className}`}>
                {label && (
                    <div className={`${labelWidth} flex-auto`}>
                        <label className="block">
                            <span className="text-sm font-medium">{label}</span>
                        </label>
                    </div>
                )}

                <div className={`${inputWidth} flex-auto`}>
                    <input
                        ref={ref}
                        readOnly
                        value={`${time} Antes de la Cita`}
                        className="mt-1 block w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-center text-gray-600 cursor-not-allowed"
                        {...rest}
                    />
                </div>
            </div>
        );
    }
);

ReminderArea.displayName = "ReminderAreaField";
