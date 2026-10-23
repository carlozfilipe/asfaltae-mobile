import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppNavigation } from '../navigation/useAppNavigation';

import { colors, fonts } from '../theme';

interface HeaderProps {
  title: string;
  showCancel?: boolean;
}

export function Header({ title, showCancel = true }: HeaderProps) {
  const navigation = useAppNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigation.goBack} accessibilityLabel="Voltar">
        <Feather name="arrow-left" size={24} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      {showCancel ? (
        <TouchableOpacity onPress={() => navigation.popTo('PointsMap')} accessibilityLabel="Cancelar">
          <Feather name="x" size={24} color={colors.danger} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 54 : 24,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.headerBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.semiBold,
    color: colors.muted,
    fontSize: 16,
  },
  placeholder: {
    width: 24,
  },
});
