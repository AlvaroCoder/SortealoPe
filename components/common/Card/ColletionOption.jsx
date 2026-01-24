import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '../../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const BLUE_900 = Colors.principal.blue[900];
export default function CollectionOption({ item, isSelected, onPress }) {
  return (
    <TouchableOpacity
        style={[styles.collectionCard, isSelected && styles.collectionCardSelected]}
        onPress={() => onPress(item)}
    >
        <Text style={styles.collectionLabel}>{item.name}</Text>
        <Text style={styles.collectionTickets}>{item.maximumCapacity} Tickets</Text>
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
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.principal.blue[700],
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
        color: BLUE_900,
        marginBottom: 5,
    },
    collectionTickets: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.extrabold,
        color: Colors.principal.blue[900],
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
