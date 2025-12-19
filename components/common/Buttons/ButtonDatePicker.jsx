import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, Typography } from '../../../constants/theme';

const GREEN_900 = Colors.principal.green[900];
const RED_600 = Colors.principal.red[600];
const WHITE = Colors.principal.white;
const NEUTRAL_200 = Colors.principal.neutral[200];

export default function DatePickerInput({ 
    label, 
    value, 
    onChange, 
    required = false,
    placeholder = "Seleccionar fecha"
}) {
    const [show, setShow] = useState(false);

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleDateChange = (event, selectedDate) => {
        setShow(Platform.OS === 'ios'); 
        
        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    return (
        <View style={styles.container}>
            {label && (
                <Text style={styles.inputLabel}>
                    {label} {required && <Text style={{ color: RED_600 }}>(*)</Text>}
                </Text>
            )}

            <TouchableOpacity 
                style={styles.inputWrapper} 
                onPress={() => setShow(true)}
                activeOpacity={0.7}
            >
                <Text style={[
                    styles.dateText, 
                    !value && { color: NEUTRAL_200 }
                ]}>
                    {value ? formatDate(value) : placeholder}
                </Text>
                
                <Ionicons 
                    name="calendar-outline" 
                    size={22} 
                    color={GREEN_900} 
                    style={styles.icon}
                />
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()} 
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
        width: '100%',
    },
    inputLabel: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.medium,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: NEUTRAL_200,
        borderRadius: 12,
        padding: 15,
        backgroundColor: WHITE,
        minHeight: 55,
    },
    dateText: {
        fontSize: Typography.sizes.lg,
    },
    icon: {
        marginLeft: 10,
    },
});