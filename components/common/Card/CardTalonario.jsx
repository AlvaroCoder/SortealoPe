import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors } from '../../../constants/theme'
import Title2 from '../Titles/Title2'

export default function CardTalonario({
    seller = {},
    ticketsQuantity = 0,
    serialNumber = 20,
    onPress = () => {},
    status = "disponible", 
}) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={status === 'vendido'}
    >
      <View style={styles.seriesContainer}>
        <Ionicons
          name="document-text-outline"
          size={16}
          color={Colors.principal.red[500]}
        />
        <Title2 style={styles.seriesText}>
          Serie: {serialNumber} - {serialNumber + ticketsQuantity - 1}
        </Title2>
      </View>

      <View style={styles.sellerContainer}>
        <View style={styles.sellerIcon}>
          <Ionicons
            name='person-outline'
            size={18}
            color={Colors.principal.red[500]}
          />
        </View>
        <View style={styles.sellerInfo}>
          <Text style={styles.sellerLabel}>Vendedor</Text>
          <Text style={styles.sellerName}>
            {seller?.username || 'Sin asignar'}
          </Text>
        </View>
      </View>

      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>Cantidad de tickets:</Text>
        <Text style={styles.quantityValue}>{ticketsQuantity}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <Text style={styles.ticketsText}>
          Ver tickets
        </Text>
        <View style={[
          styles.actionIcon,
          status === 'vendido' && styles.actionIconDisabled
        ]}>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={status === 'vendido' ? Colors.principal.red[200] : Colors.principal.red[500]}
          />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
  },
  containerVendido: {
    backgroundColor: Colors.principal.red[200],
    borderColor: Colors.principal.red[200],
    opacity: 0.8,
  },
  containerReservado: {
    borderColor: Colors.warning,
    backgroundColor: Colors.principal.yellow[25],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: Colors.principal.red[900],
    fontSize: 25,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  seriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  seriesText: {
    color: Colors.principal.red[300],
    fontSize: 14,
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: Colors.principal.yellow[50],
    borderRadius: 8,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  quantityValue: {
    fontSize: 16,
    color: Colors.principal.red[900],
    fontWeight: '700',
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 25,
  },
  sellerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.principal.red[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  sellerName: {
    fontSize: 14,
    color: Colors.principal.red[900],
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.principal.red[100],
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketsText: {
    fontSize: 13,
    color: Colors.principal.red[900],
    fontWeight: '500',
  },
  actionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.principal.red[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconDisabled: {
    backgroundColor: Colors.principal.red[100],
  },
})