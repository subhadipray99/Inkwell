import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/src/context/AppContext';
import { BOOKS, TOTAL_CHAPTERS } from '@/src/lib/bible';
import {
  fonts,
  radius,
  spacing,
  ThemeColors,
  type as typeScale,
} from '@/src/theme/tokens';

export default function Progress() {
  const { colors, visited, streak, bookmarks } = useApp();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const visitedSet = useMemo(() => new Set(visited), [visited]);
  const completion = (visited.length / TOTAL_CHAPTERS) * 100;

  const otTotal = BOOKS.filter((b) => b.testament === 'OT').reduce(
    (s, b) => s + b.chapters,
    0,
  );
  const ntTotal = TOTAL_CHAPTERS - otTotal;
  const otVisited = visited.filter((id) =>
    BOOKS.some((b) => b.testament === 'OT' && id.startsWith(b.name + '-')),
  ).length;
  const ntVisited = visited.length - otVisited;

  return (
    <ScrollView
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingHorizontal: spacing.xl,
        paddingBottom: insets.bottom + spacing.xxl,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Progress</Text>

      {/* Completion hero */}
      <View style={styles.completionBlock}>
        <Text style={styles.bigPercent} testID="completion-percent">
          {completion < 1 && completion > 0
            ? completion.toFixed(1)
            : Math.round(completion)}
          <Text style={styles.percentSign}>%</Text>
        </Text>
        <Text style={styles.completionLabel}>of the Bible read</Text>
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              { width: `${Math.max(completion, 1)}%` },
            ]}
          />
        </View>
        <Text style={styles.chapCount}>
          {visitedSet.size} of {TOTAL_CHAPTERS.toLocaleString()} chapters visited
        </Text>
      </View>

      {/* Testament breakdown */}
      <View style={styles.breakRow}>
        <TestamentStat
          label="Old Testament"
          visited={otVisited}
          total={otTotal}
          styles={styles}
          colors={colors}
        />
        <TestamentStat
          label="New Testament"
          visited={ntVisited}
          total={ntTotal}
          styles={styles}
          colors={colors}
        />
      </View>

      {/* Streak + Saved */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard} testID="streak-metric">
          <View style={styles.metricIcon}>
            <Feather name="zap" size={18} color={colors.brand} />
          </View>
          <Text style={styles.metricValue}>{streak.count}</Text>
          <Text style={styles.metricLabel}>
            day{streak.count === 1 ? '' : 's'} streak
          </Text>
        </View>
        <View style={styles.metricCard} testID="saved-metric">
          <View style={styles.metricIcon}>
            <Feather name="bookmark" size={18} color={colors.brand} />
          </View>
          <Text style={styles.metricValue}>{bookmarks.length}</Text>
          <Text style={styles.metricLabel}>verses saved</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function TestamentStat({
  label,
  visited,
  total,
  styles,
  colors,
}: {
  label: string;
  visited: number;
  total: number;
  styles: ReturnType<typeof makeStyles>;
  colors: ThemeColors;
}) {
  const pct = total ? (visited / total) * 100 : 0;
  return (
    <View style={styles.breakCard}>
      <Text style={styles.breakLabel}>{label}</Text>
      <Text style={styles.breakValue}>
        {visited}
        <Text style={styles.breakTotal}> / {total}</Text>
      </Text>
      <View style={styles.trackSm}>
        <View
          style={[styles.fillSm, { width: `${Math.max(pct, 1)}%`, backgroundColor: colors.brand }]}
        />
      </View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    title: {
      fontFamily: fonts.serif.semibold,
      fontSize: typeScale.xxxl,
      color: c.onSurface,
      marginBottom: spacing.xl,
    },
    completionBlock: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    bigPercent: {
      fontFamily: fonts.serif.semibold,
      fontSize: 88,
      lineHeight: 96,
      color: c.onSurface,
    },
    percentSign: {
      fontFamily: fonts.serif.regular,
      fontSize: 40,
      color: c.brand,
    },
    completionLabel: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.lg,
      color: c.onSurfaceTertiary,
      marginTop: spacing.xs,
    },
    track: {
      width: '100%',
      height: 6,
      borderRadius: radius.pill,
      backgroundColor: c.surfaceTertiary,
      overflow: 'hidden',
      marginTop: spacing.xl,
    },
    fill: {
      height: 6,
      borderRadius: radius.pill,
      backgroundColor: c.brand,
    },
    chapCount: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.base,
      color: c.onSurfaceTertiary,
      marginTop: spacing.md,
    },
    breakRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.xl,
    },
    breakCard: {
      flex: 1,
      padding: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: c.surfaceSecondary,
    },
    breakLabel: {
      fontFamily: fonts.sans.medium,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
    },
    breakValue: {
      fontFamily: fonts.serif.semibold,
      fontSize: typeScale.xxl,
      color: c.onSurface,
      marginTop: spacing.xs,
    },
    breakTotal: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.base,
      color: c.onSurfaceTertiary,
    },
    trackSm: {
      height: 4,
      borderRadius: radius.pill,
      backgroundColor: c.surfaceTertiary,
      overflow: 'hidden',
      marginTop: spacing.md,
    },
    fillSm: { height: 4, borderRadius: radius.pill },
    metricsRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.md,
    },
    metricCard: {
      flex: 1,
      padding: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: c.surfaceSecondary,
      alignItems: 'flex-start',
    },
    metricIcon: {
      width: 36,
      height: 36,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.brandTertiary,
      marginBottom: spacing.md,
    },
    metricValue: {
      fontFamily: fonts.serif.semibold,
      fontSize: typeScale.xxxl,
      color: c.onSurface,
    },
    metricLabel: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
    },
  });
