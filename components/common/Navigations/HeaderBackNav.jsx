import { Ionicons } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors } from '../../../constants/theme'

const GREEN_900 = Colors.principal.green[900];
const WHITE = '#FFFFFF';

export default function HeaderBackNav({
    title = "Registrar evento",
    showBackButton = true
}) {
  const router = useRouter()

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    }
  }

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <Ionicons name='arrow-back-outline' color={WHITE} size={24}/>
        </TouchableOpacity>
      )}
      
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      
      {showBackButton && <View style={styles.placeholder} />}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      paddingTop: Constants.statusBarHeight + 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: GREEN_900, 
    },
    backButton: {
      padding: 5,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: WHITE, 
      textAlign: 'center',
      flex: 1,
      marginHorizontal: 8,
    },
    placeholder: {
      width: 34, 
    },
})