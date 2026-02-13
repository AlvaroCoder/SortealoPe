import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const GREEN_100 = Colors.principal.green[100];
const GREEN_200 = Colors.principal.green[200];
const WHITE = Colors.principal.white;

export default function ButtonUploadImage({
  onImageSelected = () => {},
  image = null,
  title = "Subir imagen",
  subtitle = "Requerido: 1080 x 1620 px",
  requiredWidth = 1080,
  requiredHeight = 1620
}) {
  const [selectedImage, setSelectedImage] = useState(image)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    
    if (status !== 'granted') {
      Alert.alert('Permisos necesarios', 'Necesitamos acceso a tu galería para subir imágenes.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, 
      quality: 1,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const { uri, width, height } = result.assets[0];

      if (width !== requiredWidth || height !== requiredHeight) {
        Alert.alert(
          "Tamaño Incorrecto", 
          `La imagen debe tener exactamente ${requiredWidth}x${requiredHeight} píxeles.\n\nDetectado: ${width}x${height} px.`
        );
        return;
      }

      setSelectedImage(uri)
      onImageSelected(uri)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    onImageSelected(null)
  }

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: selectedImage }} 
            style={styles.image}
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.changeButton}
            onPress={pickImage}
          >
            <Text style={styles.changeButtonText}>Cambiar imagen</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={removeImage}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          <View style={styles.uploadIcon}>
            <Ionicons name='camera-outline' size={30} color={GREEN_900}/>
          </View>
          <Text style={styles.uploadTitle}>{title}</Text>
          <Text style={styles.uploadSubtitle}>{subtitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: GREEN_200,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: GREEN_200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GREEN_900,
    marginBottom: 2,
    textAlign: 'center',
  },
  uploadSubtitle: {
    fontSize: 12,
    color: GREEN_900,
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: GREEN_500,
    backgroundColor: GREEN_100,
  },
  image: {
    width: '100%',
    height: 250,
  },
  changeButton: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 71, 57, 0.9)', 
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeButtonText: {
    color: WHITE,
    fontWeight: '600',
    fontSize: 13,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
})