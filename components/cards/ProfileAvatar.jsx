import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';

const NEUTRAL_700 = Colors.principal.neutral[700];
const GREEN_500 = Colors.principal.green[500];

export default function ProfileAvatar({user}) {
  return (
    <View style={styles.profileAvatarContainer}>
          <Image
              source={{ uri: user?.avatarUrl }}
              style={styles.profileAvatarImage}
          />
          <Text style={styles.profileAvatarName} numberOfLines={1}>{user?.name}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
    profileAvatarContainer: {
        alignItems: 'center',
        marginRight: 15,
        width: 70, 
    },
    profileAvatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: GREEN_500,
        borderWidth: 2,
    },
    profileAvatarName: {
        fontSize: Typography.sizes.sm,
        color: NEUTRAL_700,
        marginTop: 5,
        textAlign: 'center',
    },
})