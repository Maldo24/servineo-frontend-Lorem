import axios from 'axios';

export async function getSchedulesCont(fixer_id: string, selected_date: string) {
    try {
        const response = await axios.get(
            'https://servineo-backend-lorem.onrender.com/api/crud_read/appointments/get_appointments_date',
            {
                params: {
                    id_fixer: fixer_id,
                    selected_date,
                },
            }
        );

        const data = response.data;
        const schedulesCount = data.accessed_appointments?.length || 0;

        return schedulesCount;
    } catch (error) {
        console.error('Error al obtener schedules:', error);
        return 0;
    }
}
