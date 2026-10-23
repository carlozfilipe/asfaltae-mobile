import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme';

export function CenteredMessage({ message }: { message: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    fontFamily: fonts.semiBold,
    color: colors.text,
    textAlign: 'center',
  },
});
