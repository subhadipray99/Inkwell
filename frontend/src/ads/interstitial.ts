// Interstitial ad controller (native). Preloads a single instance and shows
// it only at natural transitions. No-op in Expo Go.
/* eslint-disable @typescript-eslint/no-require-imports */
import Constants, { ExecutionEnvironment } from 'expo-constants';
import type { InterstitialAd } from 'react-native-google-mobile-ads';

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const PROD_INTERSTITIAL = 'ca-app-pub-1245254576744368/4049944656';

let ad: InterstitialAd | null = null;
let loaded = false;

function ensure(): InterstitialAd | null {
  if (isExpoGo) return null;
  if (ad) return ad;
  const { AdEventType, InterstitialAd: Ad, TestIds } = require('react-native-google-mobile-ads');
  const unitId = __DEV__ ? TestIds.INTERSTITIAL : PROD_INTERSTITIAL;
  ad = Ad.createForAdRequest(unitId, { requestNonPersonalizedAdsOnly: true });
  ad!.addAdEventListener(AdEventType.LOADED, () => {
    loaded = true;
  });
  ad!.addAdEventListener(AdEventType.CLOSED, () => {
    loaded = false;
    try {
      ad!.load();
    } catch {}
  });
  ad!.addAdEventListener(AdEventType.ERROR, () => {
    loaded = false;
  });
  return ad;
}

export function preloadInterstitial(): void {
  const a = ensure();
  if (a && !loaded) {
    try {
      a.load();
    } catch {}
  }
}

export function showInterstitialIfReady(): boolean {
  const a = ensure();
  if (a && loaded) {
    try {
      a.show();
    } catch {}
    return true;
  }
  return false;
}
