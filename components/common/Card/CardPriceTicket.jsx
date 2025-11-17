import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors } from '../../../constants/theme'


export default function CardPriceTicket({
  name = "Plan Básico",
  description = "Descripción del plan básico",
  price = 10,
  isSelected = false,
  onSelect = () => {},
  features = [],
  currency = "S/."
}) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isSelected ? styles.containerSelected : styles.containerNormal
      ]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={[
          styles.name,
        ]}>
          {name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.currency}>{currency}</Text>
          <Text style={[
            styles.price,
            isSelected ? styles.priceSelected : styles.priceNormal
          ]}>
            {price}
          </Text>
        </View>
      </View>

      <Text style={[
        styles.description,
        isSelected ? styles.descriptionSelected : styles.descriptionNormal
      ]}>
        {description}
      </Text>

      {features.length > 0 && (
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={[
                styles.featureDot,
                isSelected ? styles.featureDotSelected : styles.featureDotNormal
              ]} />
              <Text style={[
                styles.featureText,
              ]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  containerNormal: {
    borderColor: Colors.principal.red[100],
    backgroundColor: '#FFFFFF',
  },
  containerSelected: {
    borderColor: Colors.principal.red[900],
    backgroundColor: Colors.principal.yellow[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  nameNormal: {
    color: Colors.principal.red[900],
  },
  nameSelected: {
    color: Colors.principal.red[900],
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.principal.red[900],
    marginRight: 2,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  priceNormal: {
    color: Colors.principal.red[900],
  },
  priceSelected: {
    color: Colors.principal.red[900],
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  descriptionNormal: {
    color: Colors.principal.red[900],
  },
  descriptionSelected: {
    color: Colors.principal.red[900],
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  featureDotNormal: {
    backgroundColor: Colors.principal.red[300],
  },
  featureDotSelected: {
    backgroundColor: Colors.principal.red[900],
  },
  featureText: {
    fontSize: 13,
    flex: 1,
  },
  featureTextNormal: {
    color: Colors.principal.red[900],
  },
  featureTextSelected: {
    color: Colors.principal.red[900],
  },
  selectionIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionIndicatorNormal: {
    borderColor: Colors.principal.red[100],
    backgroundColor: '#FFFFFF',
  },
  selectionIndicatorSelected: {
    borderColor: Colors.principal.red[900],
    backgroundColor: Colors.principal.red[900],
  },
  selectionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
})