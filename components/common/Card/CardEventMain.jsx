import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../constants/theme";
import Title from "../Titles/Title";
import Title2 from "../Titles/Title2";

export default function CardEventMain({
  title = "Sorteo PRO-Fondos COSAI",
  date = "05 de Noviembre del 2025",
  location = "Piura",
  sellers = 10,
  clients = 30,
  price =20,
  status = "Iniciado",
  urlImagen = "https://res.cloudinary.com/dabyqnijl/image/upload/v1763347595/Draw_Date_vbaoqm.png",
  description = "Descripción breve de los acontecimientos de COSAI SA, teniendo en cuenta que debe ser clara y concisa",
  onPressEvent = () => console.log("Ver evento presionado")
}) {
  return (
    <View style={styles.mainContent}>
      <View>
        <Image
          style={styles.image}
          source={{uri : urlImagen}}
        />
      </View>
      <View style={styles.headerContent}>
        <View style={{flexDirection : 'row',gap : 4, alignItems : 'center', width: " 100%"}}>
          <View style={{flex : 1}}>
            <Title style={styles.title}>{title}</Title>
          </View>
          <View style={{backgroundColor : Colors.principal.yellow[100], borderRadius: 6, paddingHorizontal : 4, paddingVertical : 8}}>
            <Title2>S/{ price }</Title2>
          </View>
        </View>
        <View style={[styles.statusBadge]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-clear-outline"
              size={16}
              color={Colors.principal.red[500]}
            />
            <Text style={styles.infoText}>{date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name="location"
              size={16}
              color={Colors.principal.red[500]}
            />
            <Text style={styles.infoText}>{location}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="person-add" size={18} color={Colors.principal.red[500]} />
            </View>
            <View>
              <Text style={styles.statNumber}>{sellers}</Text>
              <Text style={styles.statLabel}>Vendedores</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="person" size={18} color={Colors.principal.red[500]} />
            </View>
            <View>
              <Text style={styles.statNumber}>{clients}</Text>
              <Text style={styles.statLabel}>Clientes</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bodyContent}>
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Descripción</Text>
          <Text style={styles.descriptionText} numberOfLines={3}>
            {description}
          </Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    flexGrow : 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.black, 
  },
  infoContainer: {
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.dark, 
  },
  statsContainer: {
    flexDirection: "row",
    gap: 24,
    marginTop: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statIconContainer: {
    backgroundColor: Colors.principal.red[50] || "#FEE2E2", // Fallback si no existe
    padding: 6,
    borderRadius: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.principal.red[500],
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light, 
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.principal.yellow[100] || "#FEF3C7", 
  },
  statusStarted: {
    backgroundColor: Colors.success || "#DCFCE7", 
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.principal.red[700], 
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light || "#E5E5E5", 
    marginVertical: 16,
  },
  bodyContent: {
    gap: 16,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 8,
  },
  descriptionContainer: {
    gap: 8,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.dark, 
    lineHeight: 20,
  },
  viewEventButton: {
    backgroundColor: Colors.principal.red[500],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  viewEventText: {
    color: Colors.principal.neutral[200],
    fontSize: 16,
    fontWeight: "600",
  },
});