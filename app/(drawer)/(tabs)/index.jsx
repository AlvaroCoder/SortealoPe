import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RoleSwitchButton from '../../../components/common/Buttons/RoleSwitchButton';
import Title from '../../../components/common/Titles/Title';
import Title2 from '../../../components/common/Titles/Title2';
import { Colors, Typography } from '../../../constants/theme';
import { USER_ROLES, useRaffleContext } from '../../../context/RaffleContext';
import DataCardEvent from "../../../mock/DataCardEvent.json";
import CarrouselViewMainCard from '../../../views/Sliders/CarrouselViewMainCard';

const GREEN_START = Colors.principal.green[900]; 
const GREEN_END = Colors.principal.green[700];   
const GREEN_900 = Colors.principal.green[900];  
const RED_900 = Colors.principal.red[900];
const WHITE = '#FFFFFF';
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_100 = Colors.principal.neutral[100];

const RoleSwitchBar = ({ userRole, updateRole }) => (
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
            label="Admin"
            icon="server-outline"
        />
        <RoleSwitchButton 
            currentRole={userRole} 
            updateRole={updateRole} 
            targetRole={USER_ROLES.SELLER}
            label="Vendedor"
            icon="people-circle-outline"
        />
        <RoleSwitchButton 
            currentRole={userRole} 
            updateRole={updateRole} 
            targetRole={USER_ROLES.BUYER}
            label="Comprador"
            icon="person-circle-outline"
        />
    </LinearGradient>
);


const MonitorDashboard = ({ router, dataCards, userRole, updateRole }) => {
  const handleViewAllEvents = () => {
    router.push('/(drawer)/monitor/eventos');
  };

  return (
    <View style={styles.monitorContainer}>
        <RoleSwitchBar userRole={userRole} updateRole={updateRole} />

        <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={styles.mainContentArea}
        >
            <View style={styles.contentPadding}>
                <Title styleTitle={{color : GREEN_900, marginBottom: 15, marginTop: 10}}>
                    Panel ({userRole})
                </Title>
                
                <View style={{marginBottom: 20}}>
                    <Title2 styleTitle={styles.sectionTitleText}>Métricas Rápidas:</Title2>
                    <Text style={styles.kpiPlaceholder}>[Componente: StatsCard con Ventas/Inventario]</Text>
                </View>

                {/* Sección de Eventos Activos */}
                <View style={styles.eventsSection}>
                    <View style={styles.sectionHeader}>
                        <Title2 styleTitle={styles.sectionTitleText}>Mis Eventos Activos ({dataCards.length })</Title2>
                        <TouchableOpacity onPress={handleViewAllEvents}>
                            <Text style={styles.viewAllText}>Ver todos</Text> 
                        </TouchableOpacity>
                    </View>
                    
                    <CarrouselViewMainCard data={dataCards} />
                </View>
                
            </View>
        </ScrollView>
    </View>
  );
};

const BuyerGuestHome = ({ router }) => {
    return (
        <ScrollView style={styles.buyerContainer} contentContainerStyle={styles.buyerScrollContent}>
            <View style={{marginBottom: 30}}>
                <Title styleTitle={styles.buyerTitle}>¡Bienvenido a SORTEALOPE!</Title>
                <Text style={styles.buyerSubtitle}>Tu plataforma para ganar grandes premios.</Text>
            </View>

            <TouchableOpacity
                onPress={() => router.push('/(drawer)/(tabs)/explorar')}
                style={styles.exploreButton}
            >
                 <Ionicons name="search-outline" size={24} color={WHITE} />
                 <Text style={styles.exploreButtonText}>Explorar Eventos Disponibles</Text>
            </TouchableOpacity>

            <View style={{marginTop: 40}}>
                 <Title2 styleTitle={{color: GREEN_900}}>Eventos Destacados</Title2>
                 <Text style={styles.kpiPlaceholderLight}>[Componente: CarrouselViewMainCard o Lista de Destacados]</Text>
            </View>
        </ScrollView>
    );
};


export default function Index() {
  const router = useRouter();
  const { userRole, updateRole } = useRaffleContext(); 
  const dataCards = DataCardEvent;

  if (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SELLER) {
    return <MonitorDashboard router={router} dataCards={dataCards} userRole={userRole} updateRole={updateRole} />;
  }

  return <BuyerGuestHome router={router} />;
}


const styles = StyleSheet.create({
  monitorContainer: {
    flex: 1,
    backgroundColor: GREEN_START, 
  },
  roleSwitchBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  mainContentArea: {
    flex: 1,
    backgroundColor: WHITE, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20, 
  },
  contentPadding: {
    paddingHorizontal: 24,
    paddingTop: 10, 
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionTitleText: {
    color: GREEN_900,
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
  },
  kpiPlaceholder: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: Colors.principal.neutral[100],
    color: GREEN_900,
    textAlign: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.principal.neutral[200],
    fontStyle: 'italic',
    fontWeight: Typography.weights.medium,
  },
  eventsSection: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewAllText: {
    fontSize: Typography.sizes.base,
    color: RED_900, 
    textDecorationLine: 'underline',
    fontWeight: Typography.weights.medium,
  },

  // --- Estilos para BuyerGuestHome ---
  buyerContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  buyerScrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  buyerTitle: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    textAlign: 'center',
  },
  buyerSubtitle: {
    fontSize: Typography.sizes.lg,
    color: NEUTRAL_500,
    textAlign: 'center',
    marginTop: 8,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.principal.red[500],
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
  },
  exploreButtonText: {
    color: WHITE,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginLeft: 10,
  },
  kpiPlaceholderLight: {
    padding: 50,
    borderRadius: 8,
    backgroundColor: NEUTRAL_100,
    color: Colors.principal.neutral[700],
    textAlign: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.principal.neutral[200],
    fontStyle: 'italic',
  }
});