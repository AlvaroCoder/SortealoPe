import { ScrollView, StyleSheet, Text, View } from 'react-native';
import EventCardTimeline from '../../components/cards/EventCardTimeline';
import { Colors, Typography } from '../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_100 = Colors.principal.green[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = '#FFFFFF';
const RED_500 = Colors.principal.red[500]; 

const mockTimelineEvents = [
  {
    date: '10 NOV',
    dayOfWeek: 'Miércoles',
    isToday: false,
    events: [
      { id: 'e1', title: 'Reunión de planificación', time: '10:00 AM - 11:00 AM', status: 'normal' },
      { id: 'e2', title: 'Lanzamiento de la Rifa X', time: '01:00 PM - 02:30 PM', status: 'highlight', icon: 'gift-outline' },
    ],
  },
  {
    date: '12 NOV',
    dayOfWeek: 'Viernes',
    isToday: true, 
    events: [
      { id: 'e3', title: 'Visita a cliente Y', time: '09:00 AM - 10:30 AM', status: 'normal' },
    ],
  },
  {
    date: '15 NOV',
    dayOfWeek: 'Lunes',
    isToday: false,
    events: [
      { id: 'e4', title: 'Cierre de la Rifa Z', time: '06:00 PM - 07:00 PM', status: 'highlight', icon: 'ticket-outline' },
      { id: 'e5', title: 'Revisión mensual de rendimiento', time: '03:00 PM - 04:00 PM', status: 'normal' },
    ],
  },
  {
    date: '18 NOV',
    dayOfWeek: 'Jueves',
    isToday: false,
    events: [
      { id: 'e6', title: 'Presentación nuevo vendedor', time: '11:00 AM - 12:00 PM', status: 'normal' },
    ],
  },
  {
    date: '20 NOV',
    dayOfWeek: 'Sábado',
    isToday: false,
    events: [
      { id: 'e7', title: 'Evento solidario con Rifa A', time: '04:00 PM - 08:00 PM', status: 'highlight', icon: 'heart-outline' },
    ],
  },
  {
    date: '22 NOV',
    dayOfWeek: 'Lunes',
    isToday: false,
    events: [
      { id: 'e8', title: 'Reunión semanal de equipo', time: '09:00 AM - 10:00 AM', status: 'normal' },
    ],
  },
];




export default function TimelinePrincipalEvents() {
  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {mockTimelineEvents.map((timelineDay, index) => (
          <View key={index} style={styles.timelineRow}>
            <View style={styles.dateColumn}>
              <Text style={[styles.dateText, timelineDay.isToday && styles.dateToday]}>{timelineDay.date}</Text>
              <Text style={styles.dayOfWeekText}>{timelineDay.dayOfWeek}</Text>
              {index < mockTimelineEvents.length - 1 && <View style={styles.dateLine} />}
              <View style={[styles.dateBubble, timelineDay.isToday && styles.dateBubbleToday]} />
            </View>

            <View style={styles.eventsColumn}>
              {timelineDay.events.map((event) => (
                <EventCardTimeline key={event.id} {...event} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    paddingVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  // --- Columna de Fecha ---
  dateColumn: {
    width: 80,
    alignItems: 'flex-end',
    paddingRight: 10,
    position: 'relative',
  },
  dateText: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,
  },
  dateToday: {
    color: RED_500, 
  },
  dayOfWeekText: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
  },
  dateLine: {
    position: 'absolute',
    top: 0,
    bottom: -20, 
    width: 2,
    backgroundColor: NEUTRAL_200,
    right: 0,
    zIndex: -1, 
  },
  dateBubble: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: GREEN_500,
    position: 'absolute',
    right: -4, 
    top: 5, 
    borderColor: WHITE, 
  },
  dateBubbleToday: {
    backgroundColor: RED_500,
    borderColor: GREEN_100,
  },

  // --- Columna de Eventos ---
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
    elevation: 3, // Sombra para efecto flotante
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
    backgroundColor: GREEN_500, // Fondo verde para eventos destacados
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
    color: WHITE,
  },
  eventTimeNormal: {
    fontSize: Typography.sizes.sm,
    color: NEUTRAL_700,
    marginTop: 2,
  },
  eventTimeHighlight: {
    fontSize: Typography.sizes.sm,
    color: Colors.principal.green[100], // Un verde más claro para la hora
    marginTop: 2,
  },
});