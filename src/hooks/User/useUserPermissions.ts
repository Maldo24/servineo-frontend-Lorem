// hooks/useUserPermissions.ts
import { useUserRole } from '@/utils/contexts/UserRoleContext';

export function useUserPermissions() {
    const { role, isFixer, isRequester } = useUserRole();

    return {

        canSetAvailability: isFixer,
        canEditOwnSchedule: isFixer,
        canViewAllAppointments: isFixer,

        canRequestAppointment: isRequester,
        canViewAvailableSlots: isRequester,

        canCancelAppointment: true,
        canViewAppointmentDetails: true,
        canReceiveNotifications: true,

        getViewMode: () => isFixer ? 'manage' : 'book' as const,
    };
}
