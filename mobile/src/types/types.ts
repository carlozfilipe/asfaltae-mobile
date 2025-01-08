export type RootStackParamList = {
  PointData: { position: { latitude: number; longitude: number } };
};

export interface PointItem {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}
