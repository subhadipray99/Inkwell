// AdMob is native-only; no-op on web so the web bundle never imports the
// native ads package.
export function initializeAds(): Promise<void> {
  return Promise.resolve();
}
