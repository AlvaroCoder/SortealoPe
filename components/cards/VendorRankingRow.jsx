import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const RED_500 = Colors.principal.red[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];

export default function VendorRankingRow({ rank, name, sales, ticketsSold }) {
  return (
  <TouchableOpacity style={styles.rankingRow}>
    <Text style={[styles.rankText, rank <= 3 && styles.topRankText]}>{rank}</Text>
    
    <Ionicons 
      name={rank === 1 ? 'trophy' : rank === 2 ? 'medal' : rank === 3 ? 'ribbon' : 'person-circle-outline'} 
      size={20} 
      color={rank <= 3 ? RED_500 : GREEN_500}
      style={{ marginRight: 10 }}
    />
    
    <View style={styles.rankingInfo}>
      <Text style={styles.rankingName} numberOfLines={1}>{name}</Text>
      <Text style={styles.rankingDetail}>Tickets vendidos: {ticketsSold}</Text>
    </View>
    
    <Text style={styles.rankingSales}>S/ {sales.toFixed(2)}</Text>
  </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  rankingList: {
    marginTop: 10,
  },
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  rankText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_700,
    width: 30, 
    textAlign: 'left',
    marginRight: 10,
  },
  topRankText: {
    color: RED_500,
  },
  rankingInfo: {
    flex: 1,
  },
  rankingName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: GREEN_900,
  },
  rankingDetail: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
  },
  rankingSales: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: RED_500, 
  },
})