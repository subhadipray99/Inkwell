/* eslint-disable @typescript-eslint/no-require-imports */
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Production banner unit ID (used only in release builds). During development
// Google's TestIds are used automatically.
const PROD_BANNER = 'ca-app-pub-1245254576744368/5586387605';

export function AdBanner({ style }: { style?: StyleProp<ViewStyle> }) {
  // AdMob native views can't render in Expo Go — skip so the app still works.
  if (isExpoGo) return null;

  const { BannerAd, BannerAdSize, TestIds } = require('react-native-google-mobile-ads');
  const unitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : PROD_BANNER;

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={(e: unknown) => console.warn('Banner failed', e)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%' },
});
