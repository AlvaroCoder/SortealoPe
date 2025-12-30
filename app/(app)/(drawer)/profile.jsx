import { Ionicons } from '@expo/vector-icons';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import ProfileRow from '../../../components/cards/ProfileRow';
import ButtonGradiend from '../../../components/common/Buttons/ButtonGradiendt'; // 🧩 Asumo que existe
import { Colors, Typography } from '../../../constants/theme';
import { USER_ROLES, useRaffleContext } from '../../../context/RaffleContext';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const WHITE = '#FFFFFF';
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];

const mockUserData = {
  name: "Alvaro Coder",
  email: "alvaro.coder@sortealope.com",
  phone: "+51 987 654 321",
};

export default function Perfil() {
  const { userRole, updateRole } = useRaffleContext();
  const userData = mockUserData;
  
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar tu sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Cerrar Sesión", 
          onPress: () => {
             updateRole(USER_ROLES.BUYER, null); 
             Alert.alert("Sesión Cerrada", "Has cerrado sesión con éxito.");
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={80} color={WHITE} />
        </View>
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userRole}>Modo Actual: {userRole}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos de Contacto</Text>
        
        <ProfileRow 
          icon="mail-outline" 
          label="Correo Electrónico" 
          value={userData.email} 
        />
        <ProfileRow 
          icon="call-outline" 
          label="Teléfono" 
          value={userData.phone} 
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ajustes y Preferencias</Text>
        
        <ProfileRow 
          icon="lock-closed-outline" 
          label="Cambiar Contraseña" 
          value="********" 
        />
        <ProfileRow 
          icon="notifications-outline" 
          label="Notificaciones" 
          value="Activadas" 
        />
      </View>

      <View style={styles.logoutContainer}>
        <ButtonGradiend 
          onPress={handleLogout}
          style={{ backgroundColor: RED_500 }} 
        >
          Cerrar Sesión
        </ButtonGradiend>
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  header: {
    paddingVertical: 30,
    backgroundColor: Colors.principal.green[50], 
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: GREEN_500, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  userRole: {
    fontSize: Typography.sizes.base,
    color: NEUTRAL_700,
    marginTop: 5,
  },

  section: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.principal.green[200],
    paddingBottom: 5,
  },

  logoutContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  }
});