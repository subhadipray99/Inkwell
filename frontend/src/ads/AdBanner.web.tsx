import type { StyleProp, ViewStyle } from 'react-native';

// AdMob native banners are intentionally not rendered on React Native Web.
export function AdBanner(_props: { style?: StyleProp<ViewStyle> }) {
  return null;
}
