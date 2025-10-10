// lib/generateAvailableSlots.ts
export interface SlotEvent {
  title: string;
  start: Date;
  end: Date;
  booked: boolean;
  id: string;
}

export function generateAvailableSlots(startDate: Date, endDate: Date): SlotEvent[] {
  const slots: SlotEvent[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const day = current.getDay(); // 0=domingo, 6=sábado
    if (day >= 1 && day <= 5) { // lunes a viernes
      // Horarios: 8-12
      for (let hour = 8; hour < 12; hour++) {
        const start = new Date(current);
        start.setHours(hour, 0, 0, 0);
        const end = new Date(start);
        end.setHours(hour + 1);
        slots.push({
          title: "Disponible",
          start,
          end,
          booked: false,
          id: `${start.toISOString()}`
        });
      }
      // Horarios: 14-18
      for (let hour = 14; hour < 18; hour++) {
        const start = new Date(current);
        start.setHours(hour, 0, 0, 0);
        const end = new Date(start);
        end.setHours(hour + 1);
        slots.push({
          title: "Disponible",
          start,
          end,
          booked: false,
          id: `${start.toISOString()}`
        });
      }
    }
    current.setDate(current.getDate() + 1);
  }

  return slots;
}
