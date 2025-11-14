import { StyleSheet, Text } from 'react-native'
import { Colors, Typography } from '../../../constants/theme'

export default function Title2({
    children
}) {
  return (
      <Text style={[styles.title]}>{ children  }</Text>
  )
};

const styles = StyleSheet.create({
    title: {
        fontSize: Typography.sizes['xl'],
        fontWeight: Typography.weights.bold,
        color : Colors.principal.red[900]
    }
})
