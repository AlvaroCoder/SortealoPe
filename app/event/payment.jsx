import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import CardPriceTicket from "../../components/common/Card/CardPriceTicket";
import PlanTickets from "../../mock/PlanTickets.json";

export default function Payment() {
    const router = useRouter();
    const Plan = PlanTickets;
    const handlePress = () => {
        router.push("/event/create");
    }
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Selecciona tu plan</Text>
          {
            Plan.map((item, idx) => 
                <CardPriceTicket
                    key={idx}
                    onSelect={handlePress}
                    {...item}
                />
            )
        }
    </View>
  )
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white',
        flex : 1
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
})