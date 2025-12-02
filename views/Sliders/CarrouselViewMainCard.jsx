import { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  View
} from 'react-native';
import CardEventMain from '../../components/common/Card/CardEventMain';
// 🟢 Importamos Colors para usar la paleta central
import { Colors } from '../../constants/theme';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.8;
const CARD_MARGIN = 10; 
const CARD_TOTAL_WIDTH = CARD_WIDTH + (CARD_MARGIN * 2);

export default function CarrouselViewMainCard({
  data = [{
    title: "Sorteo PRO-Fondos COSAI",
    date: "05 de Noviembre del 2025",
    location: "Piura",
    sellers: 10,
    clients: 30,
    price : 20,
    status: "Iniciado",
    urlImagen: "https://res.cloudinary.com/dabyqnijl/image/upload/v1764608015/WhatsApp_Image_2025-11-26_at_16.47.57_gjgygx.jpg",
    description: "Descripción breve de los acontecimientos de COSAI SA, teniendo en cuenta que debe ser clara y concisa",
    onPressEvent: () => console.log("Ver evento presionado")
  }],
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onMomentumScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / CARD_TOTAL_WIDTH);
    setCurrentIndex(index);
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * CARD_TOTAL_WIDTH,
      index * CARD_TOTAL_WIDTH,
      (index + 1) * CARD_TOTAL_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1.0, 0.9],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1.0, 0.6],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ scale }],
            opacity,
            marginHorizontal: CARD_MARGIN, 
          },
        ]}
      >
        <CardEventMain {...item} />
      </Animated.View>
    );
  };

  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {data.map((_, index) => {
          const dotSize = scrollX.interpolate({
            inputRange: [
              (index - 1) * CARD_TOTAL_WIDTH,
              index * CARD_TOTAL_WIDTH,
              (index + 1) * CARD_TOTAL_WIDTH,
            ],
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });

          const dotOpacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * CARD_TOTAL_WIDTH,
              index * CARD_TOTAL_WIDTH,
              (index + 1) * CARD_TOTAL_WIDTH,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: dotSize,
                  opacity: dotOpacity,
                  backgroundColor: currentIndex === index 
                    ? Colors.principal.green[500] 
                    : Colors.principal.neutral[400],
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        ref={flatListRef}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_TOTAL_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
      />
      
      <Pagination />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  flatListContent: {
    paddingVertical: 10,
    paddingHorizontal: (screenWidth - CARD_WIDTH) / 2 - 35,
  },
  cardContainer: {
    width: CARD_WIDTH,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
  },
  dot: {
    borderRadius: 8,
    marginHorizontal: 4,
    transition: 'all 0.3s ease',
  },
});