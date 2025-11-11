import axios from 'axios';

export async function getSchedulesCont(fixer_id: string, month: number, year: number): Promise<number[]> {
    try {
        const response = await axios.get(
            'https://servineo-backend-lorem.onrender.com/api/crud_read/schedules/get_number_of_appointments',
            {
                params: {
                    fixer_id,
                    month,
                    year
                },
            }
        );

        const data = response.data;

        const appointments = data.number_of_appointments;

        if (!appointments || typeof appointments !== 'object') {
            console.warn('No se encontraron appointments en la respuesta:', data);
            return [];
        }

        return Object.values(appointments).map(val => Number(val) || 0);

    } catch (error) {
        console.error('Error al obtener contador de schedules:', error);
        return [];
    }
}
