import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../constants/theme";

const GREEN_900 = Colors.principal.green[900]; 
const FAB_BACKGROUND_COLOR = Colors.principal.yellow[300]; 
const FAB_ICON_COLOR = GREEN_900; 

export default function ButtonCreateEvent() {
    const router = useRouter();
    
    const handlePress = () => {
        router.push("event/create"); 
    };

    return (
        <View style={styles.mainContainerButton}>
            <TouchableOpacity 
                style={styles.buttonStyle}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>Crear Evento</Text>  
                <Ionicons 
                    name="add-outline" 
                    size={28} 
                    color={FAB_ICON_COLOR} 
                    style={styles.iconStyle}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  mainContainerButton: {
    position: "absolute",
    right: 20, 
    bottom: 40,
    zIndex: 10, 
  },
  buttonStyle: {
    flexDirection: 'row',
    alignItems: "center",
    height: 60,
    paddingHorizontal: 20, 
    borderRadius: 30, 
    justifyContent: "center",
    
    backgroundColor: FAB_BACKGROUND_COLOR,
    borderWidth: 2,
    borderColor: GREEN_900,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  buttonText: {
    color: GREEN_900, 
    fontSize: 18,
    fontWeight: '700',
    marginRight: 5, 
  },
  iconStyle: {
    marginLeft: 5,
  }
});