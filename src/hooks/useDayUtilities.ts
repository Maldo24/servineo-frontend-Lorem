
export default function useDayUtilities(date: Date) {


    const normalize = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const today = normalize(new Date());
    const currentDate = normalize(date);


    const isSameDay = (a: Date, b: Date) =>
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear();

    const isToday = isSameDay(currentDate, today);
    const isPast = currentDate < today;


    const getColor = (count: 'full' | 'partial' | 'available' | 'disabled') => {
        if (isPast) return '';
        if (count === 'available') return 'bg-[#16A34A] ';
        if (count === 'partial') return 'bg-[#FFC857]';
        if (count === 'full') return 'bg-[#FF5F57] ';
        if (count === 'disabled') return 'bg-[#64748B]';
        return 'bg-gray-200 text-black';
    };

    const getText = (count: 'full' | 'partial' | 'available' | 'disabled') => {
        if (isPast) return '';
        if (count === 'available') return 'Disponible';
        if (count === 'partial') return 'Parc. Oc.';
        if (count === 'full') return 'Ocupado';
        if (count === 'disabled') return 'Inhabilitado';
        return '';
    };
    return { isPast, isSameDay, isToday, getColor, getText };
}
