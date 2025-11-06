import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ButtonIcon from '../../components/common/ButtonIcon';
import ActionCard from '../../components/common/Card/ActionCard';
import CardEventMain from '../../components/common/Card/CardEventMain';
import { Colors, Typography } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  const handleJoinGroup = () => {
    console.log('Unirse a grupo');
  };

  const handleScanQR = () => {
    console.log('Escanear QR');
  };

  const handleViewAllEvents = () => {
    console.log('Ver todos los eventos');
    router.push('/(drawer)/my-events');
  };

  const handleCreateEvent = () => {
    console.log('Crear evento');
    router.push('/event/create');
  };

  const handleStartRaffle = () => {
    console.log('Comenzar sorteo');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.quickActions}>
          <ButtonIcon
            title="Unirte a un grupo"
            iconName="people"
            onPress={handleJoinGroup}
            variant="primary"
          />
          <ButtonIcon
            title="Escanear QR"
            iconName="qr-code"
            onPress={handleScanQR}
            variant="primary"
          />
        </View>
      </View>

      <ScrollView 
        style={styles.mainBody}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis Eventos</Text>
            <TouchableOpacity onPress={handleViewAllEvents}>
              <Text style={styles.viewAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          <CardEventMain/>
        </View>

        <View style={styles.separatorLine} />
        <View style={styles.mainActions}>
          <ActionCard
            title="Sortear"
            description="Realiza el sorteo de tus eventos"
            iconName="trophy"
            iconColor={Colors.principal.yellow[500]}
            onPress={handleStartRaffle}
          />
          <ActionCard
            title="Crear Evento"
            description="Crea un nuevo evento de rifa"
            iconName="add-circle"
            iconColor={Colors.principal.red[500]}
            onPress={handleCreateEvent}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.primary,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop : 20,
    paddingBottom: 30,
  },
  welcomeTitle: {
    fontSize: Typography.sizes['4xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.light.background,
    marginBottom: 24,
    fontFamily: Typography.fonts.display,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },

  mainBody: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
  },
  eventsSection: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    fontFamily: Typography.fonts.display,
  },
  viewAllText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.principal.red[500],
  },
  eventsSlider: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
  },
  noEventsText: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textMuted,
    textAlign: 'center',
  },
  mainActions: {
    minHeight: 200,
    width: "100%",
    display: 'flex',
    flexDirection : 'row',
    gap: 12,
  },

  bottomSpacer: {
    height: 40,
  },
  separatorLine: {
    marginVertical: 20,
    flex: 1,
    height: 1,
    backgroundColor : Colors.light.border
  }
});