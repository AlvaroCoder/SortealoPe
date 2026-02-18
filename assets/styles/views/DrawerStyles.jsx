import { Colors } from "../../../constants/theme";

const GREEN_900 = Colors.principal.green[900];
const RED_900 = Colors.principal.red[900];
const WHITE = "#FFFFFF";

export const DrawerHomeStyle = {
  drawerActiveTintColor: GREEN_900,
  drawerInactiveTintColor: RED_900,
  drawerLabelStyle: {
    fontSize: 16,
    fontWeight: "500",
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
  drawerItemStyle: { display: "none" },
};
