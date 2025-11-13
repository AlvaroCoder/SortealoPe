import { Text, View } from 'react-native'
import { Colors } from '../../../constants/theme'

export default function TextPrevAccount({
    type="register"
}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center',backgroundColor : 'white', width : "100%", height : 40, paddingVertical : 10 }}>
        <Text>¿ Ya tienes una cuenta creada ?</Text>
        <Text style={{ color: Colors.principal.red[600], fontWeight: 'bold' }}>
          {type === "register" ? " Inicia sesión" : " Regístrate"}
        </Text>
    </View>
  )
};