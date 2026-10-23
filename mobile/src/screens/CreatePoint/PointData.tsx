import { useState, type ComponentProps } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { StaticScreenProps } from '@react-navigation/native';
import { useAppNavigation } from '../../navigation/useAppNavigation';

import { PrimaryButton } from '../../components/PrimaryButton';
import { createPointSchema, type Coordinates } from '../../schemas/point';
import { createPoint } from '../../services/api';
import { colors, fonts } from '../../theme';
import { describeError } from '../../utils/errors';
import { pickImage, type ImageSource } from '../../utils/imagePicker';

type Props = StaticScreenProps<{ position: Coordinates }>;

const ABOUT_MAX_LENGTH = 300;

export function PointData({ route }: Props) {
  const navigation = useAppNavigation();
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAddImage(source: ImageSource) {
    try {
      const uri = await pickImage(source);
      if (uri) setImages((current) => [...current, uri]);
    } catch (error) {
      Alert.alert(error instanceof Error ? error.message : 'Não foi possível abrir a imagem.');
    }
  }

  async function handleCreatePoint() {
    const result = createPointSchema.safeParse({ ...route.params.position, name, about, images });

    if (!result.success) {
      Alert.alert('Dados inválidos', result.error.issues.map((issue) => issue.message).join('\n'));
      return;
    }

    setIsSubmitting(true);
    try {
      await createPoint(result.data);
      Alert.alert('Ponto cadastrado com sucesso!');
      navigation.popTo('PointsMap');
    } catch (error) {
      console.error('Erro ao cadastrar ponto:', error);
      Alert.alert('Erro ao cadastrar ponto', describeError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Dados</Text>

      <View style={styles.uploadedImagesContainer}>
        {images.map((uri) => (
          <Image key={uri} source={{ uri }} style={styles.uploadedImage} />
        ))}
      </View>

      <Text style={styles.label}>Abrir sua câmera</Text>
      <ImageInput icon="camera" onPress={() => handleAddImage('camera')} />

      <Text style={styles.label}>Carregar fotos da sua galeria</Text>
      <ImageInput icon="upload" onPress={() => handleAddImage('library')} />

      <Text style={styles.label}>Nome do ponto</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>
        Detalhes do ponto ({about.length}/{ABOUT_MAX_LENGTH})
      </Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        maxLength={ABOUT_MAX_LENGTH}
        value={about}
        onChangeText={setAbout}
      />

      <PrimaryButton
        title="Cadastrar"
        style={styles.submitButton}
        loading={isSubmitting}
        onPress={handleCreatePoint}
      />
    </ScrollView>
  );
}

interface ImageInputProps {
  icon: ComponentProps<typeof Feather>['name'];
  onPress: () => void;
}

function ImageInput({ icon, onPress }: ImageInputProps) {
  return (
    <TouchableOpacity style={styles.imageInput} onPress={onPress}>
      <Feather name={icon} size={24} color={colors.placeholder} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontFamily: fonts.bold,
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.border,
  },
  label: {
    color: colors.muted,
    fontFamily: fonts.semiBold,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1.4,
    borderColor: colors.border,
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 24,
    textAlignVertical: 'top',
  },
  textArea: {
    height: 110,
  },
  uploadedImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  uploadedImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginBottom: 32,
  },
  imageInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 32,
  },
});
