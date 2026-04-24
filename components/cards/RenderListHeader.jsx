import { StyleSheet, Text, View } from "react-native";

export default function RenderListHeader() {
  return (
    <View style={styles.headerBlock}>
      {/* ── Top nav bar ─────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={GREEN_900} />
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={styles.topBarTitle}>Vendedores del Evento</Text>
          <Text style={styles.topBarSubtitle} numberOfLines={1}>
            {event?.title ?? "—"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.navBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="settings-outline" size={22} color={GREEN_900} />
        </TouchableOpacity>
      </View>

      {/* ── Total recaudado dark card ────────────────────────────── */}
      <View style={styles.totalCard}>
        {/* Decorative circle */}
        <View style={styles.totalCardCircle} />
        <Text style={styles.totalLabel}>TOTAL RECAUDADO</Text>
        <Text style={styles.totalAmount}>{formatMoney(totalCollected)}</Text>
        {/* Decorative icon */}
        <Ionicons
          name="wallet-outline"
          size={90}
          color="rgba(255,255,255,0.07)"
          style={styles.totalDecorIcon}
        />
      </View>

      {/* ── Mini metric cards ────────────────────────────────────── */}
      <View style={styles.miniRow}>
        <View style={styles.miniCard}>
          <Ionicons
            name="ticket-outline"
            size={22}
            color={GREEN_500}
            style={styles.miniIcon}
          />
          <Text style={styles.miniLabel}>Boletos Vendidos</Text>
          <Text style={[styles.miniValue, { color: GREEN_900 }]}>
            {totalSold.toLocaleString()}
          </Text>
        </View>
        <View style={styles.miniCard}>
          <Ionicons
            name="people-outline"
            size={22}
            color={BLUE_500}
            style={styles.miniIcon}
          />
          <Text style={styles.miniLabel}>Vendedores</Text>
          <Text style={[styles.miniValue, { color: GREEN_900 }]}>
            {totalSellers} Activos
          </Text>
        </View>
      </View>

      {/* ── Search bar ───────────────────────────────────────────── */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={18}
          color={NEUTRAL_500}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar vendedor por nombre..."
          placeholderTextColor={NEUTRAL_400}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchText("")}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color={NEUTRAL_400} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Section header ────────────────────────────────────────── */}
      <View style={styles.rankingHeader}>
        <Text style={styles.rankingTitle}>Ranking</Text>
        <TouchableOpacity style={styles.verTodosBtn}>
          <Text style={styles.verTodosText}>Ver todos</Text>
          <Ionicons name="chevron-forward" size={14} color={GREEN_500} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
