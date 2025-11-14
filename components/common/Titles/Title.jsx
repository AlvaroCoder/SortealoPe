import { StyleSheet, Text } from "react-native";
import { Colors, Typography } from "../../../constants/theme";

export default function Title({ children, styleTitle }) {
  return <Text style={[styles.styleTitle, styleTitle, {color : Colors.principal.red[900]}]}>{children}</Text>;
}

const styles = StyleSheet.create({
  styleTitle: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.bold,
    tintColor :Colors.principal.red[900],
  },
});
