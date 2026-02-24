import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EventListItem from "../components/common/Card/EventListItem";

export default function ScreenHistoryTickets({
  dataEspera = [],
  dataCreada = [],
  dataGanada = [],
}) {
  const [currentPosition, setCurrentPosition] = useState("Espera");

  const eventStatus = [
    { id: 1, name: "Espera" },
    { id: 2, name: "Creada" },
    { id: 3, name: "Sorteados" },
  ];

  const getCurrentData = () => {
    switch (currentPosition) {
      case "Espera":
        return dataEspera;
      case "Creada":
        return dataCreada;
      case "Sorteados":
        return dataGanada;
      default:
        return [];
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsWrapper}>
        <FlatList
          data={eventStatus}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
          renderItem={({ item }) => {
            const isActive = item.name === currentPosition;

            return (
              <TouchableOpacity
                style={[styles.tabButton, isActive && styles.activeTab]}
                onPress={() => setCurrentPosition(item.name)}
              >
                <Text
                  style={[styles.tabText, isActive && styles.activeTabText]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <FlatList
        data={getCurrentData()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <EventListItem event={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay eventos en este estado</Text>
        }
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  tabsWrapper: {
    paddingTop: 10,
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  tabContainer: {
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    marginRight: 10,
  },

  activeTab: {
    backgroundColor: "#0f3d2e",
  },

  tabText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },

  activeTabText: {
    color: "#fff",
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },

  card: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginBottom: 12,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#9CA3AF",
  },
});
