import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonGradiend from '../../components/common/Buttons/ButtonGradiendt';
import { Colors, Typography } from '../../constants/theme';

const WHITE = '#FFFFFF';
const BLACK = '#000000';
const BLUE_500 = Colors.principal.blue[500];

export default function FloatinActionButtons() {
  const router = useRouter();

  const handleStartRaffle = () => {
    Alert.alert("Acción de Monitoreo", "La rifa se ha iniciado.");
  };

  const handleAddSeller = () => {
    router.push('/vendedores/agregar');
  };

  return (
    <SafeAreaView
      style={[
        styles.floatingButtonsWrapper,
        { paddingBottom: 2  }, 
      ]}
      edges={['bottom']} 
    >
      <View style={styles.floatingButtonsContainer}>
        <ButtonGradiend
          style={styles.startRaffleButton}
          onPress={handleStartRaffle}
        >
          <Ionicons name="play-circle-outline" size={20} color={WHITE} style={{ marginRight: 8 }} />
          <Text style={styles.startRaffleButtonText}>Iniciar Rifa</Text>
        </ButtonGradiend>

        <TouchableOpacity
          style={styles.addSellerButton}
          onPress={handleAddSeller}
        >
          <Ionicons name="person-add-outline" size={24} color={Colors.principal.blue[900]} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  floatingButtonsWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 10,
    backgroundColor: WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 15,
    zIndex: 20,
  },
  floatingButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  startRaffleButton: {
    flex: 1,
    marginRight: 12,
  },
  startRaffleButtonText: {
    color: WHITE,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  addSellerButton: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.principal.blue[100],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BLUE_500,
  },
});