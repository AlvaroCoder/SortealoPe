import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Title from '../../components/common/Titles/Title';
import Title2 from '../../components/common/Titles/Title2';
import { Colors, Typography } from '../../constants/theme';
import RolSwitchBar from "../Bars/RolSwitchBar";
import CarrouselViewMainCard from '../Sliders/CarrouselViewMainCard';

const GREEN_START = Colors.principal.green[900]; 
const GREEN_900 = Colors.principal.green[900];  
const WHITE = '#FFFFFF';
const RED_900 = Colors.principal.red[900];

export default function MonitorDashboard({
    router,
    dataCards,
    userRole, 
    updateRole
}) {
    const handleViewAllEvents = () => {
        router.push('/(drawer)/monitor/eventos')
    }
  return (
      <View style={styles.monitorContainer}>
        <RolSwitchBar userRole={userRole} updateRole={updateRole} />
          <ScrollView
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              style={styles.mainContentArea}
          >
              <View style={styles.contentPadding}>
                  <Title styleTitle={{color : GREEN_900, marginBottom : 15, marginTop : 10}}>
                      Panel ({userRole})
                  </Title>

                  <View style={{marginBottom : 20}}>
                      <Title2 styleTitle={styles.sectionTitleText}>Métricas Rápidas:</Title2>
                      <Text style={styles.kpiPlaceholder}>[Componente : StatsCard]</Text>
                  </View>

                  <View style={styles.eventsSection}>
                      <View style={styles.sectionHeader}>
                          <Title2 styleTitle={styles.sectionTitleText}>Mis Eventos</Title2>
                          <TouchableOpacity onPress={handleViewAllEvents}>
                              <Text style={styles.viewAllText}>Ver todos</Text>
                          </TouchableOpacity>
                      </View>

                      <CarrouselViewMainCard
                        data={dataCards}
                      />
                  </View>
              </View>
        </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create({
    monitorContainer: {
        flex: 1,
        backgroundColor: GREEN_START, 

    },
    scrollContent: {
        paddingBottom: 20,
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
    eventsSection: {
        marginTop: 10,
    },
    sectionTitleText: {
      color: GREEN_900,
      fontSize: Typography.sizes['2xl'],
      fontWeight: Typography.weights.bold,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
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
      viewAllText: {
        fontSize: Typography.sizes.base,
        color: RED_900, 
        textDecorationLine: 'underline',
        fontWeight: Typography.weights.medium,
      },
})