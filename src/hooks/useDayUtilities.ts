
export default function useDayUtilities(date: Date) {


    const normalize = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const today = normalize(new Date());
    const currentDate = normalize(date);


    const isSameDay = (a: Date, b: Date) =>
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear();

    const isToday = isSameDay(currentDate, today);
    const isWeekend = currentDate.getDay() === 6 || currentDate.getDay() === 0;
    const isPast = currentDate < today;


    const getColor = (count: number) => {
        if (isPast) return 'text-black';
        if (isWeekend) return 'bg-[#9FA1A5]';
        if (count === 0) return 'bg-[#16A34A] ';
        if (count >= 1 && count <= 23) return 'bg-[#FFC857]';
        if (count === 24) return 'bg-[#FF5F57] ';
        return 'bg-gray-200 text-black';
    };

    const getText = (count: number) => {
        if (isPast) return '';
        if (isWeekend) return 'Inhabilitado';
        if (count === 0) return 'Disponible';
        if (count >= 1 && count <= 23) return 'Parc. Oc.';
        if (count === 24) return 'Ocupado';
        return '';
    };
    return { isPast, isSameDay, isToday, getColor, getText };
}
