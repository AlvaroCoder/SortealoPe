import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../../constants/theme'

export default function DividerO() {
  return (
    <View style={styles.divider}>
        <View style={styles.separatorLine} />
        <Text style={styles.dividerText}>o</Text>
        <View style={styles.separatorLine} />
    </View>
  )
};

const styles = StyleSheet.create({
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        paddingHorizontal : 28
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor : Colors.light.border
    },
    dividerText: {
        textAlign: 'center',
        color: '#666',
        marginHorizontal: 10,
    },
})
