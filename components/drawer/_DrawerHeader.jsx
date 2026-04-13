import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/theme";

const GREEN_50 = Colors.principal.green[50];
const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[500];
const NEUTRAL_100 = Colors.principal.neutral[100];

const URL_IMAGEN_MASCOTA =
  "https://res.cloudinary.com/dabyqnijl/image/upload/v1764234644/COSAI_LOGOS_1_1_dbzabh.png";

export default function DrawerHeader({ tagline }) {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Image
            source={{ uri: URL_IMAGEN_MASCOTA }}
            style={styles.mascotImage}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </View>
      </View>
      <Text style={styles.appName}>SORTEALOPE</Text>
      {tagline ? <Text style={styles.appTagline}>{tagline}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: GREEN_50,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_100,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: GREEN_50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: NEUTRAL_100,
    overflow: "hidden",
  },
  mascotImage: {
    width: "100%",
    height: "100%",
  },
  appName: {
    fontSize: 24,
    fontWeight: "800",
    color: GREEN_900,
    textAlign: "center",
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: GREEN_500,
    textAlign: "center",
    fontWeight: "500",
  },
});
