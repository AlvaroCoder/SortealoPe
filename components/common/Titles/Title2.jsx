import { StyleSheet, Text } from 'react-native'
import { Typography } from '../../../constants/theme'

export default function Title2({
    children,
    styleTitle={}
}) {
  return (
      <Text style={[styles.title, styleTitle]}>{ children  }</Text>
  )
};

const styles = StyleSheet.create({
    title: {
        fontSize: Typography.sizes['lg'],
        fontWeight: Typography.weights.bold,
    }
})
