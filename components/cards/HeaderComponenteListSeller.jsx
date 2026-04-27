import { Ionicons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors, Typography } from "../../constants/theme";

const GREEN_900 = Colors.principal.green[900];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400] ?? "#94A3B8";
const NEUTRAL_500 = Colors.principal.neutral[500];
const WHITE = "#FFFFFF";

export default function HeaderComponenteListSeller({
  searchText,
  setSearchText,
  filtered,
}) {
  return (
    <View style={styles.listHeader}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={NEUTRAL_400} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar vendedor..."
          placeholderTextColor={NEUTRAL_400}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          clearButtonMode="while-editing"
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

      {/* Contador */}
      <Text style={styles.countText}>
        {filtered.length} vendedor{filtered.length !== 1 ? "es" : ""}
        {searchText.length > 0 ? ` para "${searchText}"` : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── List header
  listHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: NEUTRAL_200,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: GREEN_900,
    padding: 0,
  },
  countText: {
    fontSize: Typography.sizes.xs,
    color: NEUTRAL_500,
    fontWeight: Typography.weights.medium,
    paddingHorizontal: 2,
  },
});
