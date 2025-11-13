import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function OutlineTextField({
    title = "Nombre",
    value,
    onChangeText,
    placeholder = "",
    secureTextEntry = false,
    required = false,
    type = "text",
    keyboardType = "default",
    maxLength,
    error = "",
    editable = true,
    returnKeyType="next"
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [internalValue, setInternalValue] = useState(value || "");

  const getKeyboardType = () => {
    if (keyboardType !== "default") return keyboardType
    
    switch (type) {
      case "number":
        return "numeric"
      case "email":
        return "email-address"
      case "phone":
        return "phone-pad"
      default:
        return "default"
    }
  }

  const handleTextChange = (text) => {
    let processedText = text
    console.log(text);
    
    switch (type) {
      case "number":
        processedText = text.replace(/[^0-9.]/g, '')
        const decimalCount = (processedText.match(/\./g) || []).length
        if (decimalCount > 1) {
          processedText = processedText.slice(0, -1)
        }
        break
      
      case "email":
        break
      
      case "phone":
        processedText = text.replace(/[^0-9\s\-\(\)]/g, '')
        break
      
      default:
        break
    }
    
    setInternalValue(processedText)

    if (onChangeText) {
      console.log(processedText);
      
      onChangeText(processedText)
    }
  }

  React.useEffect(() => {
    setInternalValue(value || '')
  }, [value]);
  
  const shouldShowPasswordToggle = secureTextEntry && value && value.length > 0

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[
          styles.title,
          error ? styles.titleError : {}
        ]}>
          {title}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
      </View>

      <View style={[
        styles.inputContainer,
        isFocused ? styles.inputContainerFocused : {},
        error ? styles.inputContainerError : {},
        !editable ? styles.inputContainerDisabled : {}
      ]}>
        <TextInput
          style={[
            styles.textInput,
            !editable ? styles.textInputDisabled : {}
          ]}
          value={internalValue}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={getKeyboardType()}
          maxLength={maxLength}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          
          autoCapitalize={type === "email" ? "none" : "sentences"}
          autoCorrect={type !== "email"}
          returnKeyType='next'
        />
        
        {shouldShowPasswordToggle && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.toggleText}>
              {showPassword ? <Ionicons name="eye-outline" /> :  <Ionicons name='eye-off-outline' />}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  titleError: {
    color: '#D52941',
  },
  required: {
    color: '#D52941',
  },
  errorText: {
    fontSize: 12,
    color: '#D52941',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    minHeight: 50,
  },
  inputContainerFocused: {
    borderColor: '#FCD581',
    shadowColor: '#FCD581',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: '#D52941',
  },
  inputContainerDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#EEE',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  textInputDisabled: {
    color: '#999',
  },
  toggleButton: {
    padding: 4,
    marginLeft: 8,
  },
  toggleText: {
    fontSize: 16,
  },
})