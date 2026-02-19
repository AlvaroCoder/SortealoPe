import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ButtonCreateEvent from "../components/common/Buttons/ButtonCreateEvent";
import EventListItem from "../components/common/Card/EventListItem";
import Title from "../components/common/Titles/Title";
import { ENDPOINTS_EVENTS } from "../Connections/APIURLS";
import { Colors, Typography } from "../constants/theme";
import { useAuthContext } from "../context/AuthContext";
import { useRaffleContext } from "../context/RaffleContext";
import { useFetch } from "../lib/useFetch";
import RolSwitchBar from "../views/Bars/RolSwitchBar";
import LoadingScreen from "./LoadingScreen";
const GREEN_900 = Colors.principal.green[900];
const NEUTRAL_200 = Colors.principal.neutral[200];
const NEUTRAL_700 = Colors.principal.neutral[700];
const WHITE = "#FFFFFF";
const GREEN_100 = Colors.principal.green[100];

const URL_GET_EVENTS = ENDPOINTS_EVENTS.GET_EVENTS_BY_ID;

export default function MonitorAdminDashboard() {
  const { userRole, updateRole } = useRaffleContext();
  const { userData, loading: loadingAuth } = useAuthContext();
  const shouldFetch = userData?.userId && !loadingAuth;

  const { loading, data } = useFetch(
    shouldFetch ? `${URL_GET_EVENTS}${userData.userId}` : null,
  );

  console.log(data);

  return (
    <View style={styles.monitorContainer}>
      {(loading || loadingAuth) && <LoadingScreen />}
      <RolSwitchBar userRole={userRole} updateRole={updateRole} />
      <View style={styles.headerContent}>
        <Title styleTitle={{}}>
          Eventos Creados Recientes ({data?.length})
        </Title>
        <Text>Eventos creados este mes</Text>
      </View>
      <FlatList
        data={data || []}
        renderItem={({ item }) => <EventListItem event={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={50}
              color={NEUTRAL_700}
            />
            <Text style={styles.emptyText}>No hay eventos registrados.</Text>
          </View>
        )}
      />

      <ButtonCreateEvent />
    </View>
  );
}

const styles = StyleSheet.create({
  monitorContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_200,
  },
  sectionTitle: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.extrabold,
    color: GREEN_900,
    marginBottom: 15,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: GREEN_900,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: GREEN_900,
    marginLeft: 10,
  },

  listContent: {
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 50,
    backgroundColor: GREEN_100,
    borderRadius: 12,
    marginTop: 20,
  },
  emptyText: {
    fontSize: Typography.sizes.lg,
    color: NEUTRAL_700,
    marginTop: 10,
  },
});

/**
 *             <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={NEUTRAL_700} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar evento por título..."
                    placeholderTextColor={NEUTRAL_700}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>
 */
