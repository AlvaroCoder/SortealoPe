import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Colors } from "../../constants/theme";
import { useRaffleContext } from "../../context/RaffleContext";
import ButtonProfileDrawer from "../common/Buttons/ButtonProfileDrawer";


const GREEN_500 = Colors.principal.green[500]; 
const GREEN_900 = Colors.principal.green[900]; 
const RED_900 = Colors.principal.red[900]; 
const WHITE = '#FFFFFF';
const GREEN_50 = Colors.principal.green[50]; 
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_100 = Colors.principal.neutral[100];
const BLACK = '#000000'; 
const URL_IMAGEN_MASCOTA = "https://res.cloudinary.com/dabyqnijl/image/upload/v1764234644/COSAI_LOGOS_1_1_dbzabh.png"


export default function DrawerCompradorContent(props) {
  const { navigation } = props;
  const { userRole } = useRaffleContext();

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Image
              source={{ uri: URL_IMAGEN_MASCOTA }}
              style={styles.mascotImage}
              resizeMode="cover"
            />
          </View>
        </View>
        <Text style={styles.appName}>SORTEALOPE</Text>
        <Text style={styles.appTagline}>Panel Comprador</Text>
      </View>

      <View style={styles.navigationSection}>
        <Text style={styles.sectionTitle}>INFORMACIÓN </Text>
        <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("comprador/mis-tickets")}
          >
            <View style={styles.navIconContainer}>
              <Ionicons name="receipt-outline" size={22} color={GREEN_900} />
            </View>
            <Text style={styles.navLabel}>Tickets Comprados</Text>
        </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("comprador/mis-tickets")}
          >
            <View style={styles.navIconContainer}>
              <Ionicons name="receipt-outline" size={22} color={GREEN_900} />
            </View>
            <Text style={styles.navLabel}>Tickets Reservados</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <ButtonProfileDrawer
        userName={"AlvaroCoder"}
        userRole={userRole}
        onPress={()=>{}}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: Colors.principal.neutral[50], 
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_100,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.principal.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: NEUTRAL_100,
  },
  logoText: {
    fontSize: 32,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: GREEN_900, 
    textAlign: 'center',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: GREEN_500, 
    textAlign: 'center',
    fontWeight: '500',
  },
  navigationSection: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor : WHITE
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: GREEN_900, 
    marginBottom: 16,
    marginLeft: 16,
    letterSpacing: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: GREEN_50, 
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  navLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: GREEN_900, 
  },
  profileSection: {
    marginTop: 'auto',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_100,
    backgroundColor: WHITE,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: WHITE,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 10, 
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GREEN_500, 
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: RED_900, 
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    color: GREEN_500, 
  },
  roleSwitchTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: NEUTRAL_700,
      marginTop: 10,
      marginBottom: 5,
  },
  roleSwitchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: GREEN_500,
    marginTop: 5,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  activeRoleButton: {
      backgroundColor: Colors.principal.green[100],
      borderWidth: 1,
      borderColor: GREEN_900,
      elevation: 0,
  },
  roleSwitchText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: NEUTRAL_100,
    marginVertical: 16,
    marginHorizontal: 16,
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
});