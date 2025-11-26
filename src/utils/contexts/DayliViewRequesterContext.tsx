"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Ctx = {
  loading: boolean;
  isHourBooked: (date: Date, hour: number) => boolean;
  isOccupiedByOther: (date: Date, hour: number) => boolean;
  isDisabled: (date: Date, hour: number) => boolean;
  isCancelledByFixer: (date: Date, hour: number) => boolean;
  isCancelledByRequester: (date: Date, hour: number) => boolean;
};

const CtxObj = createContext<Ctx | null>(null);

export function useDailyAppointments(): Ctx {
  const ctx = useContext(CtxObj);
  if (!ctx) throw new Error("useAppointmentsContext must be within AppointmentsStatusProvider");
  return ctx;
}

const API_BASE = "https://servineo-backend-lorem.onrender.com";
const pad2 = (n: number) => String(n).padStart(2, "0");
const ymdLocal = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const sameLocalDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

async function getJSON<T>(url: string, signal?: AbortSignal): Promise<T | null> {
  const r = await fetch(url, { headers: { Accept: "application/json" }, signal });
  if (!r.ok) return null;
  return r.json().catch(() => null);
}

type RowDay = { starting_hour: number; schedule_state: string };
type CancelFixerResp = { cancelled_schedules_fixer?: Array<{ starting_hour: number }> };
type CancelRequesterResp = { cancelled_schedules_requester?: Array<{ starting_hour: number }> };

export interface ProviderProps {
  fixerId: string;
  requesterId: string;
  selectedDate: Date;
  children: React.ReactNode;
}

export function AppointmentsStatusProvider({
  fixerId,
  requesterId,
  selectedDate,
  children,
}: ProviderProps) {
  const [loading, setLoading] = useState(false);
  const [bookedMine, setBookedMine] = useState<Set<number>>(new Set());
  const [occupiedOthers, setOccupiedOthers] = useState<Set<number>>(new Set());
  const [cancelByFixer, setCancelByFixer] = useState<Set<number>>(new Set());
  const [cancelByRequester, setCancelByRequester] = useState<Set<number>>(new Set());

  useEffect(() => {
    let alive = true;
    const ac = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const ymd = ymdLocal(selectedDate);
        const uBooked = new URL(`${API_BASE}/api/crud_read/schedules/get_by_fixer_current_requester_day`);
        uBooked.searchParams.set("fixer_id", fixerId);
        uBooked.searchParams.set("requester_id", requesterId);
        uBooked.searchParams.set("searched_date", ymd);

        const uOccupied = new URL(`${API_BASE}/api/crud_read/schedules/get_by_fixer_other_requesters_day`);
        uOccupied.searchParams.set("fixer_id", fixerId);
        uOccupied.searchParams.set("requester_id", requesterId);
        uOccupied.searchParams.set("searched_date", ymd);

        const uCFixer = new URL(`${API_BASE}/api/crud_read/schedules/get_cancelled_appointments_by_fixer_date`);
        uCFixer.searchParams.set("fixer_id", fixerId);
        uCFixer.searchParams.set("requester_id", requesterId);
        uCFixer.searchParams.set("searched_date", ymd);

        const uCReq = new URL(`${API_BASE}/api/crud_read/schedules/get_cancelled_appointments_by_requester_date`);
        uCReq.searchParams.set("fixer_id", fixerId);
        uCReq.searchParams.set("requester_id", requesterId);
        uCReq.searchParams.set("searched_date", ymd);

        const [rBooked, rOccupied, rCFixer, rCReq] = await Promise.all([
          getJSON<RowDay[]>(uBooked.toString(), ac.signal),
          getJSON<RowDay[]>(uOccupied.toString(), ac.signal),
          getJSON<CancelFixerResp>(uCFixer.toString(), ac.signal),
          getJSON<CancelRequesterResp>(uCReq.toString(), ac.signal),
        ]);

        if (!alive) return;

        setBookedMine(new Set((rBooked ?? []).map(x => Number(x.starting_hour))));
        setOccupiedOthers(new Set((rOccupied ?? []).map(x => Number(x.starting_hour))));
        setCancelByFixer(new Set((rCFixer?.cancelled_schedules_fixer ?? []).map(x => Number(x.starting_hour))));
        setCancelByRequester(new Set((rCReq?.cancelled_schedules_requester ?? []).map(x => Number(x.starting_hour))));
      } catch(err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Requested aborted.');
          return;
        }
        console.error('Error loading appointments: ', err);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
      ac.abort();
    };
  }, [fixerId, requesterId, selectedDate]);

  const sameDay = (d: Date) => sameLocalDay(d, selectedDate);

  function isCancelledByFixer(date: Date, hour: number) {
    return sameDay(date) && cancelByFixer.has(hour);
  }
  function isCancelledByRequester(date: Date, hour: number) {
    return sameDay(date) && cancelByRequester.has(hour);
  }
  function isOccupiedByOther(date: Date, hour: number) {
    return sameDay(date) && occupiedOthers.has(hour);
  }
  function isHourBooked(date: Date, hour: number) {
    if (!sameDay(date)) return false;
    if (cancelByRequester.has(hour)) return false;
    if (cancelByFixer.has(hour)) return false;
    return bookedMine.has(hour);
  }
  function isDisabled(date: Date, hour: number) {
    if (!sameDay(date)) return true;
    if (occupiedOthers.has(hour)) return true;
    if (cancelByFixer.has(hour)) return true;
    return false;
  }

  const value: Ctx = {
    loading,
    isHourBooked,
    isOccupiedByOther,
    isDisabled,
    isCancelledByFixer,
    isCancelledByRequester,
  };

  return <CtxObj.Provider value={value}>{children}</CtxObj.Provider>;
}
