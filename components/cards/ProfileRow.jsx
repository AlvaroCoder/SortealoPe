import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const WHITE = '#FFFFFF';
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];

export default function ProfileRow({
    icon, label, value
}) {
  return (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={24} color={GREEN_900} style={styles.infoIcon} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
  )
};

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  infoIcon: {
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
  },
  infoValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: GREEN_900,
    marginTop: 2,
  },
})