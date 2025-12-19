import { Ionicons } from '@expo/vector-icons';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import ButtonGradiend from '../common/Buttons/ButtonGradiendt';
import Title from '../common/Titles/Title';

const GREEN_900 = Colors.principal.green[900];
const GREEN_500 = Colors.principal.green[100];
const RED_500 = Colors.principal.red[500];
const WHITE = Colors.principal.white;
const NEUTRAL_700 = Colors.principal.neutral[700];
const NEUTRAL_200 = Colors.principal.neutral[200];

const CATEGORIES = [
    { id: 'benefica', name: 'Rifa Benefica', icon: 'heart-outline', eventCategoryId : 1 },
    { id: 'institucional', name: 'Rifa Institucional', icon: 'business-outline', eventCategoryId : 2 },
    { id: 'empresarial', name: 'Rifa Empresarial', icon: 'briefcase-outline', eventCategoryId : 3 },
    { id: 'personal', name: 'Rifa Personal', icon: 'happy-outline', eventCategoryId : 4 },
    { id: 'comunitaria', name: 'Rifa Comunitaria', icon: 'people-outline', eventCategoryId : 5 },
    { id: 'conmemorativa', name: 'Rifa Conmemorativa', icon: 'calendar-outline', eventCategoryId : 6 },
    { id: 'otros', name: 'Otros', icon: 'ellipsis-horizontal-circle-outline', eventCategoryId : 7 },
];

const CategoryCard = ({ category, isSelected, onPress }) => (
    <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => onPress(category.eventCategoryId)}
    >
        <Ionicons 
            name={category.icon} 
            size={30} 
            color={isSelected ? WHITE : GREEN_900} 
        />
        <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
            {category.name}
        </Text>
    </TouchableOpacity>
);


export default function Step3CategoryContent({ form, setForm, onNext, onBack }) {

    const handleSelectCategory = (eventCategoryId) => {
        setForm(prev => ({ ...prev, eventCategoryId }));
    };

    const handleNext = () => {
        if (!form.eventCategoryId) {
            Alert.alert("Error de Validación", "Por favor, selecciona una categoría para el evento.");
            return;
        }

        onNext({});
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.stepContent}>
                <Title >3. Selecciona la Categoría</Title>
                <Text style={styles.stepSubtitleText}>
                    Clasifica tu evento para que los compradores lo encuentren fácilmente en el catálogo.
                </Text>

                <View style={styles.categoriesGrid}>
                    {CATEGORIES.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            isSelected={form.eventCategoryId === category.eventCategoryId}
                            onPress={handleSelectCategory}
                        />
                    ))}
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back-outline" style={{color : GREEN_900}} size={24} />
                    </TouchableOpacity>
                    <ButtonGradiend onPress={handleNext} style={styles.nextButton}>
                        Continuar
                    </ButtonGradiend>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    stepContent: {
        width: "100%",
    },
    stepTitleText: {
        fontSize: Typography.sizes['2xl'],
        fontWeight: Typography.weights.extrabold,
        color: GREEN_900,
        marginBottom: 8,
    },
    stepSubtitleText: {
        fontSize: Typography.sizes.base,
        color: NEUTRAL_700,
        marginBottom: 20,
    },
    
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    card: {
        width: '48%', 
        backgroundColor: WHITE,
        borderRadius: 12,
        padding: 20,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: NEUTRAL_200,
    },
    cardSelected: {
        backgroundColor: GREEN_500,
        borderColor: GREEN_900,
        borderWidth: 2,
    },
    cardTitle: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.bold,
        marginTop: 8,
        textAlign: 'center',
    },
    cardTitleSelected: {
        color: WHITE,
    },

    selectionSummary: {
        padding: 15,
        borderRadius: 12,
        backgroundColor: Colors.principal.green[50],
        borderWidth: 1,
        borderColor: GREEN_500,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryText: {
        fontSize: Typography.sizes.md,
        color: GREEN_900,
    },
    summaryValue: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        color: RED_500,
    },
    
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom:  40,
        gap : 8
    },
    nextButton: {
        flex: 1,
    },
    backButton: {
      borderColor: GREEN_900,
      borderRadius: "100%", 
      width : 50,
      borderWidth: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems : 'center'
    },
});