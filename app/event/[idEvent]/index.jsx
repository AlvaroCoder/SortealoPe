import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import ButtonGradiend from '../../../components/common/Buttons/ButtonGradiendt';
import Title from '../../../components/common/Titles/Title';
import Title2 from '../../../components/common/Titles/Title2';
import { Colors } from '../../../constants/theme';
import { useDateFormatter } from '../../../lib/dateFormatter';
import DataCardEvent from '../../../mock/DataCardEvent.json';
import HorizontalSliderTalonarios from '../../../views/Sliders/HorizontalSliderTalonarios';

export default function Root() {
  const { idEvent } = useLocalSearchParams();
  const { formatDateToSpanish } = useDateFormatter();

  const [dataRaffle, setDataRaffle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function getDataRaffle() {
      setLoading(true);

      const data = DataCardEvent;
      const dataFilter = data.find((raffle) => raffle?.id === parseInt(idEvent));      
      setDataRaffle(dataFilter);

      setLoading(false);
    }
    getDataRaffle();
  }, [idEvent]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Cargando evento...</Text>
      </View>
    );
  }

  if (!dataRaffle) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Evento no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{ uri: dataRaffle?.image }}
          resizeMode='cover'
        />
      </View>

      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Title style={styles.title}>{dataRaffle?.title}</Title>
        </View>
        <View style={styles.priceContainer}>
          <Title2 style={styles.priceText}>S/. {dataRaffle?.ticketPrice}</Title2>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons
            name="calendar-clear-outline"
            size={18}
            color={Colors.principal.red[500]}
          />
          <Text style={styles.infoText}>{formatDateToSpanish(dataRaffle?.date)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={18}
            color={Colors.principal.red[500]}
          />
          <Text style={styles.infoText}>{dataRaffle?.place}</Text>
        </View>
      </View>

      {dataRaffle?.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Descripción</Text>
          <Text style={styles.descriptionText}>{dataRaffle.description}</Text>
        </View>
      )}

      <View style={styles.talonContainer}>
        <Title styleTitle={{fontSize : 22}}>Talonarios</Title>
        <HorizontalSliderTalonarios
          talonarios={dataRaffle?.collections}
        />
      </View>
      <View style={styles.buttonContainer}>
        <ButtonGradiend>
          <Text>Iniciar Sorteo</Text>
        </ButtonGradiend>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.principal.red[900],
  },
  errorText: {
    fontSize: 18,
    color: Colors.principal.red[500],
    fontWeight: '600',
  },
  imageContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 220,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginVertical : 8
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: Colors.principal.red[900],
    lineHeight: 28,
  },
  priceContainer: {
    backgroundColor: Colors.principal.yellow[100],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.principal.yellow[200],
  },
  priceText: {
    color: Colors.principal.red[900],
    fontSize: 18,
    fontWeight: '700',
  },
  infoContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
      gap: 12,
      display: 'flex',
      flexDirection: 'row',
    
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '500',
  },
  descriptionContainer: {
    marginHorizontal: 16,

    padding: 16,
    backgroundColor: 'white',
    borderLeftWidth: 4,
    borderLeftColor: Colors.principal.red[900],
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.principal.red[900],
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    backgroundColor: Colors.principal.yellow[50],
    borderRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    backgroundColor: Colors.principal.red[50],
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.principal.red[900],
    marginBottom: 2,
  },
  statStatus: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.principal.red[900],
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.principal.red[100],
  },
  actionContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.principal.red[900],
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: Colors.principal.red[900],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  talonContainer: {
    padding : 15
  },
  buttonContainer: {
    paddingHorizontal: 15,
    marginBottom : 15
  }
});