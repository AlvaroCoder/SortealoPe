import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OutlineTextField({
  title = "Nombre",
  value = "",
  onChangeText = () => {},
  placeholder = "",
  secureTextEntry = false,
  required = false,
  type = "text",
  keyboardType = "default",
  maxLength,
  error = "",
  editable = true,
  returnKeyType = "next",
  styleContainer,
  multiline = false,
  numberOfLines = 4,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const getKeyboardType = () => {
    if (keyboardType !== "default") return keyboardType;
    switch (type) {
      case "number":
        return "numeric";
      case "email":
        return "email-address";
      case "phone":
        return "phone-pad";
      default:
        return "default";
    }
  };

  const handleTextChange = (text) => {
    let processed = text;

    switch (type) {
      case "number":
        processed = text.replace(/[^0-9.]/g, "");
        const decimals = (processed.match(/\./g) || []).length;
        if (decimals > 1) processed = processed.slice(0, -1);
        break;
      case "phone":
        processed = text.replace(/[^0-9\s\-\(\)]/g, "");
        break;
    }

    setInternalValue(processed);
    onChangeText(processed);
  };

  const showPasswordToggle =
    secureTextEntry && !multiline && internalValue.length > 0;

  return (
    <View style={[styles.container, styleContainer]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, error && styles.titleError]}>
          {title}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <View
        style={[
          styles.inputContainer,
          multiline && styles.textAreaContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        <TextInput
          style={[
            styles.textInput,
            multiline && styles.textAreaInput,
            !editable && styles.textInputDisabled,
          ]}
          value={internalValue}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry && !showPassword && !multiline}
          keyboardType={getKeyboardType()}
          maxLength={maxLength}
          editable={editable}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          textAlignVertical={multiline ? "top" : "center"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize={type === "email" ? "none" : "sentences"}
          autoCorrect={type !== "email"}
          returnKeyType={multiline ? "default" : returnKeyType}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowPassword((prev) => !prev)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  titleError: {
    color: "#D52941",
  },
  required: {
    color: "#D52941",
  },
  errorText: {
    fontSize: 12,
    color: "#D52941",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#CCC",
    borderRadius: 10,
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    minHeight: 50,
  },
  textAreaContainer: {
    alignItems: "flex-start",
    minHeight: 120,
    paddingVertical: 12,
  },
  inputContainerFocused: {
    borderColor: "#FCD581",
  },
  inputContainerError: {
    borderColor: "#D52941",
  },
  inputContainerDisabled: {
    backgroundColor: "#F2F2F2",
    borderColor: "#E0E0E0",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 10,
  },
  textAreaInput: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  textInputDisabled: {
    color: "#888",
  },
  toggleButton: {
    padding: 6,
  },
});