
import axios from 'axios';
export interface Appointment {
    _id: string;
    id_fixer: string;
    id_requester: string;
    selected_date: string;
    current_requester_name: string;
    appointment_type: string;
    appointment_description: string;
    link_id: string;
    current_requester_phone: string;
    starting_time: string;
    finishing_time: string;
    schedule_state: string;
    display_name_location: string;
    lat: string;
    lon: string;
    cancelled_fixer: boolean;
    active: boolean;
    reprogram_reason: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
interface ApiResponse {
    succeed: boolean;
    message: string;
    data: Appointment[];
}

export async function getAppointmentsByHour(fixer_id: string, date: string, hour: number): Promise<Appointment[]> {
    try {

        const response = await axios.get<ApiResponse>(
            'https://servineo-backend-lorem.onrender.com/api/crud_read/appointments/get_appointment_by_fixer_hour',
            {
                params: {
                    fixer_id,
                    date,
                    hour
                }
            }
        );


        if (response.data.message && response.data.data) {
            return response.data.data;
        } else {
            console.log('No se encontraron citas ');
            return [];
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error de Axios:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        } else {
            console.error('Error desconocido:', error);
        }
        return [];
    }
}
