import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/theme';

const GREEN_900 = Colors.principal.green[900]; 
const GREEN_100 = Colors.principal.green[100];
const WHITE = '#FFFFFF'; 

export default function RoleSwitchButton({
    targetRole, 
    currentRole, 
    updateRole, 
    label, 
    icon
}) {
  console.log(currentRole);
  
    if (currentRole === targetRole) {
        return (
            <View style={[styles.baseButton, styles.activeRoleButton]}>
                <Ionicons name="checkmark-circle-outline" size={24} color={GREEN_900} />
                <Text style={[styles.roleSwitchText, { color: GREEN_900, marginTop: 4 }]}>{label} (Actual)</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity 
            style={[styles.baseButton, styles.inactiveRoleButton]} 
            onPress={() => updateRole(targetRole)}
        >
            <Ionicons name={icon} size={24} color={WHITE} />
            <Text style={[styles.roleSwitchText, { color: WHITE, marginTop: 4 }]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'column', 
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  inactiveRoleButton: {
    backgroundColor: 'transparent', 
  },
  activeRoleButton: {
    backgroundColor: GREEN_100,
    borderWidth: 1,
    borderColor: GREEN_900,
  },
  roleSwitchText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 0,
    textAlign: 'center',
  }
});