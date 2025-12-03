import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ProfileHeader from "../../components/common/Navigations/ProfileHeader";
import DrawerAdministradorContent from "../../components/drawer/DrawerAdministrador";
import DrawerCompradorContent from "../../components/drawer/DrawerComprador";
import DrawerVendedorContent from "../../components/drawer/DrawerVendedor";
import { Colors } from "../../constants/theme";
import { USER_ROLES, useRaffleContext } from "../../context/RaffleContext";


const GREEN_900 = Colors.principal.green[900]; 
const RED_900 = Colors.principal.red[900]; 
const WHITE = '#FFFFFF';

const getDrawerContent = (role, props) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return <DrawerAdministradorContent {...props} />; 
    case USER_ROLES.SELLER:
      return <DrawerVendedorContent {...props} />;
    case USER_ROLES.BUYER:
      return <DrawerCompradorContent {...props} />; 
    default:
      return <DrawerCompradorContent {...props} />;
  }
};

const getConditionalScreens = (isSeller, isBuyer, isAdmin) => {
  const screens = [];

  if (isAdmin) {
    screens.push(
      <Drawer.Screen key="monitor/eventos" name="monitor/eventos" options={{ drawerLabel: "Eventos Creados", title: "Gestión de Eventos" }} />,
      <Drawer.Screen key="monitor/colecciones" name="monitor/colecciones" options={{ drawerLabel: "Colecciones y Tickets", title: "Inventario Global" }} />,
      <Drawer.Screen key="monitor/vendedores" name="monitor/vendedores" options={{ drawerLabel: "Gestión de Vendedores", title: "Equipos de Venta" }} />
    );
  }

  
  if (isAdmin || isSeller) {
    screens.push(
      <Drawer.Screen key="vendedor/crear-evento" name="vendedor/crear-evento" options={{ drawerLabel: "Crear Evento / Colección", title: "Creación" }} />
    );
  }

  if (isAdmin || isSeller || isBuyer) {
      screens.push(
        <Drawer.Screen key="comprador/mis-tickets" name="comprador/mis-tickets" options={{ drawerLabel: "Mis Tickets Comprados", title: "Mis Compras" }} />
      );
  }

  return screens;
};

export default function DrawerLayout() {
  const { userRole } = useRaffleContext();
  
  const isAdmin = userRole === USER_ROLES.ADMIN;
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
            backgroundColor: GREEN_900,
            elevation: 0,
            shadowOpacity: 0,
            shadowColor: "transparent",
            shadowOffset: { height: 0, width: 0 },
            shadowRadius: 0,
            
          },
          headerTintColor: WHITE, 
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 18,
            color: WHITE, 
          },
          headerShadowVisible: false,
          drawerStyle: {
            backgroundColor: WHITE,
            width: 280,
          },
          drawerItemStyle: { display: 'none' } 
        }}
      >
        <Drawer.Screen 
          name="(tabs)" 
          options={{ 
            title: 'Inicio Principal',
          }} 
        />

        <Drawer.Screen
          name="(tabs)/crear"
          options={{
            headerShown : false
          }}
        />  
        {getConditionalScreens(isSeller, isBuyer, isAdmin)}
        
        <Drawer.Screen 
          name="index" 
          options={{ title: "Buscar Eventos" }} 
        />
        <Drawer.Screen 
          name="profile" 
          options={{
            title: "Mi Perfil",
            header: ({ navigation, route, options }) => (
                <ProfileHeader
                    navigation={navigation}
                    title={options.title}
                    backgroundColor={GREEN_900}
                    headerTintColor={WHITE}
                />
            )
          }}
          
        />
        
      </Drawer>
    </GestureHandlerRootView>
  );
}