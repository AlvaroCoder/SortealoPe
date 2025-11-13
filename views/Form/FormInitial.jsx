import { StyleSheet, Text, View } from 'react-native';
import ButtonGradiendt from '../../components/common/Buttons/ButtonGradiendt';

export default function FormInitial({
    title = "Registro",
    buttonText = "Registrarse",
    children,
    onSubmit =()=>{}
}) {
  return (
      <View contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
              <Text style={styles.title}>{title}</Text>
              
              <View style={styles.formBody}>
                  {children}
              </View>

              <View style={styles.buttonContainer}>
                  <ButtonGradiendt
                    onPress={onSubmit}
                  >
                      {buttonText}
                  </ButtonGradiendt>
              </View>
          </View>
    </View>
  )
};

const styles = StyleSheet.create({
    scrollContainer: {
        width: "100%",
        padding : 24,
        marginBottom: 0,
        backgroundColor : 'white'
    },
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor : 'white'
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#D52941',
        marginBottom: 40,
    },
    formBody: {
        width: '100%',
        marginBottom: 30,
    },
    buttonContainer: {
        marginTop: 10,
    },
});
