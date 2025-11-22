import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../../constants/theme';
import { USER_ROLES } from '../../../context/RaffleContext';

const GREEN_500 = Colors.principal.green[500]; 
const RED_500 = Colors.principal.red[500];
const WHITE = '#FFFFFF';
const BLACK = '#000000'; 
// 

export default function RoleSwitchButton({
    currentRole,
    updateRole
}) {
    
    const isGuest = currentRole === USER_ROLES.GUEST;
    
    let targetRole;
    let buttonLabel;

    if (isGuest) {
        targetRole = USER_ROLES.BUYER;
        buttonLabel = "Iniciar Sesión / Registrarse";
    } else if (currentRole === USER_ROLES.BUYER) {
        targetRole = USER_ROLES.SELLER;
        buttonLabel = "Cambiar a Vendedor (Mock)";
    } else if (currentRole === USER_ROLES.SELLER) {
        targetRole = USER_ROLES.BUYER;
        buttonLabel = "Cambiar a Comprador (Mock)";
    } else {
        targetRole = USER_ROLES.GUEST;
        buttonLabel = "Cerrar Sesión";
    }

    const buttonStyle = [
      styles.roleSwitchButton, 
      isGuest ? styles.authButton : styles.logoutButton
    ];

  return (
    <TouchableOpacity 
      style={buttonStyle} 
      onPress={() => updateRole(targetRole)}
    >
      <Ionicons 
        name={isGuest ? "log-in-outline" : "log-out-outline"} 
        size={20} 
        color={WHITE} 
      />
      <Text style={styles.roleSwitchText}>{buttonLabel}</Text>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  roleSwitchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  authButton: {
    backgroundColor: GREEN_500, 
  },
  logoutButton: {
    backgroundColor: RED_500, 
  },
  roleSwitchText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  }
})