import { createStaticNavigation, type StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Header } from '../components/Header';
import { PointData } from '../screens/CreatePoint/PointData';
import { SelectMapPosition } from '../screens/CreatePoint/SelectMapPosition';
import { PointDetails } from '../screens/PointDetails';
import { PointsMap } from '../screens/PointsMap';
import { colors } from '../theme';

const RootStack = createNativeStackNavigator({
  screenOptions: {
    contentStyle: { backgroundColor: colors.background },
  },
  screens: {
    PointsMap: {
      screen: PointsMap,
      options: { headerShown: false },
    },
    PointDetails: {
      screen: PointDetails,
      options: { header: () => <Header title="Ponto cadastrado" showCancel={false} /> },
    },
    SelectMapPosition: {
      screen: SelectMapPosition,
      options: { header: () => <Header title="Selecione no mapa" /> },
    },
    PointData: {
      screen: PointData,
      options: { header: () => <Header title="Informe os dados" /> },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

export type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
