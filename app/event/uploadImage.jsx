import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ButtonUploadImage from "../../components/common/Buttons/ButtonUploadImage";
import Title2 from "../../components/common/Titles/Title2";
import FormInitial from "../../views/Form/FormInitial";

export default function UploadImage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState(null);

  const formData = params.formData ? JSON.parse(params.formData) : {};

  const handleImageSelected = (imageUri) => {
    setSelectedImage(imageUri);
  };
  const handleSubmit = () => {
    if (!selectedImage) {
      Alert.alert("Imagen requerida", "Por favor sube una imagen del ticket.");
      return;
    }

    const completeData = {
      ...formData,
      ticketImage: selectedImage,
    };

    console.log("Datos completos del evento:", completeData);

    Alert.alert("¡Éxito!", "Evento creado correctamente", [
      {
        text: "OK",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <FormInitial
          title="Imagen del ticket"
          buttonText="Crear evento"
          onSubmit={handleSubmit}
          textPosition="left"
        >
          <Text style={styles.description}>
            Sube una imagen clara del ticket para tu evento. Esta será la imagen
            principal que verán los participantes.
          </Text>

          <ButtonUploadImage
            onImageSelected={handleImageSelected}
            image={selectedImage}
            title="Subir imagen del ticket"
            subtitle="Formatos: JPG, PNG (Max. 5MB)"
          />

          <View style={{ height: 16 }} />

          <View>
            <Title2>Imagen de Refencia</Title2>
            <View style={{marginTop : 10}}>
              <Image
                source={{
                  uri: "https://res.cloudinary.com/dabyqnijl/image/upload/v1763347595/Draw_Date_vbaoqm.png",
                }}
                style={styles.imageRef}
              />
            </View>
          </View>
        </FormInitial>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  imageRef: {
    width: "100%",
    height: 160,
    borderRadius : 8
  },
});
