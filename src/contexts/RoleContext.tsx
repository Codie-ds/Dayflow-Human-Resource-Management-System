import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '@/lib/mockData';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  isHR: boolean;
  isEmployee: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('admin');

  const value: RoleContextType = {
    role,
    setRole,
    isAdmin: role === 'admin',
    isHR: role === 'hr',
    isEmployee: role === 'employee',
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
