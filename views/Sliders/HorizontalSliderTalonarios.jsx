import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import CardTalonario from "../../components/common/Card/CardTalonario";
import { Colors } from '../../constants/theme';

const { width: screenWidth } = Dimensions.get('window')
const CARD_WIDTH = screenWidth * 0.95
const CARD_MARGIN = 12
const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_MARGIN * 2

export default function HorizontalSliderTalonarios({
  talonarios = [],
  title = "Talonarios Disponibles",
  onTalonarioPress = () => {},
  emptyMessage = "No hay talonarios disponibles"
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollX = useRef(new Animated.Value(0)).current
  const flatListRef = useRef(null)

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  )

  const onMomentumScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const index = Math.round(contentOffsetX / CARD_TOTAL_WIDTH)
    setCurrentIndex(index)
  }

  const scrollToIndex = (index) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5
      })
    }
  }

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * CARD_TOTAL_WIDTH,
      index * CARD_TOTAL_WIDTH,
      (index + 1) * CARD_TOTAL_WIDTH,
    ]

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.92, 1.0, 0.92],
      extrapolate: 'clamp',
    })

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1.0, 0.7],
      extrapolate: 'clamp',
    })

    return (
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <CardTalonario
          id={item.id}
          seller={item.seller}
          ticketsQuantity={item.ticketsQuantity}
          serialNumber={item.serialNumber}
          status={item.status}
          onPress={() => onTalonarioPress(item)}
        />
      </Animated.View>
    )
  }

  const Pagination = () => {
    if (talonarios.length <= 1) return null

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === 0 && styles.navButtonDisabled
          ]}
          onPress={() => scrollToIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={currentIndex === 0 ? Colors.principal.red[900] : Colors.principal.red[500]}
          />
        </TouchableOpacity>

        <View style={styles.dotsContainer}>
          {talonarios.map((_, index) => {
            const isActive = index === currentIndex
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dot,
                  isActive ? styles.dotActive : styles.dotInactive
                ]}
                onPress={() => scrollToIndex(index)}
              />
            )
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === talonarios.length - 1 && styles.navButtonDisabled
          ]}
          onPress={() => scrollToIndex(Math.min(talonarios.length - 1, currentIndex + 1))}
          disabled={currentIndex === talonarios.length - 1}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentIndex === talonarios.length - 1 ? Colors.principal.red[900] : Colors.principal.red[500]}
          />
        </TouchableOpacity>
      </View>
    )
  }

  if (talonarios.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="document-text-outline"
          size={48}
          color={Colors.principal.red[200]}
        />
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>

      <FlatList
        ref={flatListRef}
        data={talonarios}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_TOTAL_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        pagingEnabled={false}
      />

      <Pagination />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
        marginTop: 10,
      marginBottom : 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.principal.red[900],
  },
  counter: {
    fontSize: 14,
    color: Colors.principal.red[400],
    fontWeight: '600',
  },
  flatListContent: {
    paddingHorizontal: (screenWidth - CARD_WIDTH) / 2 - CARD_MARGIN,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.principal.red[100],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonDisabled: {
    backgroundColor: Colors.principal.yellow[50],
      shadowOpacity: 0,
    
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.principal.red[500],
  },
  dotInactive: {
    backgroundColor: Colors.principal.red[200],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: Colors.principal.yellow[50],
    borderRadius: 16,
    marginHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.principal.red[500],
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
})