import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/theme';

export default function LoadingScreen({ text = "Cargando información..." }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color={Colors.principal.blue[500]} />
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loaderBox: {
    backgroundColor: Colors.principal.neutral?.[900] || "rgba(255,255,255,0.15)",
    paddingVertical: 22,
    paddingHorizontal: 28,
    borderRadius: 14,
    alignItems: 'center',
    gap: 12,
  },
  text: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "500",
    color: '#fff',
  },
});