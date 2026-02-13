import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '../../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const WHITE = 'white';
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];
const GREEN_100 = Colors.principal.green[100];

export default function ButtonActionAgregar({ icon, title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
        <View style={styles.iconContainer}>
            <Ionicons name={icon} size={30} color={GREEN_900} />
        </View>
        <Text style={styles.buttonTitle}>{title}</Text>
        <Text style={styles.buttonSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
    actionButton: {
        backgroundColor: GREEN_100,
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: NEUTRAL_200,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
        iconContainer: {
            backgroundColor: WHITE,
            padding: 15,
            borderRadius: 10,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: Colors.principal.neutral[300],
    },
        buttonTitle: {
            fontSize: Typography.sizes.xl,
            fontWeight: Typography.weights.bold,
            color: GREEN_900,
            marginTop: 5,
        },
        buttonSubtitle: {
            fontSize: Typography.sizes.sm,
            color: NEUTRAL_700,
            textAlign: 'center',
            marginTop: 4,
        },
})