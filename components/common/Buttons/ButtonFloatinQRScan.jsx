import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
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
              <Ionicons name='scan-outline' size={30} color={WHITE} />
        </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
    containerButton : {
        position: 'absolute',
        right: 20, 
        bottom: 20,
        zIndex : 100,
    },
    buttonStyle: {
        width : 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: BLUE_500, 
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    }
});