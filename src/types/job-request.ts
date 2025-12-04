export interface AppointmentTime {
  $date: string;
}

export interface Appointment {
  _id: string;
  id_fixer: string;
  id_requester: string;
  selected_date: { $date: string };
  current_requester_name: string;
  appointment_type: string;
  appointment_description: string;
  link_id: string;
  current_requester_phone: string;
  starting_time: AppointmentTime;
  finishing_time: AppointmentTime;
  schedule_state: string;
  display_name_location: string;
  lat: string | null;
  lon: string | null;
  cancelled_fixer: boolean;
  reprogram_reason: string;
  createdAt: { $date: string };
  updatedAt: { $date: string };
  __v: number;
}

export interface UserLocation {
  lat: string;
  lng: string;
}

export interface CreateJobRequestPayload {
  title: string;
  description: string;
  location: {
    type: 'Point';
    coordinates: [string, string];
  };
  startTime: string;
  endTime: string;
  price: string | number;
  fixerId: string;
  requesterId: string;
  appointmentId?: string;
  offerId?: string;
}

export interface JobRequest {
  _id: string;
  title: string;
  description: string;
  location?: {
    type: 'Point';
    coordinates: [string, string];
  };
  startTime?: string;
  endTime?: string;
  price: number;
  requesterId: string;
  fixerId?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'paid';
  createdAt: string;
  updatedAt?: string;
  rating?: number;
  comment?: string;
  type?: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface JobRequestData {
  jobMotive: string;
  jobDescription: string;
  locationOption: 'keep' | 'modify';
  startTime: string;
  endTime: string;
  suggestedRate: string;
}

export interface JobRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobRequest) => void;
  fixerId: string;
  appointmentData?: Appointment;
  offerId?: string;
}

export interface JobRequestFormProps {
  initialLocation: Location | null;
  loading: boolean;
  onSubmit: (formData: JobRequestData, newLocation: Location | null) => void;
  onCancel: () => void;
  initialFormData?: JobRequestData;
}
