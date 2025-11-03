import Constants from 'expo-constants';
import { StyleSheet, Text, View } from 'react-native';

export default function Create() {
  return (
    <View style={styles.container}>
      <Text>Crear un evento</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
    
  }
})