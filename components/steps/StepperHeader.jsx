import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';

const STEPS = [
    { id: 1, title: 'Paquete de Tickets', icon: 'pricetags-outline' },
    { id: 2, title: 'Detalles del Premio', icon: 'gift-outline' },
    { id: 3, title: 'Diseño y Archivos', icon: 'image-outline' },
];

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const WHITE = '#FFFFFF';
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];
const GREEN_100 = Colors.principal.green[100];

export default function StepperHeader({ currentStep }) {
  return (
    <View style={styles.headerContainer}>
        {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
                <View key={step.id} style={styles.stepWrapper}>
                    {index > 0 && (
                        <View style={[
                            styles.stepLine, 
                            isCompleted && styles.stepLineCompleted
                        ]} />
                    )}
                    <View style={[
                        styles.stepCircle,
                        isActive && styles.stepCircleActive,
                        isCompleted && styles.stepCircleCompleted,
                    ]}>
                        <Ionicons 
                            name={isCompleted ? 'checkmark' : step.icon}
                            size={16}
                            color={isCompleted ? WHITE : isActive ? GREEN_900 : NEUTRAL_700}
                        />
                    </View>
                    <Text 
                        style={[
                            styles.stepTitle, 
                            isActive && styles.stepTitleActive
                        ]}
                        numberOfLines={1}
                    >
                        {step.title}
                    </Text>
                </View>
            );
        })}
    </View>
  )
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: GREEN_100,
        borderBottomWidth: 1,
        borderBottomColor: GREEN_500,
    },
    stepWrapper: {
        flex: 1,
        alignItems: 'center',
        position: 'relative',
    },
    stepLine: {
        position: 'absolute',
        width: '100%',
        height: 2,
        backgroundColor: NEUTRAL_200,
        top: 15,
        left: '50%',
        zIndex: 1,
        marginHorizontal: -5,
    },
    stepLineCompleted: {
        backgroundColor: GREEN_500,
    },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: NEUTRAL_200,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    stepCircleActive: {
        backgroundColor: WHITE,
        borderWidth: 2,
        borderColor: GREEN_900,
    },
    stepCircleCompleted: {
        backgroundColor: GREEN_900,
    },
    stepTitle: {
        fontSize: Typography.sizes.xs,
        marginTop: 6,
        color: NEUTRAL_700,
        fontWeight: Typography.weights.medium,
        textAlign: 'center',
    },
    stepTitleActive: {
        color: GREEN_900,
        fontWeight: Typography.weights.bold,
    }   
})