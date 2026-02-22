import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DrawerHomeStyle } from "../../../assets/styles/views/DrawerStyles";
import ProfileHeader from "../../../components/common/Navigations/ProfileHeader";
import DrawerAdministradorContent from "../../../components/drawer/DrawerAdministrador";
import DrawerCompradorContent from "../../../components/drawer/DrawerComprador";
import DrawerVendedorContent from "../../../components/drawer/DrawerVendedor";
import { Colors } from "../../../constants/theme";
import { USER_ROLES, useRaffleContext } from "../../../context/RaffleContext";

const GREEN_900 = Colors.principal.green[900];
const WHITE = "#FFFFFF";

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

export default function DrawerLayout() {
  const { userRole } = useRaffleContext();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => getDrawerContent(userRole, props)}
        screenOptions={DrawerHomeStyle}
      >
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
            ),
          }}
        />

        <Drawer.Screen
          name="home/(tab)"
          options={{
            title: "SORTEALOPE",
          }}
        />

        <Drawer.Screen
          name="mis-eventos"
          options={{
            title: "Mis Eventos",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
