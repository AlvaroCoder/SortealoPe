import { StyleSheet, View } from 'react-native';
import ButtonGradiendt from '../../components/common/Buttons/ButtonGradiendt';
import Title from '../../components/common/Titles/Title';

export default function FormInitial({
    title = "Registro",
    buttonText = "Registrarse",
    children,
    onSubmit = () => { },
    textPosition="center"
}) {
  return (
      <View contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
              <Title styleTitle={[styles.title, {textAlign : textPosition}]}>{title}</Title>
              
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

        marginBottom: 10,
    },
    formBody: {
        width: '100%',
        marginBottom: 30,
    },
    buttonContainer: {
        marginTop: 10,
    },
});
