import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import type { StaticScreenProps } from '@react-navigation/native';
import { useAppNavigation } from '../navigation/useAppNavigation';

import coneMarker from '../images/cone.png';
import { CenteredMessage } from '../components/CenteredMessage';
import { PrimaryButton } from '../components/PrimaryButton';
import type { Point } from '../schemas/point';
import { deletePoint, getPoint } from '../services/api';
import { colors, fonts } from '../theme';
import { describeError } from '../utils/errors';
import { regionAround } from '../utils/map';

type Props = StaticScreenProps<{ id: number }>;

function googleMapsDirectionsUrl({ latitude, longitude }: Point) {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}

export function PointDetails({ route }: Props) {
  const { id } = route.params;
  const navigation = useAppNavigation();
  const [point, setPoint] = useState<Point>();
  const [loadError, setLoadError] = useState<string>();

  useEffect(() => {
    getPoint(id)
      .then(setPoint)
      .catch((error) => setLoadError(describeError(error)));
  }, [id]);

  if (loadError) {
    return <CenteredMessage message={`Não foi possível carregar este ponto.\n${loadError}`} />;
  }

  if (!point) {
    return <CenteredMessage message="Carregando..." />;
  }

  async function handleDelete() {
    try {
      await deletePoint(id);
      navigation.popTo('PointsMap');
    } catch (error) {
      Alert.alert('Erro ao excluir ponto', describeError(error));
    }
  }

  function confirmDelete() {
    Alert.alert('Deletar ponto', 'Tem certeza que deseja deletar este ponto?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', style: 'destructive', onPress: handleDelete },
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      <ScrollView horizontal pagingEnabled style={styles.imagesContainer}>
        {point.images.map((image) => (
          <Image key={image.id} style={styles.image} source={{ uri: image.url }} />
        ))}
      </ScrollView>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{point.name}</Text>
        <Text style={styles.description}>{point.about}</Text>

        <View style={styles.mapContainer}>
          <MapView
            initialRegion={regionAround(point)}
            zoomEnabled={false}
            pitchEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
            style={styles.map}
          >
            <Marker image={coneMarker} coordinate={point} />
          </MapView>

          <TouchableOpacity
            style={styles.routesContainer}
            onPress={() => Linking.openURL(googleMapsDirectionsUrl(point))}
          >
            <Text style={styles.routesText}>Ver rotas no Google Maps</Text>
          </TouchableOpacity>
        </View>

        <PrimaryButton title="Deletar ponto" icon="trash-2" style={styles.deleteButton} onPress={confirmDelete} />
      </View>
    </ScrollView>
  );
}

const IMAGE_HEIGHT = 240;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imagesContainer: {
    height: IMAGE_HEIGHT,
  },
  image: {
    width: Dimensions.get('window').width,
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 24,
  },
  title: {
    color: colors.title,
    fontSize: 30,
    fontFamily: fonts.bold,
  },
  description: {
    fontFamily: fonts.semiBold,
    color: colors.text,
    lineHeight: 24,
    marginTop: 16,
  },
  mapContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: colors.mapBorder,
    marginTop: 40,
    backgroundColor: colors.mapBackground,
  },
  map: {
    width: '100%',
    height: 150,
  },
  routesContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routesText: {
    fontFamily: fonts.bold,
    color: colors.link,
  },
  deleteButton: {
    marginTop: 24,
  },
});
