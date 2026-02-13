import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../../constants/theme'

export default function CardEmptyRegisterEvent() {
  return (
    <View style={styles.container}>
        <View style={styles.textContainer}>
              <Text>No formas parte de ningun evento</Text>
              <Text style={styles.textStyleLink}>Unirte a un evento</Text>
        </View>
    </View>
  )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.principal.yellow[50],
        width: "100%",
        paddingVertical: 45,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical : 20
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap : 5
    },
    textStyleLink: {
        color: Colors.principal.red[900],
        textDecorationLine : 'underline'
    }
})