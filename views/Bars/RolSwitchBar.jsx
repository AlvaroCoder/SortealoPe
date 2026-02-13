'use client';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import RoleSwitchButton from '../../components/common/Buttons/RoleSwitchButton';
import { Colors } from '../../constants/theme';
import { USER_ROLES } from '../../context/RaffleContext';

const GREEN_START = Colors.principal.green[900]; 
const GREEN_END = Colors.principal.green[700];   

export default function RolSwitchBar({
    userRole, 
    updateRole
}) {
  return (
      <LinearGradient
          colors={[GREEN_START, GREEN_END]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.roleSwitchBar}
      >
          <RoleSwitchButton
              currentRole={userRole}
              updateRole={updateRole}
              targetRole={USER_ROLES.ADMIN}
              label={"Admin"}
              icon={"server-outline"}
          />      
          <RoleSwitchButton
              currentRole={userRole}
              updateRole={updateRole}
              targetRole={USER_ROLES.SELLER}
              label={"Vendedor"}
              icon={"people-circle-outline"}
          />
          <RoleSwitchButton
              currentRole={userRole}
              updateRole={updateRole}
              targetRole={USER_ROLES.BUYER}
              label={"Comprador"}
              icon={"person-circle-outline"}
          />
    </LinearGradient>

  )
};

const styles = StyleSheet.create({
    roleSwitchBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 20, 
        borderBottomRightRadius: 20,
        overflow: 'hidden',
        marginBottom : 20
    },
})