import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/src/context/AppContext';
import { ARTICLES } from '@/src/data/learn';
import {
  fonts,
  radius,
  spacing,
  ThemeColors,
  type as typeScale,
} from '@/src/theme/tokens';

export default function Learn() {
  const { colors } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <ScrollView
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingBottom: insets.bottom + spacing.xxl,
      }}
      showsVerticalScrollIndicator={false}
      testID="learn-scroll"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Learn</Text>
        <Text style={styles.subtitle}>Study the Bible with confidence</Text>
      </View>

      {/* Feature cards */}
      <View style={styles.featureRow}>
        <Pressable
          testID="learn-intros"
          style={styles.feature}
          onPress={() => router.push('/learn/intros')}
        >
          <View style={styles.featureIcon}>
            <Feather name="book" size={20} color={colors.onBrand} />
          </View>
          <Text style={styles.featureTitle}>Book Introductions</Text>
          <Text style={styles.featureSub}>Who, when & why — all 66 books</Text>
        </Pressable>
        <Pressable
          testID="learn-dictionary"
          style={styles.feature}
          onPress={() => router.push('/learn/dictionary')}
        >
          <View style={[styles.featureIcon, { backgroundColor: colors.surfaceInverse }]}>
            <Feather name="search" size={20} color={colors.onSurfaceInverse} />
          </View>
          <Text style={styles.featureTitle}>Bible Dictionary</Text>
          <Text style={styles.featureSub}>Look up people, places & terms</Text>
        </Pressable>
      </View>

      {/* Guides */}
      <Text style={styles.sectionLabel}>GUIDES</Text>
      <View style={styles.guides}>
        {ARTICLES.map((a) => (
          <Pressable
            key={a.id}
            testID={`learn-article-${a.id}`}
            style={styles.guideRow}
            onPress={() =>
              router.push({ pathname: '/learn/article', params: { id: a.id } })
            }
          >
            <View style={styles.guideIcon}>
              <Feather
                name={a.icon as keyof typeof Feather.glyphMap}
                size={18}
                color={colors.brand}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.guideTitle}>{a.title}</Text>
              <Text style={styles.guideSub} numberOfLines={1}>
                {a.subtitle}
              </Text>
            </View>
            <Text style={styles.guideMin}>{a.minutes} min</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.footnote}>
        Bible Dictionary from Easton’s (1897), public domain. Guides and book
        summaries written for this app.
      </Text>
    </ScrollView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    header: { paddingHorizontal: spacing.xl, marginBottom: spacing.xl },
    title: {
      fontFamily: fonts.serif.semibold,
      fontSize: typeScale.xxxl,
      color: c.onSurface,
    },
    subtitle: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.base,
      color: c.onSurfaceTertiary,
      marginTop: 2,
    },
    featureRow: {
      flexDirection: 'row',
      gap: spacing.md,
      paddingHorizontal: spacing.xl,
    },
    feature: {
      flex: 1,
      padding: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: c.surfaceSecondary,
      minHeight: 150,
    },
    featureIcon: {
      width: 44,
      height: 44,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.brand,
      marginBottom: spacing.md,
    },
    featureTitle: {
      fontFamily: fonts.serif.medium,
      fontSize: typeScale.lg,
      color: c.onSurface,
    },
    featureSub: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
      marginTop: spacing.xs,
    },
    sectionLabel: {
      fontFamily: fonts.sans.semibold,
      fontSize: 11,
      letterSpacing: 1.5,
      color: c.onSurfaceTertiary,
      marginTop: spacing.xxl,
      marginBottom: spacing.md,
      paddingHorizontal: spacing.xl,
    },
    guides: { paddingHorizontal: spacing.xl, gap: spacing.md },
    guideRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: c.surfaceSecondary,
    },
    guideIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.brandTertiary,
    },
    guideTitle: {
      fontFamily: fonts.serif.medium,
      fontSize: typeScale.lg,
      color: c.onSurface,
    },
    guideSub: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
      marginTop: 2,
    },
    guideMin: {
      fontFamily: fonts.sans.medium,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
    },
    footnote: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
      paddingHorizontal: spacing.xl,
      marginTop: spacing.xxl,
      lineHeight: 18,
    },
  });
