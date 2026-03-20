import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DrawerHomeStyle } from "../../../assets/styles/views/DrawerStyles";
import ProfileHeader from "../../../components/common/Navigations/ProfileHeader";
import DrawerContent from "../../../components/drawer/DrawerContent";
import { Colors } from "../../../constants/theme";

const GREEN_900 = Colors.principal.green[900];
const WHITE = "#FFFFFF";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={DrawerHomeStyle}
      >
        <Drawer.Screen
          name="profile"
          options={{
            title: "Mi Perfil",
            header: ({ navigation, options }) => (
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
