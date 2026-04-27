// constants/roles.ts

export const USER_ROLES = {
  BUYER: "Comprador",
  SELLER: "Vendedor",
  ADMIN: "Administrador",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Colores de tu theme (Colors.principal)
export const ROLE_CONFIG: Record<
  UserRole,
  {
    label: string;
    color: string;
    textColor: string; // texto del chip
    homeRoute: string; // ruta de destino post-login (fase 3)
  }
> = {
  [USER_ROLES.ADMIN]: {
    label: "Administrador",
    color: "#004739",
    textColor: "#FFFFFF",
    homeRoute: "/(app)/(drawer)/home", // tu ruta actual, cambia en fase 3
  },
  [USER_ROLES.SELLER]: {
    label: "Vendedor",
    color: "#1E82D9",
    textColor: "#FFFFFF",
    homeRoute: "/(app)/(drawer)/home",
  },
  [USER_ROLES.BUYER]: {
    label: "Comprador",
    color: "#16CD91",
    textColor: "#004739",
    homeRoute: "/(app)/(drawer)/home",
  },
};
