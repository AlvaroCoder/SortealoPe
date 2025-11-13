import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Colors } from '../../../constants/theme'

export default function ButtonVariant({
    children,
    onPress, 
    style
}) {
  return (
    <TouchableOpacity 
        onPress={onPress}
        style={[styles.button, style]}
      >
          <Text>{ children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 25,
        shadowColor: "#000",
        overflow: 'hidden',
        shadowOffset: {
            width: 0,
            height : 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor : Colors.principal.yellow[300]
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    }
})