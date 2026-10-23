import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';

import type { Coordinates } from '../schemas/point';

export function useCurrentLocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;
    let isMounted = true;

    async function watchLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== Location.PermissionStatus.GRANTED) {
        Alert.alert('Habilite a permissão para obter a localização!');
        return;
      }

      const newSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        ({ coords }) => setLocation({ latitude: coords.latitude, longitude: coords.longitude }),
      );

      if (isMounted) {
        subscription = newSubscription;
      } else {
        newSubscription.remove();
      }
    }

    watchLocation();

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, []);

  return location;
}
