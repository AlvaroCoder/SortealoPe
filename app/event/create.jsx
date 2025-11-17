import { ScrollView, StyleSheet, Text, View } from 'react-native';
import OutlineTextField from '../../components/common/TextFields/OutlineTextField';
import { Colors } from '../../constants/theme';
import FormInitial from '../../views/Form/FormInitial';

export default function Create() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
      >
        <FormInitial
          title='Nuevo evento'
          buttonText='Registrar evento'
          textPosition='left'
        >
          <OutlineTextField
            title='Nombre del evento'
            placeholder='Nombre del evento'
            required={true}
          />

          <View style={{ height: 16 }} />
          
          <View style={styles.styleRow}>
            <OutlineTextField
              title='Precio'
              placeholder='ej. S/.50.00'
              required={true}
              styleContainer={{ flex : 1 }}
            />
            <OutlineTextField
              title='Cantidad de numeros'
              placeholder='1 - 100'
              required={true}
              styleContainer={{ flex : 1}}
            />
          </View>

          <View style={{ height: 16 }} />

          <OutlineTextField
            title='Lugar de la rifa'
            required={true}
            placeholder='Urb. Los Jardines Mz. A Lt. 12'
          />

          <View style={{ height: 16 }} />

          <OutlineTextField
            title='Fecha del sorteo'
            placeholder='Ej. 12/12/2024'
            required={true}
          />
        </FormInitial>
        <View style={{flex : 1, marginHorizontal : 30, marginTop : 10, alignItems : 'center'}}>
          <Text>Al continuar estas aceptando los <Text style={{color : Colors.principal.red[900]}}>terminos y condiciones</Text> </Text>
         
        </View>
      </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : 'white'
  },
  scrollContainer: {
    flexGrow: 1,
    
  },
  styleRow: {
    display : 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%'
  }
})