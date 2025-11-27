import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const WHITE = '#FFFFFF';
const FAB_BACKGROUND_COLOR = '#F2B705'; 
const FAB_ICON_COLOR = GREEN_900; 

export default function TabAdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.floatingTabBar,
        tabBarActiveTintColor: WHITE, 
        tabBarInactiveTintColor: Colors.principal.green[200], 
        
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="crear" 
        options={{
          title: '', 
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.fabButton, 
              { backgroundColor: FAB_BACKGROUND_COLOR },
              focused && styles.fabButtonFocused 
            ]}>
              <Ionicons 
                name="add-circle-outline" 
                size={30} 
                color={FAB_ICON_COLOR} 
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="mis-eventos" 
        options={{
          title: 'Mis Eventos',
          tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={24} color={color} />,
        }}
      />  

      {/** Tabs secundarias que no quiero que aparezcan */}

      <Tabs.Screen
        name='comprador/mis-tickets'
        options={{
          href : null
        }}
      />
      
      <Tabs.Screen
        name='explorar'
        options={{
          href : null
        }}
      />

      <Tabs.Screen
        name='mis-vendedores'
        options={{
          href : null
        }}
      />

      <Tabs.Screen
        name='perfil'
        options={{
          href : null
        }}
      />

      <Tabs.Screen
        name='vendedor/inventario'
        options={{
          href : null
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarLabel: {
    fontWeight: '600',
    fontSize: 10,
  },
  floatingTabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 30, 
    paddingBottom: 5,
    backgroundColor: GREEN_900, 
    borderTopWidth: 0, 
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    top: -15, 
    borderWidth: 4,
    borderColor: GREEN_900, 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  fabButtonFocused: {
    transform: [{ scale: 1.05 }], 
    opacity: 0.9,
  }
});