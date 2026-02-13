import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function ProfileHeader({ navigation, title, backgroundColor, headerTintColor }) {
  return (
       <View style={[styles.customHeader, { backgroundColor: backgroundColor }]}>
        <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
        >
            <Ionicons
                name="arrow-back-outline"
                size={24}
                color={headerTintColor}
            />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: headerTintColor }]}>
            {title}
        </Text>
    </View>
  )
};

const styles = StyleSheet.create({
    customHeader: {
        height: 80, 
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingBottom: 10,
        paddingHorizontal: 15,
        elevation: 0,
        shadowOpacity: 0,
    },
    backButton: {
        paddingRight: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    }
})