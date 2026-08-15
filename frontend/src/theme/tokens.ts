// Design tokens — Editorial Mobile LIGHT personality.
// Warm cream (light) / soft dark-gray (dark). Lora serif for scripture, DM Sans for UI.

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 999,
} as const;

export const fonts = {
  serif: {
    regular: 'Lora-Regular',
    medium: 'Lora-Medium',
    semibold: 'Lora-SemiBold',
    italic: 'Lora-Italic',
  },
  sans: {
    regular: 'DMSans-Regular',
    medium: 'DMSans-Medium',
    semibold: 'DMSans-SemiBold',
  },
} as const;

export const type = {
  sm: 12,
  base: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const lightColors = {
  surface: '#FDFBF7',
  onSurface: '#2B2A28',
  surfaceSecondary: '#F5F2EB',
  onSurfaceSecondary: '#4A4844',
  surfaceTertiary: '#EBE6DA',
  onSurfaceTertiary: '#5C5A55',
  surfaceInverse: '#2B2A28',
  onSurfaceInverse: '#FDFBF7',
  brand: '#A86349',
  onBrand: '#FDFBF7',
  brandTertiary: '#E8D5CD',
  onBrandTertiary: '#613524',
  success: '#3A6B4E',
  error: '#9E3C3C',
  border: '#EBE6DA',
  borderStrong: '#D6CFC1',
  divider: '#EBE6DA',
  highlightYellow: '#FCE4A1',
  highlightRed: '#F2C9CB',
  highlightGreen: '#C8E0D2',
};

export const darkColors: typeof lightColors = {
  surface: '#1C1B1A',
  onSurface: '#EBE6DA',
  surfaceSecondary: '#262523',
  onSurfaceSecondary: '#C4C0B5',
  surfaceTertiary: '#33312E',
  onSurfaceTertiary: '#A19C91',
  surfaceInverse: '#FDFBF7',
  onSurfaceInverse: '#1C1B1A',
  brand: '#C28A75',
  onBrand: '#1C1B1A',
  brandTertiary: '#4A3127',
  onBrandTertiary: '#E8D5CD',
  success: '#63A67E',
  error: '#D96C6C',
  border: '#33312E',
  borderStrong: '#4A4844',
  divider: '#33312E',
  highlightYellow: '#806B29',
  highlightRed: '#7A3B3F',
  highlightGreen: '#385E48',
};

export type ThemeColors = typeof lightColors;

export const heroImages = {
  light:
    'https://images.unsplash.com/photo-1603484477859-abe6a73f9366?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxjYWxtJTIwbW9ybmluZyUyMGxpZ2h0JTIwYWJzdHJhY3QlMjBwYXBlciUyMHRleHR1cmV8ZW58MHx8fHwxNzg2ODAwMDg2fDA&ixlib=rb-4.1.0&q=85',
  dark:
    'https://images.unsplash.com/photo-1513628253939-010e64ac66cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwxfHxtb29keSUyMGRhcmslMjBuaWdodCUyMHNreSUyMHN1YnRsZSUyMHRleHR1cmV8ZW58MHx8fHwxNzg2ODAwMDg2fDA&ixlib=rb-4.1.0&q=85',
  emptySearch:
    'https://images.unsplash.com/photo-1476275466078-4007374efbbe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwb3BlbiUyMGJvb2slMjB0b3AlMjBkb3dufGVufDB8fHx8MTc4NjgwMDA5NXww&ixlib=rb-4.1.0&q=85',
};
