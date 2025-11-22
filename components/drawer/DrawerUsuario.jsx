import { Ionicons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Colors } from "../../constants/theme";
import { useRaffleContext } from "../../context/RaffleContext";
import RoleSwitchButton from "../common/Buttons/RoleSwitchButton";

const GREEN_500 = Colors.principal.green[500]; 
const GREEN_900 = Colors.principal.green[900]; 
const RED_500 = Colors.principal.red[500];
const WHITE = '#FFFFFF';
const RED_900 = Colors.principal.red[900]; 
const GREEN_50 = Colors.principal.green[50]; 
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_100 = Colors.principal.neutral[100];
const BLACK = '#000000'; 


export default function DrawerUsuarioContent(props) {
  const { navigation } = props;
  const { userRole, updateRole } = useRaffleContext();

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>📊</Text>
          </View>
        </View>
        <Text style={styles.appName}>SORTEALOPE</Text>
        <Text style={styles.appTagline}>Panel de Monitoreo y Gestión</Text>
      </View>

      <View style={styles.navigationSection}>
        <Text style={styles.sectionTitle}>MONITOREO Y GESTIÓN</Text>
        
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("monitor/eventos")}
        >
          <View style={styles.navIconContainer}>
            <Ionicons name="calendar-outline" size={22} color={RED_500} />
          </View>
          <Text style={styles.navLabel}>Eventos Creados</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("monitor/colecciones")}
        >
          <View style={styles.navIconContainer}>
            <Ionicons name="receipt-outline" size={22} color={RED_500} />
          </View>
          <Text style={styles.navLabel}>Colecciones y Tickets</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("monitor/vendedores")}
        >
          <View style={styles.navIconContainer}>
            <Ionicons name="people-outline" size={22} color={RED_500} />
          </View>
          <Text style={styles.navLabel}>Gestión de Vendedores</Text>
        </TouchableOpacity>
        
        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>CATÁLOGO</Text>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("index")}
        >
          <View style={styles.navIconContainer}>
            <Ionicons name="search-outline" size={22} color={GREEN_500} />
          </View>
          <Text style={styles.navLabel}>Buscar Eventos</Text>
        </TouchableOpacity>
        
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("profile")}
        >
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={20} color={WHITE} /> 
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Monitor ({userRole})</Text>
            <View>
              <Text style={styles.profileEmail}>admin@example.com</Text>
            </View>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={18} 
            color={GREEN_900} 
          />
        </TouchableOpacity>
        
        <RoleSwitchButton currentRole={userRole} updateRole={updateRole} />
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
    backgroundColor: GREEN_50, 
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
    backgroundColor: GREEN_50,
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
    color: RED_900, 
    textAlign: 'center',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: GREEN_900, 
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
    color: RED_900, 
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
    backgroundColor: Colors.principal.red[50], 
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  navLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: NEUTRAL_700, 
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
  roleSwitchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RED_500,
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  roleSwitchText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: NEUTRAL_100,
    marginVertical: 16,
    marginHorizontal: 16,
  }
});