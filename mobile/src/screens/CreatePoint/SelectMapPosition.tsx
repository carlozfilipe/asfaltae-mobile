import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, type MapPressEvent } from 'react-native-maps';
import { useAppNavigation } from '../../navigation/useAppNavigation';

import pinMarker from '../../images/pin.png';
import { CenteredMessage } from '../../components/CenteredMessage';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import type { Coordinates } from '../../schemas/point';
import { regionAround } from '../../utils/map';

export function SelectMapPosition() {
  const navigation = useAppNavigation();
  const currentLocation = useCurrentLocation();
  const [selectedPosition, setSelectedPosition] = useState<Coordinates | null>(null);

  if (!currentLocation) {
    return <CenteredMessage message="Obtendo sua localização..." />;
  }

  const position = selectedPosition ?? currentLocation;

  function handleMapPress({ nativeEvent }: MapPressEvent) {
    setSelectedPosition(nativeEvent.coordinate);
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={regionAround(currentLocation)} onPress={handleMapPress}>
        <Marker image={pinMarker} coordinate={position} />
      </MapView>

      <PrimaryButton
        title="Próximo"
        style={styles.nextButton}
        onPress={() => navigation.navigate('PointData', { position })}
      />
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
  nextButton: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40,
  },
});
