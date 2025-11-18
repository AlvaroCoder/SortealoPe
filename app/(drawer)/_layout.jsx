import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "../../constants/theme";

// Componente personalizado para el Header del Drawer
function CustomDrawerContent(props) {
  const { navigation } = props;

  return (
    <View style={styles.drawerContainer}>
      {/* Logo y nombre de la app */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🎯</Text>
          </View>
        </View>
        <Text style={styles.appName}>SORTEALOPE</Text>
        <Text style={styles.appTagline}>Tus sorteos favoritos</Text>
      </View>

      {/* Sección de navegación */}
      <View style={styles.navigationSection}>
        <Text style={styles.sectionTitle}>NAVEGACIÓN</Text>
        
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("index")}
        >
          <View style={styles.navIconContainer}>
            <Ionicons name="home" size={22} color={Colors.principal.red[500]} />
          </View>
          <Text style={styles.navLabel}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("my-events")}
        >
          <View style={styles.navIconContainer}>
            <Ionicons name="calendar" size={22} color={Colors.principal.red[500]} />
          </View>
          <Text style={styles.navLabel}>Mis eventos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("my-tickets")}
        >
          <View style={styles.navIconContainer}>
            <Ionicons name="ticket" size={22} color={Colors.principal.red[500]} />
          </View>
          <Text style={styles.navLabel}>Mis tickets</Text>
        </TouchableOpacity>
      </View>

      {/* Perfil de usuario */}
      <View style={styles.profileSection}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("profile")}
        >
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={20} color={Colors.white} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Juan Pérez</Text>
            <Text style={styles.profileEmail}>juan@example.com</Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={18} 
            color={Colors.principal.red[900]} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveTintColor: Colors.principal.red[900],
          drawerInactiveTintColor: Colors.principal.red[800],
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: '500',
            marginLeft: -16,
          },
          headerStyle: {
            backgroundColor: Colors.white,
            elevation: 0,
            shadowOpacity: 0,
            shadowColor: "transparent",
            shadowOffset: {
              height: 0,
              width: 0,
            },
            shadowRadius: 0,
          },
          headerTintColor: Colors.principal.red[900],
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 18,
          },
          headerShadowVisible: false,
          drawerStyle: {
            backgroundColor: Colors.white,
            width: 280,
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Inicio",
            title: "Inicio",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        
        <Drawer.Screen
          name="my-events"
          options={{
            drawerLabel: "Mis eventos",
            title: "Mis Eventos",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />
        
        <Drawer.Screen
          name="my-tickets"
          options={{
            drawerLabel: "Mis tickets",
            title: "Mis Tickets",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="ticket" size={size} color={color} />
            ),
          }}
        />
        
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: "Mi perfil",
            title: "Mi Perfil",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
            drawerItemStyle: { display: 'none' } // Ocultar del drawer estándar
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: Colors.principal.yellow[50],
    borderBottomWidth: 1,
    borderBottomColor: Colors.principal.red[100],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.principal.yellow[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: Colors.principal.red[100],
  },
  logoText: {
    fontSize: 32,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.principal.red[900],
    textAlign: 'center',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: Colors.principal.yellow[100],
    textAlign: 'center',
    fontWeight: '500',
  },
  navigationSection: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.principal.red[900],
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
    color: Colors.principal.red[500],
  },
  profileSection: {
    marginTop: 'auto',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.principal.red[100],
    backgroundColor: 'white',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.principal.red[500],
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
    color: Colors.principal.red[900],
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    color: Colors.principal.red[500],
  },
});