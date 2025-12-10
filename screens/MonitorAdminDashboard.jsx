import { ScrollView, StyleSheet, View } from "react-native";
import ButtonCreateEvent from "../components/common/Buttons/ButtonCreateEvent";
import Title from "../components/common/Titles/Title";
import { Colors, Typography } from "../constants/theme";
import DataCardEvent from "../mock/DataCardEvent.json";
import RolSwitchBar from "../views/Bars/RolSwitchBar";
import CarrouselViewMainCard from "../views/Sliders/CarrouselViewMainCard";

const GREEN_900 = Colors.principal.green[900];
const NEUTRAL_200 = Colors.principal.neutral[200];
const WHITE = "#FFFFFF";

export default function MonitorAdminDashboard({ userRole, updateRole }) {
  const mockEventData = DataCardEvent;

  return (
    <View style={styles.monitorContainer}>
      <RolSwitchBar userRole={userRole} updateRole={updateRole} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Title>Eventos Creados</Title>
          <CarrouselViewMainCard data={mockEventData} />
        </View>
        
      </ScrollView>
      <ButtonCreateEvent/>
    </View>
  );
}

const styles = StyleSheet.create({
  monitorContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContent: {},
  divider: {
    height: 1,
    backgroundColor: NEUTRAL_200,
    marginVertical: 20,
    marginHorizontal: 24,
  },
  section: {
    paddingHorizontal: 24,
    
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: GREEN_900,

  },

  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  vendorList: {
    marginTop: 10,
    marginBottom : 100
  },
});
