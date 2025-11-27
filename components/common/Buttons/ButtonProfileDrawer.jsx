import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Typography } from "../../../constants/theme";
import { USER_ROLES } from "../../../context/RaffleContext";

const GREEN_500 = Colors.principal.green[500];
const GREEN_900 = Colors.principal.green[900];
const WHITE = "#FFFFFF";
const BLACK = "#000000";

export default function ButtonProfileDrawer({
  userName,
  userRole,
  onPress,
  userId,
}) {
  const roleIcon = (userRole) => {
    switch (userRole) {
      case USER_ROLES.ADMIN:
        return "server-outline";
      case USER_ROLES.SELLER:
        return "business-outline";
      case USER_ROLES.BUYER:
        return "person-circle-outline";
      default:
        return "person-outline";
    }
  };

  return (
    <TouchableOpacity style={styles.profileButton} onPress={onPress}>
      <View style={styles.profileAvatar}>
        <Ionicons name={roleIcon(userRole)} size={24} color={WHITE} />
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{userName || "Usuario"}</Text>

              <View style={{ width: 'auto', display: 'flex' , alignItems : 'flex-start'}}>
          <Text style={styles.profileRole}>{userRole}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={GREEN_900} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: WHITE,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 2,
    borderColor: GREEN_900,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: GREEN_500,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 2,
  },
  profileRole: {
    fontSize: Typography.sizes.sm,
    color: Colors.principal.green[600],
    backgroundColor: Colors.principal.yellow[200],
    padding: 5,
    borderRadius: 10,
    fontWeight: Typography.weights.medium,
  },
});
