import { createContext, useContext, useState } from 'react';

export const USER_ROLES = {
  GUEST: 'Usuario',      
  BUYER: 'Comprador',   
  SELLER: 'Vendedor',   
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
  const [userRole, setUserRole] = useState(USER_ROLES.GUEST);
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

  const canCreateEvent = userRole === USER_ROLES.SELLER;

  const canBuyTickets = userRole === USER_ROLES.BUYER || userRole === USER_ROLES.SELLER;

  const canViewSales = userRole === USER_ROLES.SELLER;

  const canViewPurchasedTickets = userRole === USER_ROLES.BUYER || userRole === USER_ROLES.SELLER;

  const value = {
    userRole,
    userId,
    updateRole,
    
    isGuest: userRole === USER_ROLES.GUEST,
    isBuyer: userRole === USER_ROLES.BUYER,
    isSeller: userRole === USER_ROLES.SELLER,

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

export const RoleBasedView = ({ allowedRoles = [], children, fallback = null }) => {
    const { userRole } = useRaffleContext();
    
    if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
        return children;
    }
    
    return fallback;
};