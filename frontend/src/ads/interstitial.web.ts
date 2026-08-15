// AdMob interstitials are native-only; no-ops on web.
export function preloadInterstitial(): void {}

export function showInterstitialIfReady(): boolean {
  return false;
}
