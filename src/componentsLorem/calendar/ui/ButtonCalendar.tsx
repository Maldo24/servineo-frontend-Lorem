'use client';

import React from "react";

interface ButtonCalendarProps {
    onClick: () => void;
    disable: boolean;
    children: React.ReactNode;
}

export default function ButtonCalendar({
    onClick,
    disable,
    children,
}: ButtonCalendarProps) {
    return (
        <button
            onClick={onClick}
            disabled={disable}
            className={`p-1 rounded-[10px] bg-gray-300 transition-colors ${disable
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-gray-200 active:bg-gray-400"
                } cursor-pointer`}

        >
            {children}
        </button>

    );

}

