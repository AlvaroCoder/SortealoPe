import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Colors } from '../../../constants/theme'

export default function ButtonGradiend({
  children,
  onPress,
  style
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <LinearGradient
        colors={[Colors.principal.green[500], Colors.principal.green[700]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={styles.text}>{children}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',

  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
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