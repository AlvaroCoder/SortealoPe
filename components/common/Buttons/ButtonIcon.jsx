import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Typography } from "../../../constants/theme";

export default function ButtonIcon({
  title = "",
  iconName,
  onPress,
  variant = "primary",
}) {
  const getButtonStyle = () => {
    const baseStyle = styles.buttonSelectorBase;
    const variantStyle =
      variant === "primary"
        ? styles.buttonSelectorPrimary
        : styles.buttonSelectorSecondary;

    return [baseStyle, variantStyle];
  };

  const getTextStyle = () => {
    return variant === "primary"
      ? styles.buttonSelectorTextPrimary
      : styles.buttonSelectorSecondary
  };

  const getIconColor = () => {
    return variant === "primary"
      ? Colors.principal.red[500]
      : Colors.light.background
  };

  const getIconBackground = () => {
    return variant === "primary"
      ? Colors.principal.red[50]
      : 'rgba(255, 255, 255, 0.2)'
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.buttonIconContainer, {backgroundColor : getIconBackground()}]}>
        <Ionicons
          name={iconName}
          size={20}
          color={getIconColor()}
        />
      </View>
      <Text style={getTextStyle()} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonSelectorBase: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  buttonSelectorPrimary: {
    backgroundColor: Colors.light.background,
  },
  buttonSelectorSecondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  buttonSelectorTextPrimary: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.light.text,
    flex: 1,
  },
  buttonSelectorTextSecondary: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.light.background,
    flex: 1,
  },
  buttonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
});
