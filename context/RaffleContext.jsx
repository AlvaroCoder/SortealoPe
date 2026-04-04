// context/RaffleContext.jsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

export const USER_ROLES = {
  BUYER: "Comprador",
  SELLER: "Vendedor",
  ADMIN: "Administrador",
};

const ROLE_STORAGE_KEY = "userRole";

const RaffleContext = createContext();

export const useRaffleContext = () => {
  const context = useContext(RaffleContext);
  if (context === undefined) {
    throw new Error("useRaffleContext debe usarse dentro de un RaffleProvider");
  }
  return context;
};

export const RaffleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(USER_ROLES.ADMIN);
  const [userId, setUserId] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  // Restaura el rol guardado al iniciar la app
  useEffect(() => {
    async function restoreRole() {
      try {
        const saved = await AsyncStorage.getItem(ROLE_STORAGE_KEY);
        if (saved && Object.values(USER_ROLES).includes(saved)) {
          setUserRole(saved);
        }
      } catch (err) {
        console.log("Error restaurando rol:", err);
      } finally {
        setRoleLoading(false);
      }
    }
    restoreRole();
  }, []);

  // Guarda el rol cada vez que cambia
  const updateRole = async (newRole, id) => {
    if (!Object.values(USER_ROLES).includes(newRole)) {
      console.error(`Rol desconocido: ${newRole}`);
      return;
    }
    try {
      await AsyncStorage.setItem(ROLE_STORAGE_KEY, newRole);
      setUserRole(newRole);
      if (id) setUserId(id);
    } catch (err) {
      console.log("Error guardando rol:", err);
    }
  };

  // Limpia el rol al cerrar sesión — llama esto desde tu signout
  const clearRole = async () => {
    try {
      await AsyncStorage.removeItem(ROLE_STORAGE_KEY);
      setUserRole(USER_ROLES.ADMIN);
      setUserId(null);
    } catch (err) {
      console.log("Error limpiando rol:", err);
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
    roleLoading, // úsalo igual que authLoading si necesitas esperar
    updateRole,
    clearRole, // nuevo — úsalo en tu signout
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
    <RaffleContext.Provider value={value}>{children}</RaffleContext.Provider>
  );
};
