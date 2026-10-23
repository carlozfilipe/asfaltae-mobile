import type { Region } from 'react-native-maps';

import type { Coordinates } from '../schemas/point';

export function regionAround({ latitude, longitude }: Coordinates, delta = 0.008): Region {
  return { latitude, longitude, latitudeDelta: delta, longitudeDelta: delta };
}
