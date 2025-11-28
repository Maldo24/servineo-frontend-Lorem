'use client';
import DesktopDailyHours from "../day/DesktopDailyHours";
import Hours from "../ui/Hours";

interface DesktopWeekViewProps {
    date: Date;
}

const getWeekDays = (selectedDate: Date) => {
    const days: Date[] = [];

    // 👇 Crea una copia y normaliza la hora
    const current = new Date(selectedDate);
    current.setHours(0, 0, 0, 0);

    const dayOfWeek = current.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const firstDay = new Date(current);
    firstDay.setDate(current.getDate() + diff);

    for (let i = 0; i < 7; i++) {
        const day = new Date(firstDay);
        day.setDate(firstDay.getDate() + i);
        day.setHours(0, 0, 0, 0); // 👈 Normaliza cada día
        days.push(day);
    }

    return days;
};

function getDayName(dayNumber: number): string {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return days[dayNumber];
}

export default function DesktopWeekView({ date }: DesktopWeekViewProps) {
    const weekDays = getWeekDays(date);



    return (
        <div className="flex flex-col">
            <div className="flex">
                <div>
                    <div className="text-white"><p>--</p></div>
                    <Hours />
                </div>
                <div className="border-[#b8bec6] w-full h-full">
                    <div className="flex-1 grid grid-cols-7">
                        {weekDays.map(day => (
                            <div key={day.toISOString()}>
                                <div className="flex items-center justify-center border-r border-b bg-gray-300 text-black">
                                    {getDayName(day.getDay())} {day.getDate()}
                                </div>
                                <DesktopDailyHours
                                    date={day}
                                    view={'week'}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
