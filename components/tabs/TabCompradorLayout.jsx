import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/theme';

export default function TabCompradorLayout() {
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
            display: 'none', 
            height: 0 
        }, 
      }}
    >
        <Tabs.Screen 
            name="index" 
            options={{ 
                title: "Inicio",
                tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={Colors.principal.green[900]} />,
            }} 
        />

        <Tabs.Screen 
            name="explorar" 
            options={{ 
                title: "Explorar",
                tabBarIcon: ({ color }) => <Ionicons name="search-outline" size={24} color={Colors.principal.green[900]} />,
            }} 
        />
        
        <Tabs.Screen 
            name="comprador/mis-tickets" 
            options={{ 
                title: "Mis Tickets",
                tabBarIcon: ({ color }) => <Ionicons name="receipt-outline" size={24} color={Colors.principal.green[900]} />,
                href: 'comprador/mis-tickets' 
            }} 
        />
        
        <Tabs.Screen 
            name="perfil" 
            options={{ 
                title: "Mi Perfil",
                tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={Colors.principal.green[900]} />,
            }} 
        />
        <Tabs.Screen name="crear" options={{ href: null }} />
        <Tabs.Screen name="mis-eventos" options={{ href: null }} />
        <Tabs.Screen name="mis-vendedores" options={{ href: null }} />
    </Tabs>
  );
}