import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = '#FFFFFF';

export default function EventCardTimeline({
    title, 
    time,
    status,
    icon
}) {
    const cardStyle = status === 'highlight' ? styles.eventCardHighlight : styles.eventCardNormal;
    const titleStyle = status === 'highlight' ? styles.eventTitleHighlight : styles.eventTitleNormal;
    const timeStyle = status === 'highlight' ? styles.eventTimeHighlight : styles.eventTimeNormal;
    const iconColor = status === 'highlight' ? WHITE : GREEN_900;

  return (
    <TouchableOpacity style={[styles.eventCard, cardStyle]}>
      {icon && (
        <Ionicons name={icon} size={20} color={iconColor} style={styles.eventCardIcon} />
      )}
      <View style={styles.eventCardContent}>
        <Text style={titleStyle}>{title}</Text>
        <Text style={timeStyle}>{time}</Text>
      </View>
      <Ionicons 
        name="ellipsis-vertical" 
        size={20} 
        color={status === 'highlight' ? WHITE : NEUTRAL_700} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
      eventsColumn: {
        flex: 1,
        paddingLeft: 10,
      },
      eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        elevation: 3, 
        shadowColor: Colors.principal.neutral[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      eventCardNormal: {
        backgroundColor: WHITE,
        borderWidth: 1,
        borderColor: NEUTRAL_200,
      },
      eventCardHighlight: {
        backgroundColor: GREEN_500, 
          borderColor: GREEN_900,

      },
      eventCardIcon: {
        marginRight: 10,
      },
      eventCardContent: {
        flex: 1,
      },
      eventTitleNormal: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.bold,
        color: GREEN_900,
      },
      eventTitleHighlight: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.bold,
        color: GREEN_900,
      },
      eventTimeNormal: {
        fontSize: Typography.sizes.sm,
        color: NEUTRAL_700,
        marginTop: 2,
      },
      eventTimeHighlight: {
        fontSize: Typography.sizes.sm,
        color: Colors.principal.green[100],
        marginTop: 2,
      },
})