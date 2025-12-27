import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/theme';

const BLUE_500 = Colors.principal.blue[800]; 
const WHITE = 'white';

export default function ButtonFloatinQRScan({ onPress = () => {} }) {
  return (
    <View style={styles.containerButton}>
          <TouchableOpacity 
            style={styles.buttonStyle}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Escanear QR</Text> 
              <Ionicons name='scan-outline' size={24} color={WHITE} /> 
            </View>
        </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
    containerButton : {
        position: 'absolute',
        right: 20, 
        bottom: 40,
        zIndex : 100,
    },
  buttonStyle: {
      flexDirection : 'row',
    alignItems: 'center',
      justifyContent : 'center',
        paddingHorizontal : 20, 
      borderRadius: 30,
      height: 60,
        
        backgroundColor: BLUE_500, 
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: {
        color: WHITE,
        fontSize: 16,
        fontWeight: 'bold',
    }
});