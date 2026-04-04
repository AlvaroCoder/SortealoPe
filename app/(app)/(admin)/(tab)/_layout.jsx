import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../../../constants/theme";

const GREEN_900 = Colors.principal.green[900];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400];
const WHITE = "#FFFFFF";

const TABS = [
  { name: "index", label: "Home", icon: "home-outline", iconActive: "home" },
  {
    name: "events",
    label: "Eventos",
    icon: "calendar-outline",
    iconActive: "calendar",
  },
  {
    name: "team",
    label: "Equipo",
    icon: "people-outline",
    iconActive: "people",
  },
  {
    name: "profile",
    label: "Perfil",
    icon: "person-outline",
    iconActive: "person",
  },
];

function CustomTabBar({ state, descriptors, navigation }) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBar,
        { paddingBottom: bottom + 8, height: 65 + bottom },
      ]}
    >
      {state.routes.map((route, index) => {
        const tabConfig = TABS.find((t) => t.name === route.name) ?? TABS[0];
        const isFocused = state.index === index;
        const color = isFocused ? GREEN_900 : NEUTRAL_400;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            <Ionicons
              name={isFocused ? tabConfig.iconActive : tabConfig.icon}
              size={22}
              color={color}
            />
            <Text style={[styles.tabLabel, { color }]}>{tabConfig.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function AdminTabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="events" />
      <Tabs.Screen name="team" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_200,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
});
