import React from "react";
import ButtonCalendar from "../ui/ButtonCalendar";

ButtonCalendar
interface HeaderSectionProps {
    buttons: { label: string; onClick: () => void; disabled: boolean }[];
}

export default function HeaderSection({ buttons }: HeaderSectionProps) {
    return (
        <div className="flex items-center gap-2">
            {buttons.map((b, idx) => (
                <ButtonCalendar key={idx} onClick={b.onClick} disable={b.disabled}>
                    {b.label}
                </ButtonCalendar>
            ))}
        </div>
    )
}
