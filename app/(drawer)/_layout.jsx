import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "../../constants/theme";
// 🟢 Importamos el Contexto y los componentes de Drawer
import DrawerInvitadoContent from "../../components/drawer/DrawerInvitado";
import DrawerUsuarioContent from "../../components/drawer/DrawerUsuario";
import DrawerVendedorContent from "../../components/drawer/DrawerVendedor";
import { USER_ROLES, useRaffleContext } from "../../context/RaffleContext";

// --- CONSTANTES DE COLOR ---
const GREEN_900 = Colors.principal.green[900]; 
const RED_900 = Colors.principal.red[900]; 
const WHITE = '#FFFFFF';
// ---------------------------

const getDrawerContent = (role, props) => {
  switch (role) {
    case USER_ROLES.GUEST:
      return <DrawerInvitadoContent {...props} />;
    case USER_ROLES.BUYER:
      return <DrawerVendedorContent {...props} />; 
    case USER_ROLES.SELLER:
      return <DrawerUsuarioContent {...props} />;
    default:
      return <DrawerInvitadoContent {...props} />;
  }
};

export default function DrawerLayout() {
  const { userRole } = useRaffleContext();
  
  const isGuest = userRole === USER_ROLES.GUEST;
  const isBuyer = userRole === USER_ROLES.BUYER;
  const isSeller = userRole === USER_ROLES.SELLER;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => getDrawerContent(userRole, props)}
        screenOptions={{
          drawerActiveTintColor: GREEN_900,
          drawerInactiveTintColor: RED_900,
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: '500',
            marginLeft: -16,
          },
          headerStyle: {
            backgroundColor: WHITE,
            elevation: 0,
            shadowOpacity: 0,
            shadowColor: "transparent",
            shadowOffset: { height: 0, width: 0 },
            shadowRadius: 0,
          },
          headerTintColor: GREEN_900, 
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 18,
          },
          headerShadowVisible: false,
          drawerStyle: {
            backgroundColor: WHITE,
            width: 280,
          },
          drawerItemStyle: { display: 'none' }
        }}
      >
        {isSeller && (
          <Drawer.Screen
            name="monitor/eventos"
            options={{ drawerLabel: "Eventos Creados", title: "Gestión de Eventos" }}
          />
        )}
        {isSeller && (
          <Drawer.Screen
            name="monitor/colecciones"
            options={{ drawerLabel: "Colecciones y Tickets", title: "Inventario Global" }}
          />
        )}
        {isSeller && (
          <Drawer.Screen
            name="monitor/vendedores"
            options={{ drawerLabel: "Gestión de Vendedores", title: "Equipos de Venta" }}
          />
        )}
        
        {(isBuyer || isSeller) && (
          <Drawer.Screen
            name="vendedor/inventario"
            options={{ drawerLabel: "Mis Tickets para Vender", title: "Inventario Asignado" }}
          />
        )}
        {(isBuyer || isSeller) && (
          <Drawer.Screen
            name="vendedor/crear-evento"
            options={{ drawerLabel: "Crear Evento / Colección", title: "Creación" }}
          />
        )}
        {(isBuyer || isSeller) && (
          <Drawer.Screen
            name="comprador/mis-tickets"
            options={{ drawerLabel: "Mis Tickets Comprados", title: "Mis Compras" }}
          />
        )}

        {/* ======================================================= */}
        {/* RUTAS COMUNES (TODOS LOS ROLES)               */}
        {/* ======================================================= */}

        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Buscar Eventos",
            title: "Rifas Disponibles",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="search-outline" size={size} color={Colors.principal.green[500]} />
            ),
          }}
        />
        
        <Drawer.Screen
          name="profile"
          options={{ drawerLabel: "Mi perfil", title: "Mi Perfil" }}
        />
        
      </Drawer>
    </GestureHandlerRootView>
  );
}

