import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import ButtonFloatinQRScan from "../components/common/Buttons/ButtonFloatinQRScan";
import Title from "../components/common/Titles/Title";
import { Colors, Typography } from "../constants/theme";
import { useRaffleContext } from "../context/RaffleContext";
import DataCardEvent from "../mock/DataCardEvent.json";
import RolSwitchBar from "../views/Bars/RolSwitchBar";
import CarrouselViewMainCard from "../views/Sliders/CarrouselViewMainCard";

const GREEN_900 = Colors.principal.green[900];
const NEUTRAL_200 = Colors.principal.neutral[200];
const WHITE = "#FFFFFF";

const mockEventData = [];

export default function MonitorSellerDashboard() {
  const { userRole, updateRole } = useRaffleContext();
  const mockEventDataPlaceholder = DataCardEvent;
  const router = useRouter();

  return (
    <View style={styles.monitorContainer}>
      <ButtonFloatinQRScan onPress={()=>router.push("vendedores/scan")}/>
      <RolSwitchBar userRole={userRole} updateRole={updateRole} />

      <ScrollView
        style={styles.mainContentArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentPadding}>
          <View style={[styles.section]}>
            <Title>Eventos Recientes</Title>
            <CarrouselViewMainCard
              data={
                mockEventData.length ? mockEventData : mockEventDataPlaceholder
              }
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  monitorContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  roleSwitchBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  mainContentArea: {
    flex: 1,
    backgroundColor: WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  contentPadding: {
    paddingTop: 10,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  welcomeTitle: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    paddingHorizontal: 24,
    marginBottom: 10,
  },
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
});
