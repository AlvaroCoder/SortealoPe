import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/theme';
import HeaderBackNav from '../common/Navigations/HeaderBackNav';

const GREEN_900 = Colors.principal.green[900];
const WHITE = '#FFFFFF';
const FAB_BACKGROUND_COLOR = '#F2B705'; 
const FAB_ICON_COLOR = GREEN_900; 

export default function TabAdminLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { display: 'none' }, 
        tabBarStyle: styles.floatingTabBar,
        tabBarActiveTintColor: WHITE, 
        tabBarInactiveTintColor: Colors.principal.green[200], 
        tabBarItemStyle: styles.tabBarItem, 
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={26} color={color} />,
          tabBarLabel : ()=>{return null},
          href : null
        }}
        
      />
      
      <Tabs.Screen
        name="crear" 
        options={{
          tabBarIcon: ({ focused }) => (
            <TouchableOpacity
            onPress={()=>router.push("event/create")}  
            style={[
              styles.fabButton, 
              { backgroundColor: FAB_BACKGROUND_COLOR },
              focused && styles.fabButtonFocused 
            ]}>
              <Ionicons 
                name="add-circle-outline" 
                size={32} 
                color={FAB_ICON_COLOR} 
              />
            </TouchableOpacity>
          ),
          tabBarLabel: () => { return null },
          header : ()=> <HeaderBackNav title='Crear' />
        }}
      />
  
      <Tabs.Screen
        name="mis-eventos" 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={26} color={color} />,
          tabBarLabel: () => { return null },
          href : null
        }}
      />  
      <Tabs.Screen name='comprador/mis-tickets' options={{ href : null }}/>
      <Tabs.Screen name='explorar' options={{ href : null }}/>
      <Tabs.Screen name='mis-vendedores' options={{ href : null }}/>
      <Tabs.Screen name='perfil' options={{ href : null }}/>
      <Tabs.Screen name='vendedor/index' options={{ href : null }}/>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingTabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 30, 
    paddingBottom: 0,
    paddingTop : 10,
    backgroundColor: GREEN_900, 
    borderTopWidth: 0, 
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0, 
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    top: -5, 
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