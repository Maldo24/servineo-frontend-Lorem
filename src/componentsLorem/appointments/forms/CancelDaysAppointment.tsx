import React, { useState, useEffect } from 'react';
import { Button } from '../../atoms/button';
import axios from 'axios';
import { useUserRole } from "@/utils/contexts/UserRoleContext";
import { AlertPopup } from '../forms/popups/AlertPopup';

interface Appointment {
  _id: string;
  selected_date: string;
  client_name?: string;
  service_type?: string;
}

interface DayWithAppointments {
  date: string;
  appointmentCount: number;
  dayName: string;
  dayNumber: number;
  monthName: string;
  appointmentIds: string[];
  appointments: Appointment[];
}

interface CancelDaysAppointmentsProps {
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
  fixer_id?: string;
}

export const CancelDaysAppointments: React.FC<CancelDaysAppointmentsProps> = ({
  isOpen,
  onClose,
  loading = false,
  fixer_id
}) => {
  
  const FIXER_ID = fixer_id;
  
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [daysWithAppointments, setDaysWithAppointments] = useState<DayWithAppointments[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [fetchLoading, setFetchLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [totalAppointmentsToCancel, setTotalAppointmentsToCancel] = useState(0);
  
  const API_BASE = 'https://servineo-backend-lorem.onrender.com/api';
  
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const normalizeDate = (dateString: string): { normalizedDate: string, localDate: Date } => {
    try {
      const utcDate = new Date(dateString);
      const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
      
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      
      return {
        normalizedDate: `${year}-${month}-${day}`,
        localDate: localDate
      };
    } catch (error) {
      const fallbackDate = new Date(dateString.split('T')[0]);
      return {
        normalizedDate: dateString.split('T')[0],
        localDate: fallbackDate
      };
    }
  };

  const fetchDaysWithAppointments = async (month: number, year: number) => {
    setFetchLoading(true);
    setError(null);
    
    try {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      
      const response = await axios.get(
        `${API_BASE}/crud_read/appointments/get_all_appointments_by_fixer_date`,
        {
          params: {
            id_fixer: FIXER_ID, 
            date: date
          }
        }
      );
      
      if (response.data && response.data.appointments && Array.isArray(response.data.appointments)) {
        const appointmentsByDay: { [key: string]: { count: number, ids: string[], localDate: Date, appointments: Appointment[] } } = {};
        
        response.data.appointments.forEach((appointment: any) => {
          if (appointment && appointment.selected_date && !appointment.cancelled_fixer) {
            try {
              const { normalizedDate, localDate } = normalizeDate(appointment.selected_date);
              
              if (!appointmentsByDay[normalizedDate]) {
                appointmentsByDay[normalizedDate] = { 
                  count: 0, 
                  ids: [],
                  localDate: localDate,
                  appointments: []
                };
              }
              
              appointmentsByDay[normalizedDate].count += 1;
              appointmentsByDay[normalizedDate].ids.push(appointment._id);
              appointmentsByDay[normalizedDate].appointments.push(appointment);
              
            } catch (dateError) {
              console.error('Error procesando fecha:', dateError);
            }
          }
        });
        
        const formattedData: DayWithAppointments[] = Object.entries(appointmentsByDay).map(([date, data]) => {
          const localDate = data.localDate;
          
          return {
            date: date,
            appointmentCount: data.count,
            dayName: dayNames[localDate.getDay()],
            dayNumber: localDate.getDate(),
            monthName: months[localDate.getMonth()],
            appointmentIds: data.ids,
            appointments: data.appointments
          };
        });
        
        formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return formattedData;
      } else {
        return [];
      }
      
    } catch (error: any) {
      setError('Error al cargar las citas');
      return [];
    } finally {
      setFetchLoading(false);
    }
  };

  const cancelAppointmentsForDay = async (day: DayWithAppointments) => {
    let successCount = 0;
    let failedCount = 0;
    
    for (const appointmentId of day.appointmentIds) {
      try {
        console.log('Canceling appointment ID:', appointmentId);
        
        const response = await axios.put(
          `${API_BASE}/crud_update/appointments/update_cancell_appointment_fixer?appointment_id=${appointmentId}`,
          {}, 
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data && response.data.succeed === true) {
          successCount++;
        } else {
          failedCount++;
        }
      } catch (error: any) {
        console.log('Error details:', error.response?.data);
        failedCount++;
      }
    }
    
    return { success: successCount, failed: failedCount };
  };

  const handleConfirm = async () => {
    if (cancelLoading || selectedDays.length === 0) return;
    
    // Calcular el total de citas a cancelar
    const total = daysWithAppointments
      .filter(day => selectedDays.includes(day.date))
      .reduce((sum, day) => sum + day.appointmentCount, 0);
    
    setTotalAppointmentsToCancel(total);
    setShowConfirmPopup(true);
  };

  const executeCancellation = async () => {
    const selectedDaysData = daysWithAppointments.filter(day => 
      selectedDays.includes(day.date)
    );
    setError(null);
    setSuccessMessage(null);
    setCancelLoading(true);
    
    try {
      let totalSuccess = 0;
      let totalFailed = 0;
      
      for (const day of selectedDaysData) {
        const result = await cancelAppointmentsForDay(day);
        totalSuccess += result.success;
        totalFailed += result.failed;
      }
      
      if (totalSuccess > 0) {
        const successMsg = `Se cancelaron ${totalSuccess} cita${totalSuccess !== 1 ? 's' : ''}`;
        if (totalFailed > 0) {
          setSuccessMessage(`${successMsg}. ${totalFailed} cita${totalFailed !== 1 ? 's' : ''} no se pudieron cancelar.`);
        } else {
          setSuccessMessage(successMsg);
        }
        
        setSelectedDays([]);
        
        // Cerrar el modal después de un breve delay y recargar la página
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1500);
        
      } else {
        setError('No se pudo cancelar ninguna cita');
        setShowConfirmPopup(false);
      }
      
    } catch (error: any) {
      setError('Error al cancelar las citas');
      setShowConfirmPopup(false);
    } finally {
      setCancelLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (isOpen) {
        const data = await fetchDaysWithAppointments(currentMonth, currentYear);
        setDaysWithAppointments(data || []);
        setSelectedDays([]);
        setError(null);
        setSuccessMessage(null);
        setTotalAppointmentsToCancel(0);
      }
    };

    loadData();
  }, [isOpen, currentMonth, currentYear]);

  const toggleDaySelection = (date: string) => {
    setSelectedDays(prev => {
      if (prev.includes(date)) {
        return prev.filter(d => d !== date);
      } else if (prev.length < 5) {
        return [...prev, date];
      }
      return prev;
    });
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  };

  if (!isOpen) return null;
  
  const isLoading = loading || cancelLoading;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-auto max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 h-12 px-3 sm:px-4 flex items-center justify-between flex-shrink-0">
          <div className="w-6"></div>
          <h3 className="text-white font-semibold text-base sm:text-lg text-center">
            Cancelar Citas por Día
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 sm:w-6 sm:h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Messages */}
          {(error || successMessage) && (
            <div className="flex-shrink-0 px-3 sm:px-4 pt-3 sm:pt-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded text-sm sm:text-base">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 sm:px-4 sm:py-3 rounded text-sm sm:text-base">
                  {successMessage}
                </div>
              )}
            </div>
          )}

          {/* Month Navigation */}
          <div className="flex items-center justify-between sm:justify-center sm:space-x-4 py-3 sm:py-4 flex-shrink-0 px-3 sm:px-0">
            <button
              onClick={() => changeMonth('prev')}
              className="text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 p-1"
              disabled={fetchLoading || isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            
            <h2 className="text-black text-lg sm:text-xl text-center font-medium">
              {months[currentMonth]} {currentYear}
              {fetchLoading && (
                <span className="text-sm font-normal block sm:inline sm:ml-2 mt-1 sm:mt-0">
                  (Cargando...)
                </span>
              )}
            </h2>
            
            <button
              onClick={() => changeMonth('next')}
              className="text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 p-1"
              disabled={fetchLoading || isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>

          {/* Days List */}
          <div className="px-3 sm:px-6 pb-3 sm:pb-4 flex-1 overflow-y-auto">
            {fetchLoading ? (
              <div className="text-center py-6 sm:py-8">
                <div className="inline-block animate-spin rounded-full h-7 w-7 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600 text-sm sm:text-base">Cargando citas...</p>
              </div>
            ) : daysWithAppointments.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                No hay citas programadas para {months[currentMonth]} {currentYear}
              </div>
            ) : (
              <>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 text-center">
                  Selecciona los días que deseas cancelar (máximo 5)
                </p>

                <div className="space-y-2 sm:space-y-3">
                  {daysWithAppointments.map((day) => (
                    <div
                      key={day.date}
                      className={`text-black flex items-center justify-between p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedDays.includes(day.date)
                          ? 'bg-blue-50 border-blue-500 shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                      } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => !isLoading && toggleDaySelection(day.date)}
                    >
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-semibold text-base sm:text-lg truncate">
                          {day.dayName} {day.dayNumber} de {day.monthName}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-600 mt-1">
                          {day.appointmentCount} {day.appointmentCount === 1 ? 'cita programada' : 'citas programadas'}
                        </span>
                      </div>
                      
                      <div className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 border-2 rounded flex items-center justify-center transition-colors ml-2 ${
                        selectedDays.includes(day.date) 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-400'
                      }`}>
                        {selectedDays.includes(day.date) && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 sm:mt-6 p-2 sm:p-3 bg-gray-50 rounded-lg text-left">
                  <strong className="text-gray-800 text-sm sm:text-base">
                    Seleccionado: {selectedDays.length}
                  </strong>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="border-t p-3 sm:p-4 flex justify-end space-x-2 sm:space-x-3 flex-shrink-0">
          <Button
            onClick={handleConfirm}
            loading={cancelLoading}
            disabled={selectedDays.length === 0 || isLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 font-medium disabled:opacity-50 min-w-28 sm:min-w-32 text-sm sm:text-base"
          >
            {cancelLoading ? 'Cancelando...' : `Cancelar`}
          </Button>

          <AlertPopup
            open={showConfirmPopup}
            onClose={() => setShowConfirmPopup(false)}
            variant="confirm"
            title="Confirmar Cancelación"
            message={
              <div>
                ¿Está seguro de que desea cancelar las citas de {selectedDays.length} día{selectedDays.length !== 1 ? 's' : ''} ({totalAppointmentsToCancel} cita{totalAppointmentsToCancel !== 1 ? 's' : ''}) seleccionado{selectedDays.length !== 1 ? 's' : ''}?
                <br />
                <span className="text-red-600 font-medium">Esta acción no se puede deshacer.</span>
              </div>
            }
            confirmLabel="Sí, Cancelar"
            cancelLabel="Volver"
            onConfirm={executeCancellation} 
          />
        </div>
      </div>
    </div>
  );
};

export default CancelDaysAppointments;