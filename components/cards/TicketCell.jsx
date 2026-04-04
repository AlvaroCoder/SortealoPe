import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";
import { Colors, Typography } from "../../constants/theme";

const GREEN_500 = Colors.principal.green[500];
const WHITE = "#FFFFFF";
const NEUTRAL_100 = Colors.principal.neutral[100];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_400 = Colors.principal.neutral[400];
const NEUTRAL_700 = Colors.principal.neutral[700];

const SCREEN_W = Dimensions.get("window").width;
const CELL_SIZE = (SCREEN_W - 32 - 3 * 8) / 4; // 4 cols, 8px gap, 16px side padding

export default function TicketCell({ ticket, selected, sold, onToggle }) {
  const isDisabled = sold;

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        selected && styles.cellSelected,
        sold && styles.cellSold,
      ]}
      onPress={() => !isDisabled && onToggle(ticket)}
      activeOpacity={isDisabled ? 1 : 0.75}
      disabled={isDisabled}
    >
      <Text
        style={[
          styles.cellText,
          selected && styles.cellTextSelected,
          sold && styles.cellTextSold,
        ]}
      >
        {String(ticket.serialNumber ?? ticket.id ?? "—").padStart(3, "0")}
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  // ── Cell ────────────────────────────────────────────────────────────────────
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 14,
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: NEUTRAL_200,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cellSelected: {
    backgroundColor: GREEN_500,
    borderColor: GREEN_500,
    shadowColor: GREEN_500,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  cellSold: {
    backgroundColor: NEUTRAL_100,
    borderColor: NEUTRAL_200,
    shadowOpacity: 0,
    elevation: 0,
  },
  cellText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.extrabold,
    color: NEUTRAL_700,
  },
  cellTextSelected: {
    color: WHITE,
  },
  cellTextSold: {
    color: NEUTRAL_400,
    textDecorationLine: "line-through",
  },
});
