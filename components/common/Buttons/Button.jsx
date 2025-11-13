import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { Colors, Typography } from '../../../constants/theme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}){
  const getButtonStyle = () => {
    const baseStyle = styles.base;
    const variantStyle = styles[variant];
    const sizeStyle = styles[size];
    const disabledStyle = disabled ? styles.disabled : {};
    
    return [baseStyle, variantStyle, sizeStyle, disabledStyle, style];
  };

  const getTextStyle = () => {
    const baseTextStyle = styles.baseText;
    const variantTextStyle = styles[`${variant}Text`];
    const sizeTextStyle = styles[`${size}Text`];
    const disabledTextStyle = disabled ? styles.disabledText : {};
    
    return [baseTextStyle, variantTextStyle, sizeTextStyle, disabledTextStyle, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getTextStyle().find(s => s.color)?.color || Colors.light.background} 
        />
      ) : (
        <Text style={getTextStyle()}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  baseText: {
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
  },

  primary: {
    backgroundColor: Colors.principal.red[500],
    borderColor: Colors.principal.red[500],
  },
  primaryText: {
    color: Colors.light.background,
  },

  secondary: {
    backgroundColor: Colors.principal.yellow[300],
    borderColor: Colors.principal.yellow[300],
  },
  secondaryText: {
    color: Colors.light.text,
  },

  outline: {
    backgroundColor: 'transparent',
    borderColor: Colors.principal.red[500],
  },
  outlineText: {
    color: Colors.principal.red[500],
  },

  small: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    minWidth: 120,
  },
  smallText: {
    fontSize: Typography.sizes.sm,
  },

  medium: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    minWidth: 160,
  },
  mediumText: {
    fontSize: Typography.sizes.base,
  },

  large: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    minWidth: 200,
  },
  largeText: {
    fontSize: Typography.sizes.lg,
  },

  disabled: {
    backgroundColor: Colors.light.border,
    borderColor: Colors.light.border,
    opacity: 0.6,
  },
  disabledText: {
    color: Colors.light.textMuted,
  },
});
