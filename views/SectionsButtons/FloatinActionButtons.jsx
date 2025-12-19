import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        /// Alert.alert("Acción de Monitoreo", "Abriendo modal para asignar un nuevo vendedor.");
        router.push('/vendedores/agregar');
    };
  return (
    <View style={styles.floatingButtonsWrapper}>
        <View style={styles.floatingButtonsContainer}>
              <ButtonGradiend
                  style={styles.startRaffleButton}
                  onPress={handleStartRaffle}
              >
                  <Ionicons name='play-circle-outline' size={20} color={WHITE} style={{ marginRight: 8 }} />
                  <Text style={styles.startRaffleButtonText}>Iniciar Rifa</Text>
              </ButtonGradiend>      

              <TouchableOpacity
                    style={styles.addSellerButton} 
                    onPress={handleAddSeller}
                >
                  <Ionicons name='person-add-outline' size={24} color={Colors.principal.blue[900]} />
              </TouchableOpacity>
        </View>
    </View>
  )
};

const styles = StyleSheet.create({
    floatingButtonsWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 20,
        paddingTop: 10,
        backgroundColor: WHITE,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: BLACK,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
        zIndex: 10,
    },
    floatingButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    startRaffleButton: {
        flex: 1,
        marginRight: 10,
    },
    startRaffleButtonText: {
        color: WHITE,
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
    },
    addSellerButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.principal.blue[100], 
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BLUE_500,
    }    
})