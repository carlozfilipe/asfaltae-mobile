import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Dialog from 'react-native-dialog';

import mapMarkerImg from '../images/cone.png';
import api from '../services/api';

interface PointDetailsRouteParams {
  id: number;
}

interface Point {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  images: Array<{
    id: number;
    url: string;
  }>;
}

export default function PointDetails() {
  const route = useRoute();
  const [point, setPoint] = useState<Point>();
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const params = route.params as PointDetailsRouteParams;

  useEffect(() => {
    api.get(`points/${params.id}`).then((response) => {
      setPoint(response.data);
    });
  }, [params.id]);

  if (!point) {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>Carregando...</Text>
      </View>
    );
  }

  function handleOpenGoogleMapRoutes() {
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${point?.latitude},${point?.longitude}`
    );
  }

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  async function handleDeletePoint() {
    try {
      await api.delete(`points/${params.id}`);
      navigation.navigate('PointsMap');
    } catch (error) {
      console.error('Erro ao excluir ponto:', error);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imagesContainer}>
        <ScrollView horizontal pagingEnabled>
          {point.images.map((image) => {
            return (
              <Image
                key={image.id}
                style={styles.image}
                source={{ uri: image.url }}
              />
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{point.name}</Text>

        <Text style={styles.description}>{point.about}</Text>

        <View style={styles.mapContainer}>
          <MapView
            initialRegion={{
              latitude: point.latitude,
              longitude: point.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
            zoomEnabled={false}
            pitchEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
            style={styles.mapStyle}
          >
            <Marker
              icon={mapMarkerImg}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
            />
          </MapView>

          <TouchableOpacity
            style={styles.routesContainer}
            onPress={handleOpenGoogleMapRoutes}
          >
            <Text style={styles.routesText}>Ver rotas no Google Maps</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.deletePoint} onPress={showDialog}>
          <Feather name="trash-2" size={24} color="#f9f9f9" />
          <Text style={styles.deletePointText}>Deletar ponto</Text>
        </TouchableOpacity>

        <View style={styles.dialog}>
          <Dialog.Container visible={visible}>
            <Dialog.Title>Deletar ponto</Dialog.Title>
            <Dialog.Description>
              Tem certeza que deseja deletar este ponto?
            </Dialog.Description>
            <Dialog.Button label="Não" onPress={handleCancel} />
            <Dialog.Button label="Sim" onPress={handleDeletePoint} />
          </Dialog.Container>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  dialog: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imagesContainer: {
    height: 240,
  },

  image: {
    width: Dimensions.get('window').width,
    height: 240,
    resizeMode: 'cover',
  },

  detailsContainer: {
    padding: 24,
  },

  title: {
    color: '#4D6F80',
    fontSize: 30,
    fontFamily: 'Nunito_700Bold',
  },

  description: {
    fontFamily: 'Nunito_600SemiBold',
    color: '#5c8599',
    lineHeight: 24,
    marginTop: 16,
  },

  mapContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: '#B3DAE2',
    marginTop: 40,
    backgroundColor: '#E6F7FB',
  },

  mapStyle: {
    width: '100%',
    height: 150,
  },

  routesContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  routesText: {
    fontFamily: 'Nunito_700Bold',
    color: '#0089a5',
  },

  deletePoint: {
    flexDirection: 'row',
    backgroundColor: '#ffae00',
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    opacity: 0.8,
  },

  deletePointText: {
    color: '#f9f9f9',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});
