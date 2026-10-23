import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAppNavigation } from '../navigation/useAppNavigation';

import coneMarker from '../images/cone.png';
import pinMarker from '../images/pin.png';
import { CenteredMessage } from '../components/CenteredMessage';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import type { Point } from '../schemas/point';
import { listPoints } from '../services/api';
import { colors, fonts } from '../theme';
import { describeError } from '../utils/errors';
import { regionAround } from '../utils/map';

function pointsCountLabel(count: number) {
  return count === 1 ? '1 ponto encontrado' : `${count} pontos encontrados`;
}

export function PointsMap() {
  const navigation = useAppNavigation();
  const currentLocation = useCurrentLocation();
  const [points, setPoints] = useState<Point[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      listPoints()
        .then((data) => isActive && setPoints(data))
        .catch((error) => Alert.alert('Não foi possível carregar os pontos', describeError(error)));

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      {currentLocation ? (
        <MapView style={styles.map} initialRegion={regionAround(currentLocation)}>
          {points.map((point) => (
            <Marker
              key={point.id}
              image={coneMarker}
              coordinate={point}
              onPress={() => navigation.navigate('PointDetails', { id: point.id })}
            />
          ))}

          <Marker image={pinMarker} coordinate={currentLocation} />
        </MapView>
      ) : (
        <CenteredMessage message="Obtendo sua localização..." />
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>{pointsCountLabel(points.length)}</Text>

        <TouchableOpacity
          style={styles.createPointButton}
          onPress={() => navigation.navigate('SelectMapPosition')}
          accessibilityLabel="Cadastrar ponto"
        >
          <Feather name="plus" size={28} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    backgroundColor: colors.white,
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 10,
  },
  footerText: {
    fontFamily: fonts.bold,
    color: colors.muted,
  },
  createPointButton: {
    width: 56,
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
