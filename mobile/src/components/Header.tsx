import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
  showCancel?: boolean;
}

export default function Header({ title, showCancel = true }: HeaderProps) {
  const navigation = useNavigation();

  function handleGoBackToAppHomepage() {
    navigation.navigate('PointsMap');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={navigation.goBack}
      >
        <Feather
          name="arrow-left"
          size={24}
          color="#ffae00"
        />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      {showCancel ? (
        <TouchableOpacity
          onPress={handleGoBackToAppHomepage}
        >
          <Feather
            name="x"
            size={24}
            color="#ff669d"
          />
        </TouchableOpacity>
      ) : (
        <View />
      )

      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9fafc',
    borderBottomWidth: 1,
    borderColor: '#dde3f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontFamily: 'Nunito_600SemiBold',
    color: '#8fa7b3',
    fontSize: 16,
  }
});