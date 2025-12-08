import { StyleSheet, Text, View } from "react-native";
import ButtonGradiend from "../../components/common/Buttons/ButtonGradiendt";

export default function FloatingSellingButton({ handlePress }) {
  return (
    <View style={styles.containerButton}>
      <ButtonGradiend
        onPress={handlePress}
        style={{ width: "100%", zIndex: 100 }}
      >
        <Text>Vender Tickets</Text>
      </ButtonGradiend>
    </View>
  );
}

const styles = StyleSheet.create({
  containerButton: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    elevation: 5,
    borderRadius: 10,
    paddingVertical: 10,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: "white",
    zIndex: 20,
  },
});
