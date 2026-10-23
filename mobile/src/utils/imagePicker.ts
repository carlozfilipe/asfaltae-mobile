import * as ImagePicker from 'expo-image-picker';

export type ImageSource = 'camera' | 'library';

const pickerOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  quality: 0.8,
};

async function requestPermission(source: ImageSource) {
  const { granted } =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  return granted;
}

/**
 * Opens the camera or the gallery and returns the chosen image URI,
 * or `null` when the user cancels. Throws when permission is denied.
 */
export async function pickImage(source: ImageSource): Promise<string | null> {
  if (!(await requestPermission(source))) {
    throw new Error(
      source === 'camera' ? 'Precisamos de acesso à sua câmera.' : 'Precisamos de acesso às suas fotos.',
    );
  }

  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync(pickerOptions)
      : await ImagePicker.launchImageLibraryAsync(pickerOptions);

  return result.canceled ? null : result.assets[0].uri;
}
