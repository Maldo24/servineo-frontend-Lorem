import { getSchedulesCont } from "@/utils/getSchedulesCont";
import { useState, useEffect } from "react";

interface useDailyContsProps {
    date: Date;
    fixer_id: string;
}


export default function useDailyConts({
    date,
    fixer_id
}: useDailyContsProps) {

    const [count, setCount] = useState<number[]>([]);
    const month = date.getMonth() - 1;
    const year = date.getFullYear();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getSchedulesCont(
                    fixer_id,
                    month,
                    year
                );
                setCount(result);
            } catch {
                setCount([]);
            }
        };
        fetchData();
    }, [month, year, fixer_id]);


    return count;
}
