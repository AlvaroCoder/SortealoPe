import { Link } from "expo-router";
import { Image, Text, View } from "react-native";
import StyleCardEventMain from "../../../assets/styles/components/StyleCardEventMain";
import { Colors } from "../../../constants/theme";
import { useDateFormatter } from "../../../lib/dateFormatter";
import Title from "../Titles/Title";
import Title2 from "../Titles/Title2";

const StatusTag = ({ status, theme = 'light' }) => {
  let backgroundColor = Colors.principal.neutral[200];
  let textColor = Colors.principal.neutral[700];

  if (status === 'Iniciado') {
    backgroundColor = Colors[theme].success; 
    textColor = Colors.principal.neutral[50];
  } else if (status === 'Completado') {
     backgroundColor = Colors.principal.neutral[400];
     textColor = Colors.principal.neutral[900];
  }

  return (
    <View style={{ 
      backgroundColor: backgroundColor, 
      borderRadius: 6, 
      paddingHorizontal: 8, 
      paddingVertical: 4, 
    }}>
      <Text style={{ 
        color: textColor, 
        fontWeight: 'bold', 
        fontSize: 12 
      }}>{status}</Text>
    </View>
  );
};

export default function CardEventMain({
  id="",
  title = "Sorteo PRO-Fondos COSAI",
  date = "05 de Noviembre del 2025",
  location = "Piura",
  clients = 30,
  collections=[],
  ticketPrice =20,
  status = "Iniciado",
  urlImagen = "https://res.cloudinary.com/dabyqnijl/image/upload/v1764608015/WhatsApp_Image_2025-11-26_at_16.47.57_gjgygx.jpg",
  description = "Descripción breve de los acontecimientos de COSAI SA, teniendo en cuenta que debe ser clara y concisa",
}) {
  const { formatDateToSpanish } = useDateFormatter();
  // Nota: Deberías obtener el tema (light/dark) de tu contexto de aplicación si lo usas.
  const theme = 'light'; 

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
          
          <View style={{ position: 'absolute', top: -20, left: 8, zIndex: 10 }}>
            <StatusTag status={status} theme={theme} />
          </View>

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
          <View style={{backgroundColor : Colors.principal.yellow[100], borderRadius: 6, paddingHorizontal : 8, paddingVertical : 4}}>
            <Title2>S/{ ticketPrice }</Title2>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleCardEventMain;