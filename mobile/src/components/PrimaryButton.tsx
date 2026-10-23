import type { ComponentProps } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, fonts } from '../theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: ComponentProps<typeof Feather>['name'];
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({ title, onPress, icon, loading = false, style }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.disabled, style]}
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <>
          {icon && <Feather name={icon} size={20} color={colors.white} />}
          <Text style={styles.text}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.white,
  },
});
