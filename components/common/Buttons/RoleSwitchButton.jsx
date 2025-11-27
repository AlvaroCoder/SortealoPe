import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/theme';
// Importamos USER_ROLES, aunque no se usa directamente en la lógica,
// es útil para referencia en la aplicación.

// --- CONSTANTES DE COLOR ---
const GREEN_900 = Colors.principal.green[900]; // Borde Activo / Texto
const GREEN_100 = Colors.principal.green[100]; // Fondo Activo
const WHITE = '#FFFFFF'; // Color principal para texto e ícono (Inactivo)
// ---------------------------

export default function RoleSwitchButton({
    targetRole, 
    currentRole, 
    updateRole, 
    label, 
    icon
}) {
    // Si el rol actual es el target (ACTIVO)
    if (currentRole === targetRole) {
        return (
            <View style={[styles.baseButton, styles.activeRoleButton]}>
                <Ionicons name="checkmark-circle-outline" size={24} color={GREEN_900} />
                {/* El texto activo es de color GREEN_900 para contraste con el fondo claro GREEN_100 */}
                <Text style={[styles.roleSwitchText, { color: GREEN_900, marginTop: 4 }]}>{label} (Actual)</Text>
            </View>
        );
    }

    // Si el rol es diferente (INACTIVO)
    return (
        <TouchableOpacity 
            style={[styles.baseButton, styles.inactiveRoleButton]} 
            onPress={() => updateRole(targetRole)}
        >
            <Ionicons name={icon} size={24} color={WHITE} />
            {/* El texto inactivo es blanco para contraste con el fondo transparente */}
            <Text style={[styles.roleSwitchText, { color: WHITE, marginTop: 4 }]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  baseButton: {
    // 🟢 Estilo Vertical
    flexDirection: 'column', 
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
    // Eliminamos la sombra para permitir la transparencia
  },
  inactiveRoleButton: {
    // 🟢 Fondo Transparente
    backgroundColor: 'transparent', 
  },
  activeRoleButton: {
    // Estilo para el rol que SÍ está activo (sutil resaltado)
    backgroundColor: GREEN_100,
    borderWidth: 1,
    borderColor: GREEN_900,
  },
  roleSwitchText: {
    fontSize: 12, // Tamaño más pequeño para formato vertical
    fontWeight: 'bold',
    marginLeft: 0, // Centrado
    textAlign: 'center',
  }
});