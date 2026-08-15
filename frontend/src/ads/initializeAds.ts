// AdMob initialization (native). No-op in Expo Go (native module unavailable
// there) and on web. Real ads require a development/production build.
/* eslint-disable @typescript-eslint/no-require-imports */
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let initialization: Promise<unknown> | undefined;

export function initializeAds(): Promise<unknown> {
  if (isExpoGo) return Promise.resolve();
  if (initialization) return initialization;

  initialization = (async () => {
    // iOS App Tracking Transparency — request before initializing ads.
    if (Platform.OS === 'ios') {
      const tt = require('expo-tracking-transparency');
      const current = await tt.getTrackingPermissionsAsync();
      if (current.status === 'undetermined') {
        await tt.requestTrackingPermissionsAsync();
      }
    }
    const mobileAds = require('react-native-google-mobile-ads').default;
    return mobileAds().initialize();
  })();

  return initialization;
}
