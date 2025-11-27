import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';

const WHITE = '#FFFFFF';
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];
const GREEN_900 = Colors.principal.green[900];


export default function VendorListItem({
    name, 
    sales,
    icon
}) {
  return (
    <View style={styles.vendorItem}>
        <View style={styles.vendorIconContainer}>
            <Ionicons name={icon} size={28} color={WHITE} />
        </View>
        <View style={styles.vendorInfo}>
            <Text style={styles.vendorName}>{name}</Text>
            <Text style={styles.vendorSales}>Ventas: S/.{sales}</Text>
        </View>
        <Ionicons name='chevron-forward' size={20} color={NEUTRAL_700} />
    </View>
  )
};

const styles = StyleSheet.create({
    vendorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: WHITE,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: NEUTRAL_200,
    },
    vendorIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: GREEN_900,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    vendorInfo: {
        flex: 1,
    },
    vendorName: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        color: GREEN_900,
    },
    vendorSales: {
        fontSize: Typography.sizes.sm,
        color: NEUTRAL_700,
        marginTop: 2,
    },
})