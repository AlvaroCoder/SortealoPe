import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ENDPOINTS_USERS } from "../../../../Connections/APIURLS";
import { Colors, Typography } from "../../../../constants/theme";
import { useFetch } from "../../../../lib/useFetch";
import LoadingScreen from "../../../../screens/LoadingScreen";

// ── Color tokens ──────────────────────────────────────────────────────────────
const GREEN_900 = Colors.principal.green[900];
const GREEN_700 = Colors.principal.green[700];
const GREEN_500 = Colors.principal.green[500];
const GREEN_100 = Colors.principal.green[100];
const GREEN_50 = Colors.principal.green[50];
const BLUE_500 = Colors.principal.blue[500];
const BLUE_100 = Colors.principal.blue[100];
const NEUTRAL_50 = Colors.principal.neutral[50];
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_500 = Colors.principal.neutral[500];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";

// ── Sub-components ────────────────────────────────────────────────────────────

/**
 * Single metric card — NEUTRAL_50 background with colored number,
 * matching the event/[id].jsx metricCard style.
 */
function MetricCard({ label, value, color, icon }) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIconWrap, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.metricNumber, { color }]}>{value}</Text>
      <Text style={styles.metricCardLabel}>{label}</Text>
    </View>
  );
}

/**
 * A detail row inside an info card (icon + label + value).
 */
function InfoRow({ icon, label, value, last = false }) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <View style={styles.infoRowIcon}>
        <Ionicons name={icon} size={16} color={GREEN_900} />
      </View>
      <View style={styles.infoRowContent}>
        <Text style={styles.infoRowLabel}>{label}</Text>
        <Text style={styles.infoRowValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function VendorMetricsPage() {
  const { id: vendedorId } = useLocalSearchParams();

  const { data: vendor, loading } = useFetch(
    `${ENDPOINTS_USERS.GET_BY_ID}${vendedorId}`,
  );

  // ── Derived display values ────────────────────────────────────────────────
  const displayName = useMemo(() => {
    if (vendor?.firstName && vendor?.lastName) {
      return `${vendor.firstName} ${vendor.lastName}`;
    }
    return vendor?.username || vendor?.email || "Vendedor";
  }, [vendor]);

  const initials = useMemo(() => {
    if (vendor?.firstName && vendor?.lastName) {
      return `${vendor.firstName[0]}${vendor.lastName[0]}`.toUpperCase();
    }
    if (vendor?.username) return vendor.username[0].toUpperCase();
    if (vendor?.email) return vendor.email[0].toUpperCase();
    return "?";
  }, [vendor]);

  // ── Ticket metrics ────────────────────────────────────────────────────────
  const { soldTickets, reservedTickets, availableTickets, assignedTickets } =
    useMemo(() => {
      const sold = vendor?.soldTickets ?? 0;
      const assigned = vendor?.assignedTickets ?? 0;
      const reserved = vendor?.reservedTickets ?? 0;
      // availableTickets = assigned - sold - reserved (floor at 0)
      const available = Math.max(0, assigned - sold - reserved);
      return {
        soldTickets: sold,
        reservedTickets: reserved,
        availableTickets: available,
        assignedTickets: assigned,
      };
    }, [vendor]);

  if (loading) return <LoadingScreen />;

  const profileImageSource = vendor?.photo ?? null;

  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero / banner ──────────────────────────────────── */}
        <View style={styles.banner}>
          {/* Decorative circle — same technique as profile.jsx */}
          <View style={styles.bannerCircle} />

          {/* Avatar */}
          <View style={styles.avatarRing}>
            {profileImageSource ? (
              <Image
                source={{ uri: profileImageSource }}
                style={styles.avatarImage}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}
          </View>

          {/* Name */}
          <Text style={styles.displayName}>{displayName}</Text>

          {/* @username — shown only when it differs from displayName */}
          {vendor?.username && vendor?.username !== displayName && (
            <Text style={styles.usernameText}>@{vendor.username}</Text>
          )}

          {/* Email */}
          {vendor?.email && (
            <Text style={styles.emailText}>{vendor.email}</Text>
          )}

          {/* Role badge */}
          <View style={styles.roleBadge}>
            <Ionicons
              name="storefront-outline"
              size={13}
              color={WHITE}
            />
            <Text style={styles.roleBadgeText}>Vendedor</Text>
          </View>
        </View>

        {/* ── Content area ───────────────────────────────────── */}
        <View style={styles.content}>

          {/* ── Contact / account info ─────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Información</Text>
            <View style={styles.infoCard}>
              {vendor?.firstName && vendor?.lastName && (
                <InfoRow
                  icon="person-outline"
                  label="Nombre"
                  value={`${vendor.firstName} ${vendor.lastName}`}
                />
              )}
              {vendor?.username && (
                <InfoRow
                  icon="at-outline"
                  label="Usuario"
                  value={`@${vendor.username}`}
                />
              )}
              {vendor?.email && (
                <InfoRow
                  icon="mail-outline"
                  label="Correo"
                  value={vendor.email}
                />
              )}
              {vendor?.phone && (
                <InfoRow
                  icon="call-outline"
                  label="Teléfono"
                  value={vendor.phone}
                  last
                />
              )}
            </View>
          </View>

          {/* ── Rendimiento section ────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Rendimiento</Text>

            {/* 2-column metric grid */}
            <View style={styles.metricsGrid}>
              <MetricCard
                label="Vendidos"
                value={soldTickets.toLocaleString()}
                color={GREEN_500}
                icon="checkmark-circle-outline"
              />
              <MetricCard
                label="Reservados"
                value={reservedTickets.toLocaleString()}
                color={BLUE_500}
                icon="time-outline"
              />
              <MetricCard
                label="Disponibles"
                value={availableTickets.toLocaleString()}
                color={NEUTRAL_700}
                icon="ticket-outline"
              />
              <MetricCard
                label="Asignados"
                value={assignedTickets.toLocaleString()}
                color={GREEN_900}
                icon="layers-outline"
              />
            </View>
          </View>

          {/* ── Tickets asignados summary bar ─────────────── */}
          <View style={styles.summaryBar}>
            <View style={styles.summaryBarLeft}>
              <View style={styles.summaryBarIcon}>
                <Ionicons name="ticket-outline" size={22} color={GREEN_900} />
              </View>
              <View>
                <Text style={styles.summaryBarLabel}>Total asignados</Text>
                <Text style={styles.summaryBarNote}>
                  {soldTickets} vendidos · {reservedTickets} reservados
                </Text>
              </View>
            </View>
            <Text style={styles.summaryBarValue}>
              {assignedTickets.toLocaleString()}
            </Text>
          </View>

          {/* ── Progress bar: sold / assigned ─────────────── */}
          {assignedTickets > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Progreso de ventas</Text>
              <View style={styles.progressCard}>
                {/* Percentage label */}
                <View style={styles.progressHeader}>
                  <Text style={styles.progressPct}>
                    {Math.round((soldTickets / assignedTickets) * 100)}%
                  </Text>
                  <Text style={styles.progressSubtitle}>
                    {soldTickets} de {assignedTickets} tickets vendidos
                  </Text>
                </View>

                {/* Bar */}
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min(100, (soldTickets / assignedTickets) * 100)}%`,
                      },
                    ]}
                  />
                </View>

                {/* Reserved secondary bar */}
                {reservedTickets > 0 && (
                  <>
                    <View style={styles.progressReservedBg}>
                      <View
                        style={[
                          styles.progressReservedFill,
                          {
                            width: `${Math.min(100, (reservedTickets / assignedTickets) * 100)}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressReservedLabel}>
                      {reservedTickets} reservados
                    </Text>
                  </>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: NEUTRAL_50,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Banner ───────────────────────────────────────────────
  banner: {
    backgroundColor: GREEN_900,
    alignItems: "center",
    paddingTop: 36,
    paddingBottom: 32,
    overflow: "hidden",
  },
  bannerCircle: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: GREEN_700,
    opacity: 0.25,
    top: -80,
    right: -60,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    overflow: "hidden",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: GREEN_500,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarInitials: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    letterSpacing: 2,
  },
  displayName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: WHITE,
    marginBottom: 4,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  usernameText: {
    fontSize: Typography.sizes.sm,
    color: GREEN_100,
    marginBottom: 2,
  },
  emailText: {
    fontSize: Typography.sizes.sm,
    color: GREEN_100,
    marginBottom: 10,
    opacity: 0.85,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: BLUE_500,
    marginTop: 4,
  },
  roleBadgeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: WHITE,
  },

  // ── Content area ─────────────────────────────────────────
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 20,
  },

  // ── Section wrapper ──────────────────────────────────────
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: NEUTRAL_500,
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingHorizontal: 4,
  },

  // ── Info card (contact rows) ─────────────────────────────
  infoCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_100,
    gap: 12,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoRowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
  },
  infoRowContent: {
    flex: 1,
  },
  infoRowLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    marginBottom: 2,
  },
  infoRowValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },

  // ── Metrics grid ─────────────────────────────────────────
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metricCard: {
    // ~48% width accounts for gap: 8 between two columns
    width: "48%",
    backgroundColor: NEUTRAL_50,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  metricIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  metricNumber: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    marginBottom: 2,
  },
  metricCardLabel: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // ── Summary bar ──────────────────────────────────────────
  summaryBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: GREEN_50,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: GREEN_500,
  },
  summaryBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  summaryBarIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: NEUTRAL_200,
  },
  summaryBarLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: GREEN_900,
  },
  summaryBarNote: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    marginTop: 2,
  },
  summaryBarValue: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },

  // ── Progress card ─────────────────────────────────────────
  progressCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 10,
  },
  progressPct: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
  },
  progressSubtitle: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: NEUTRAL_200,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: GREEN_500,
    borderRadius: 4,
  },
  progressReservedBg: {
    height: 5,
    backgroundColor: NEUTRAL_100,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressReservedFill: {
    height: 5,
    backgroundColor: BLUE_100,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: BLUE_500,
  },
  progressReservedLabel: {
    fontSize: Typography.sizes.xs,
    color: BLUE_500,
    fontWeight: Typography.weights.medium,
    marginTop: 2,
  },
});