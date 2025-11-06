import { StyleSheet, Text } from "react-native";
import { Typography } from "../../../constants/theme";

export default function Title({ children }) {
  return <Text style={styles.styleTitle}>{children}</Text>;
}

const styles = StyleSheet.create({
  styleTitle: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.bold
  },
});
