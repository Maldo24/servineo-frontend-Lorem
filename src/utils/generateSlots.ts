// lib/generateAvailableSlotsFromAPI.ts

const API = process.env.NEXT_PUBLIC_BACKEND as string;

import moment from 'moment';
import axios from 'axios';

export interface SlotEvent {
  title: string;
  start: Date;
  end: Date;
  booked: boolean;
  color?: string;
  id: string;
  cancelledByUser?: boolean;
  isBreakTime?: boolean;
  editable?: boolean;
}

export interface Schedule {
  _id: string;
  appointment_description: string;
  starting_time: string;
  finishing_time: string;
  schedule_state: string;
  display_name_location: string;
  lat: number;
  lon: number;
}

//Combinar las Schedules pautadas de todos los requesters (que seran ocupadas) y 
//las del requester que esta viendo el calendario de Fixer (booked)
function combineSchedules(
  currentRequesterSchedules: Schedule[],
  otherRequesterSchedules: Schedule[]
): Schedule[] {
  // Combinar ambos arrays
  const combined = [
    ...currentRequesterSchedules,
    ...otherRequesterSchedules
  ];

  for(const schedule of currentRequesterSchedules){
    if(schedule.schedule_state != 'cancelled'){
      schedule.schedule_state = 'booked';
    }
  }

  for(const schedule of otherRequesterSchedules){
    schedule.schedule_state = 'occupied';
  }

  console.log("desde combinedSchedules: ", combined);
  // Ordenar por starting_time ascendente (con Z)
  combined.sort((a, b) => a.starting_time.localeCompare(b.starting_time));

  // Convertir a formato sin Z después del sort
  const schedulesWithoutZ = combined.map(schedule => ({
    ...schedule,
    starting_time: schedule.starting_time ? schedule.starting_time.replace('Z', '') : '',
    finishing_time: schedule.finishing_time ? schedule.finishing_time.replace('Z', '') : ''
  }));

  return schedulesWithoutZ;
}
/**
 * Genera slots disponibles para horarios laborales que no tienen schedules
 * Solo genera slots para días futuros (no anteriores a hoy)
 */
function generateAvailableSlotsForMonth(month: number, year: number, fixerId: string): SlotEvent[] {
  const slots: SlotEvent[] = [];

  // Obtener el primer y último día del mes
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  //console.log(startDate, endDate);

  const current = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalizar a inicio del día

  while (current <= endDate) {
    // SOLO generar slots para días futuros (incluyendo hoy)
    if (current >= today) {
      const day = current.getDay(); // 0=domingo, 6=sábado

      // Solo días laborales (lunes a viernes)
      if (day >= 1 && day <= 5) {
        // Horario mañana: 8-12
        for (let hour = 8; hour < 12; hour++) {
          const start = new Date(current);
          start.setHours(hour, 0, 0, 0);
          const end = new Date(start);
          end.setHours(hour + 1);

          // Para el día actual, solo generar slots futuros (no horas pasadas)
          if (start > new Date()) {
            slots.push({
              title: "Disponible",
              start,
              end,
              booked: false,
              color: "#16A34A",
              isBreakTime: false,
              id: `available-${fixerId}-${start.toISOString()}`
            });
          }
        }

        // Horarios no Disponibles 12 - 14
        for(let hour = 12; hour < 14; hour++){
          const start = new Date(current);
          start.setHours(hour, 0, 0,0);
          const end = new Date(start);
          end.setHours(hour + 1);

          slots.push({
            title: "No Disponible",
            start,
            end,
            booked: true,
            editable: false,
            color: "#64748B",
            isBreakTime: true,
            id: `occupied-${fixerId}-${start.toISOString()}`
          });
        }

        // Horario tarde: 14-18
        for (let hour = 14; hour < 18; hour++) {
          const start = new Date(current);
          start.setHours(hour, 0, 0, 0);
          const end = new Date(start);
          end.setHours(hour + 1);

          // Para el día actual, solo generar slots futuros (no horas pasadas)
          if (start > new Date()) {
            slots.push({
              title: "Disponible",
              start,
              end,
              booked: false,
              color: "#16A34A",
              isBreakTime: false,
              id: `available-${fixerId}-${start.toISOString()}`
            });
          }
        }
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return slots;
}

/**
 * Genera los slots de un fixer específico desde la API + slots disponibles
 */
export async function generateAvailableSlotsFromAPI(
  fixerId: string, 
  requesterId: string,
  selectedDate: Date
): Promise<SlotEvent[]> {
  const slots: SlotEvent[] = [];

  const targetDate = selectedDate || new Date();
  const currentYear = targetDate.getFullYear();
  const month = targetDate.getMonth();

  const now = new Date(); // Fecha y hora actual

  try {
    // Consultas con axios
    const [currentRequesterResponse, otherRequesterResponse] = await Promise.all([
      axios.get(`${API}/api/crud_read/schedules/get_by_fixer_current_requester_month`, {
        params: {
          fixer_id: fixerId,
          requester_id: requesterId,
          month: month + 1
        }
      }),
      axios.get(`${API}/api/crud_read/schedules/get_by_fixer_other_requesters_month`, {
        params: {
          fixer_id: fixerId,
          requester_id: requesterId,
          month: month + 1
        }
      })
    ]);

    // Sin Axios
    //const currentRequesterResponse = await fetch(`${API}/api/crud_read/schedules/get_by_fixer_current_requester_month?fixer_id=${fixerId}&requester_id=${requesterId}&month=${month+1}`);
    //const otherRequesterResponse = await fetch(`${API}/api/crud_read/schedules/get_by_fixer_other_requesters_month?fixer_id=${fixerId}&requester_id=${requesterId}&month=${month+1}`);
    //const currentRequesterFixerSchedules = await currentRequesterResponse.json();
    //const otherRequesterFixerSchedules = await otherRequesterResponse.json();

    const currentRequesterFixerSchedules = currentRequesterResponse.data;
    const otherRequesterFixerSchedules = otherRequesterResponse.data;

    //console.log("Schedules del requester actual:", currentRequesterFixerSchedules);
    //console.log("Schedules de otros requesters:", otherRequesterFixerSchedules);

    const fixerSchedules: Schedule[] = combineSchedules(currentRequesterFixerSchedules, otherRequesterFixerSchedules);

    // for(const schedule of fixerSchedules) {
    //   const start = moment(schedule.starting_time).toDate();
    //   const end = moment(schedule.finishing_time).toDate();

    //   console.log(schedule ,start, end);
    // }
    //console.log("Desde generateSlots:", fixerSchedules);

    // Generar todos los slots disponibles para el mes (solo futuros)
    const availableSlots = generateAvailableSlotsForMonth(month, currentYear, fixerId);
    // Procesar los schedules existentes de la API
    for (const schedule of fixerSchedules) {
      const start = moment(schedule.starting_time).toDate();
      const end = moment(schedule.finishing_time).toDate();
      let slot: SlotEvent = {
        title: "Disponible",
        start,
        end,
        booked: false,

        id: `fixer-${fixerId}-${start.toISOString()}`,
      };
      // Determinar estado basado en el schedule
      switch (schedule.schedule_state) {
        case "occupied":
          slot.title = "Ocupado";
          slot.color = "#FF5F57";
          slot.booked = true;
          break;
        case "cancelled":
          slot.title = "Cancelado";
          slot.color = "#FF5F57";
          slot.cancelledByUser = true;
          slot.booked = true;
          break;
        case "booked":
          slot.title = "Reservado";
          slot.color = "#F59E0B";
          slot.booked = true;
          slot.editable = true;
          break;
        case "available":
        default:
          slot.title = "Disponible";
          slot.color = "#16A34A";
          break;
      }
      slots.push(slot);
    }
    // Combinar: slots de la API + slots disponibles que no están en la API
    const finalSlots: SlotEvent[] = [...slots];
    // Agregar slots disponibles que no tienen schedule en la API
    for (const availableSlot of availableSlots) {
      const exists = slots.some(scheduleSlot => 
        scheduleSlot.start.getTime() === availableSlot.start.getTime()
      );
      if (!exists) {
        finalSlots.push(availableSlot);
      }
    }
    const filteredSlots = finalSlots.filter(slot => slot.start >= now);

    // Ordenar por fecha
    filteredSlots.sort((a, b) => a.start.getTime() - b.start.getTime());

    return filteredSlots;
    
  } catch (err) {
    console.log("Error al generar los slots para el fixer:", fixerId, selectedDate, month ,err);

    throw new Error("No se pudieron cargar los horarios disponibles. Por favor, intenta más tarde.");
  }
}