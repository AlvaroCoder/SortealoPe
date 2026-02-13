import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/theme';

export default function TextPrevAccount({
    type = "register",
    
}) {
    const router = useRouter();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center',backgroundColor : 'white', width : "100%", height : 40, paddingVertical : 10 }}>
        <Text>¿ Ya tienes una cuenta creada ?</Text>
          <TouchableOpacity onPress={() => {
              if (type === "register") {
                router.push('/(auth)/login');
              } else {
                  router.push('/(auth)/register');
              }
          }}>
            <Text style={{ color: Colors.principal.blue[600], fontWeight: 'bold' }}>
                {type === "register" ? " Inicia sesión" : " Regístrate"}
            </Text>
        </TouchableOpacity>
    </View>
  )
};