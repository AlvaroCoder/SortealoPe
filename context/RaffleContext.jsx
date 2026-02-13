import { createContext, useContext, useState } from 'react';

export const USER_ROLES = {
  BUYER: 'Comprador',   
  SELLER: 'Vendedor',   
  ADMIN: 'Administrador', 
};

const RaffleContext = createContext();

export const useRaffleContext = () => {
  const context = useContext(RaffleContext);
  if (context === undefined) {
    throw new Error('useRaffleContext debe usarse dentro de un RaffleProvider');
  }
  return context;
};

export const RaffleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(USER_ROLES.ADMIN); 
  const [userId, setUserId] = useState(null);

  const updateRole = (newRole, id) => {
    if (Object.values(USER_ROLES).includes(newRole)) {
      setUserRole(newRole);
      setUserId(id);
      console.log(`Rol actualizado a: ${newRole}`);
    } else {
      console.error(`Rol desconocido: ${newRole}`);
    }
  };

  const isBuyer = userRole === USER_ROLES.BUYER;
  const isSeller = userRole === USER_ROLES.SELLER;
  const isAdmin = userRole === USER_ROLES.ADMIN;

  const canMonitorApp = isAdmin; 

  const canCreateEvent = isAdmin || isSeller; 
  const canViewSales = isAdmin || isSeller; 
  const canBuyTickets = isAdmin || isSeller || isBuyer; 
  const canViewPurchasedTickets = isAdmin || isSeller || isBuyer;

  const value = {
    userRole,
    userId,
    updateRole,
    
    isBuyer,
    isSeller,
    isAdmin, 
    
    canMonitorApp, 
    canCreateEvent,
    canBuyTickets,
    canViewSales,
    canViewPurchasedTickets,
  };

  return (
    <RaffleContext.Provider value={value}>
      {children}
    </RaffleContext.Provider>
  );
};

