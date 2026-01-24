import { Alert, StyleSheet, Text, View } from 'react-native';
import { ENDPOINTS_EVENTS } from '../../Connections/APIURLS';
import { Colors, Typography } from '../../constants/theme';
import { useFetch } from '../../lib/useFetch';
import LoadingScreen from '../../screens/LoadingScreen';
import ButtonGradiend from '../common/Buttons/ButtonGradiendt';
import CollectionOption from '../common/Card/ColletionOption';
import Title from '../common/Titles/Title';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const WHITE = Colors.principal.white;
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];
const GREEN_100 = Colors.principal.green[100];
const URL_PACKS_EVENTS = ENDPOINTS_EVENTS.GET_PACKS_EVENT;

export default function Step1Content({ form, setForm, onNext }) {
    const { data, loading } = useFetch(URL_PACKS_EVENTS);
    
    const handleNext = () => {
        if (form?.packId === undefined) {
            Alert.alert("Error de Validación", "Por favor, selecciona un paquete de tickets para continuar.");
            return
        }
        onNext();
    };

    const handleCollectionSelect = (item) => {
        setForm(prev => ({ 
            ...prev, 
            packId : item?.id
        }));
    };

    const isSelected = (item) =>
        item?.id === form.packId;

    return (
      <View style={styles.stepContent}>
        {loading && <LoadingScreen />}
        <Title>1. Define el Paquete de Tickets</Title>
        <Text style={styles.stepSubtitleText}>
          Selecciona un paquete predefinido o usa la opción personalizada abajo.
        </Text>

        <View style={styles.collectionListContainer}>
          {data &&
                data.map((item, key) => {
                if ([1, 3, 6, 9].includes(parseInt(item?.id))) {
                  return (
                    <CollectionOption
                      key={key}
                      item={item}
                      isSelected={isSelected(item)}
                      onPress={handleCollectionSelect}
                    />
                  );
                }
            })}
        </View>

        <View style={styles.buttonContainer}>
          <ButtonGradiend onPress={handleNext} style={styles.nextButton}>
            Continuar
          </ButtonGradiend>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    stepContent: {
        width: '100%',
        paddingBottom : 40
    },
    stepTitleText: {
        fontSize: Typography.sizes['2xl'],
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
        marginBottom: 8,
    },
    stepSubtitleText: {
        fontSize: Typography.sizes.base,
        color: NEUTRAL_700,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.bold,
        marginVertical: 10,
    },
    inputLabel: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.medium,
        color: GREEN_900,
        marginTop: 15,
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: NEUTRAL_200,
        borderRadius: 12,
        padding: 15,
        fontSize: Typography.sizes.lg,
        color: GREEN_900,
        backgroundColor: WHITE,
    },
    textInputActive: {
        borderColor: GREEN_500,
        backgroundColor: Colors.principal.green[50],
    },
    metricBox: {
        backgroundColor: GREEN_100,
        borderRadius: 12,
        padding: 20,
        marginTop: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: GREEN_500,
    },
    metricValue: {
        fontSize: Typography.sizes['xl'],
        fontWeight: Typography.weights.extrabold,
        color: RED_500,
    },
    metricIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
        opacity: 0.1,
    },
    metricLabel: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.medium,
        color: GREEN_900,
    },
    collectionListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    buttonContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    nextButton: {
        width: '100%',

    },
});