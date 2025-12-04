import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '../../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const GREEN_100 = Colors.principal.green[100];

export default function CollectionOption({ item, isSelected, onPress }) {
  return (
    <TouchableOpacity
        style={[styles.collectionCard, isSelected && styles.collectionCardSelected]}
        onPress={() => onPress(item)}
    >
        <Text style={styles.collectionLabel}>{item.label}</Text>
        <Text style={styles.collectionTickets}>{item.tickets} Tickets</Text>
        <Text style={styles.collectionPrice}>S/ {item.price.toFixed(2)}</Text>
        {isSelected && (
            <Ionicons name="checkmark-circle" size={20} color={GREEN_900} style={styles.collectionCheck} />
        )}
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
    collectionListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    collectionCard: {
        width: '48%', 
        backgroundColor: GREEN_100,
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: GREEN_100,
        position: 'relative',
    },
    collectionCardSelected: {
        borderColor: GREEN_500,
        backgroundColor: Colors.principal.green[50],
        borderWidth: 2,
    },
    collectionLabel: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.bold,
        color: GREEN_900,
        marginBottom: 5,
    },
    collectionTickets: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.extrabold,
        color: RED_500,
    },
    collectionPrice: {
        fontSize: Typography.sizes.sm,
        color: NEUTRAL_700,
        marginTop: 4,
    },
    collectionCheck: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
})
