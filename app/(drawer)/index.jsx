import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ButtonGradiend from '../../components/common/Buttons/ButtonGradiendt';
import Title from '../../components/common/Titles/Title';
import Title2 from '../../components/common/Titles/Title2';
import { Colors, Typography } from '../../constants/theme';
import DataCardEvent from "../../mock/DataCardEvent.json";
import CarrouselViewMainCard from '../../views/Sliders/CarrouselViewMainCard';
export default function HomeScreen() {
  const router = useRouter();
  const dataCards = DataCardEvent;

  const handleViewAllEvents = () => {
    console.log('Ver todos los eventos');
    router.push('/(drawer)/my-events');
  };

  return (
    <View style={styles.container}>

      <ScrollView 
        style={styles.mainBody}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={{marginBottom : 5, padding : 10}}>
          <Title>Bienvenido</Title>
        </View>
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <Title2>Mis Eventos ({dataCards.length })</Title2>
            <TouchableOpacity onPress={handleViewAllEvents}>
              <Text style={styles.viewAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          <CarrouselViewMainCard
            data={dataCards}
          />
        </View>

        <View style={{padding : 10}}>
          <ButtonGradiend
            onPress={()=>router.push("/event/create")}
            style={{marginBottom : 40}}
          >
            Crear Evento
          </ButtonGradiend>
        </View>
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

  mainBody: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  eventsSection: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal : 13
  },
  sectionTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    fontFamily: Typography.fonts.display,
  },
  viewAllText: {
    fontSize: Typography.sizes.base,
    color: Colors.principal.red[900],
    textDecorationLine: 'underline',
  },

});