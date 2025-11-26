import axios from 'axios';

export interface Appointment {
    cancelled_fixer: boolean;
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
    active: boolean;
    reprogram_reason: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}




interface ApiResponse {
    success: boolean;
    message: string;
    accessed_appointments: Appointment[];
}

export async function getAppointmentsByDate(fixerId: string, date: string): Promise<Appointment[]> {
    try {

        const response = await axios.get<ApiResponse>(
            'https://servineo-backend-lorem.onrender.com/api/crud_read/appointments/get_appointments_date',
            {
                params: {
                    id_fixer: fixerId,
                    selected_date: date
                }
            }
        );


        if (response.data.success && response.data.accessed_appointments) {
            return response.data.accessed_appointments;
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
