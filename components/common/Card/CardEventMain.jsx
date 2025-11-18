import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, Text, View } from "react-native";
import StyleCardEventMain from "../../../assets/styles/components/StyleCardEventMain";
import { Colors } from "../../../constants/theme";
import { useDateFormatter } from "../../../lib/dateFormatter";
import Title from "../Titles/Title";
import Title2 from "../Titles/Title2";

export default function CardEventMain({
  id="",
  title = "Sorteo PRO-Fondos COSAI",
  date = "05 de Noviembre del 2025",
  location = "Piura",
  clients = 30,
  collections=[],
  ticketPrice =20,
  status = "Iniciado",
  urlImagen = "https://res.cloudinary.com/dabyqnijl/image/upload/v1763347595/Draw_Date_vbaoqm.png",
  description = "Descripción breve de los acontecimientos de COSAI SA, teniendo en cuenta que debe ser clara y concisa",
}) {
  const { formatDateToSpanish } = useDateFormatter();

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
            <Link
              href={{
                pathname: '/event/[idEvent]',
                params : {idEvent : id}
              }}
            >
              <Title style={styles.title}>{title}</Title>
            </Link>
          </View>
          <View style={{backgroundColor : Colors.principal.yellow[100], borderRadius: 6, paddingHorizontal : 4, paddingVertical : 8}}>
            <Title2>S/{ ticketPrice }</Title2>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-clear-outline"
              size={16}
              color={Colors.principal.red[500]}
            />
            <Text style={styles.infoText}>{formatDateToSpanish(date)}</Text>
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
              <Text style={styles.statNumber}>{collections?.filter((coll)=>coll?.seller !== null).length}</Text>
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

const styles = StyleCardEventMain;