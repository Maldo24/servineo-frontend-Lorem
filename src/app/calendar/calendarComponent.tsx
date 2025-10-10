'use client';

import React, { useRef, useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views, SlotInfo, Event as RBCEvent } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import AppointmentForm, { AppointmentFormHandle } from "../../components/appointments/forms/AppointmentForm";
import { generateAvailableSlots, SlotEvent } from "../../utils/generateAvailableSlots";

moment.locale('es');
const localizer = momentLocalizer(moment);

interface MyEvent {
  title: string;
  start: Date;
  end: Date;
  id: string;
  booked: boolean;
}

export default function MyCalendarPage() {
  const [events, setEvents] = useState<MyEvent[]>([]);

  const formRef = useRef<AppointmentFormHandle | null>(null);

  // pre-generar slots de disponibilidad para 30 días
  useEffect(() => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 30);
    const slots: SlotEvent[] = generateAvailableSlots(start, end);
    setEvents(slots.map(s => ({ ...s })));
  }, []);

  function handleSelectEvent(ev: MyEvent) {
    if (ev.booked) return;
    formRef.current?.open(ev.start.toISOString(), { eventId: ev.id, title: ev.title });
  }

  function handleSelectSlot(slotInfo: SlotInfo) {
    const start = slotInfo.start;
    const day = start.getDay();
    const hour = start.getHours();
    if (day < 1 || day > 5) return;
    if (!((hour >= 8 && hour < 12) || (hour >= 14 && hour < 18))) return;

    const dtISO = start.toISOString();
    let existing = events.find(e => e.start.toISOString() === dtISO);
    if (!existing) {
      const newEvent: MyEvent = { title: "Disponible", start, end: new Date(start.getTime() + 60 * 60 * 1000), booked: false, id: dtISO };
      setEvents(prev => [...prev, newEvent]);
      existing = newEvent;
    }
    formRef.current?.open(dtISO, { eventId: existing.id, title: existing.title });
  }

  useEffect(() => {
    const onCreated = (ev: any) => {
      const { datetime, id, meta } = ev.detail || {};
      if (!datetime) return;
      const normalized = new Date(datetime).toISOString();

      setEvents(prev => {
        let found = false;
        const next = prev.map(item => {
          if (new Date(item.start).toISOString() === normalized) {
            found = true;
            return { ...item, booked: true, id: id || item.id, title: meta?.description || "Cita reservada" };
          }
          return item;
        });
        if (!found) {
          const newEvent: MyEvent = {
            title: meta?.description || "Cita reservada",
            start: new Date(datetime),
            end: new Date(new Date(datetime).getTime() + 60 * 60 * 1000),
            booked: true,
            id: id || String(Date.now())
          };
          return [...next, newEvent];
        }
        return next;
      });
    };

    window.addEventListener("booking:created", onCreated);
    return () => window.removeEventListener("booking:created", onCreated);
  }, []);

  function eventStyleGetter(event: MyEvent) {
    return {
      style: {
        backgroundColor: event.booked ? "#FFC857" : "#16A34A",
        color: "#fff",
        borderRadius: 12,
        border: "none",
        padding: "2px 6px"
      }
    };
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Mi Calendario</h1>
      <div style={{ height: '600px', margin: '20px' }}>
        <Calendar
          className="bg-[#F1F5F8] text-black rounded-2xl"
          localizer={localizer}
          events={events as RBCEvent[]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', borderRadius: 16 }}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={Views.MONTH}
          selectable
          onSelectEvent={(event) => handleSelectEvent(event as MyEvent)}
          onSelectSlot={(slotInfo) => handleSelectSlot(slotInfo)}
          eventPropGetter={(event) => eventStyleGetter(event as MyEvent)}
          popup
        />
      </div>
      <AppointmentForm ref={formRef} />
    </div>
  );
}
