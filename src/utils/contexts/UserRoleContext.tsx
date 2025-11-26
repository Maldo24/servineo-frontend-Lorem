'use client';

import { createContext, useContext, ReactNode } from 'react';

export type UserRole = 'fixer' | 'requester';



interface UserRoleContextType {
    role: UserRole;
    fixer_id: string;
    requester_id: string;
    currentUser_id: string;
    isFixer: boolean;
    isRequester: boolean;
}
const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);


interface UserRoleProviderProps {
    children: ReactNode;
    role: UserRole;
    fixer_id: string;
    requester_id: string;
}



export function UserRoleProvider({
    children,
    role,
    fixer_id,
    requester_id
}: UserRoleProviderProps) {
    const currentUser_id = role === 'fixer' ? fixer_id : requester_id;

    return (
        <UserRoleContext.Provider value={{
            role,
            fixer_id,
            requester_id,
            currentUser_id,
            isFixer: role === 'fixer',
            isRequester: role === 'requester'
        }}>
            {children}
        </UserRoleContext.Provider>
    );
}

export function useUserRole() {
    const context = useContext(UserRoleContext);
    if (!context) {
        throw new Error('useUserRole must be used within UserRoleProvider');
    }
    return context;
}

