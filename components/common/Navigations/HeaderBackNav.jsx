import { Ionicons } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors } from '../../../constants/theme'

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
          <Ionicons name='arrow-back-outline' color={Colors.principal.red[900]} size={20}/>
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
      marginTop: Constants.statusBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  backButtonText: {
    fontSize: 24,
    color: Colors.principal.red[900],
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.principal.red[900],
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  placeholder: {
    width: 40,
  },
})