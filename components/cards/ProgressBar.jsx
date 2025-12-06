import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';

const NEUTRAL_200 = Colors.principal.neutral[200];
const RED_500 = Colors.principal.red[500];
const BLUE_500 = Colors.principal.blue[700];

export default function ProgressBar({
    available,
    total
}) {
    const sold = total - available;
    const percentage = (sold / total) * 100;

  return (
    <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, {width : `${percentage}%`}]} />
        </View>
        <Text style={styles.progressText}>
            {sold} vendidos de {total} ({percentage.toFixed(0)}%)
        </Text>  
    </View>
  )
};

const styles = StyleSheet.create({
    progressBarContainer: {
        marginBottom: 15,
    },
    progressBarBackground: {
        height: 10,
        borderRadius: 5,
        backgroundColor: NEUTRAL_200,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: RED_500, 
        borderRadius: 5,
    },
    progressText: {
        fontSize: Typography.sizes.sm,
        color: BLUE_500,
        marginTop: 5,
        textAlign: 'right',
    },
})