import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/src/context/AppContext';
import { bookMeta } from '@/src/lib/bible';
import { BOOK_INTROS } from '@/src/data/learn';
import {
  fonts,
  radius,
  spacing,
  ThemeColors,
  type as typeScale,
} from '@/src/theme/tokens';

export default function BookIntroScreen() {
  const { colors } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { book } = useLocalSearchParams<{ book: string }>();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const intro = book ? BOOK_INTROS[book] : undefined;
  const meta = bookMeta(book || '');

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable
          testID="book-intro-back"
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Feather name="chevron-left" size={24} color={colors.onSurface} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingBottom: insets.bottom + spacing.xxxl,
        }}
      >
        <Text style={styles.book}>{book}</Text>
        {intro ? (
          <>
            <View style={styles.themePill}>
              <Text style={styles.themeText}>{intro.theme}</Text>
            </View>

            <Text style={styles.summary}>{intro.summary}</Text>

            <View style={styles.facts}>
              <Fact label="Author" value={intro.author} styles={styles} />
              <View style={styles.factDivider} />
              <Fact label="Written" value={intro.date} styles={styles} />
              <View style={styles.factDivider} />
              <Fact
                label="Chapters"
                value={String(meta?.chapters ?? '')}
                styles={styles}
              />
            </View>

            <Pressable
              testID="book-intro-read"
              style={styles.readBtn}
              onPress={() =>
                router.push({ pathname: '/chapters', params: { book: book! } })
              }
            >
              <Feather name="book-open" size={18} color={colors.onBrand} />
              <Text style={styles.readText}>Read {book}</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.summary}>No introduction available.</Text>
        )}
      </ScrollView>
    </View>
  );
}

function Fact({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.surface },
    header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
    backBtn: {
      width: 40,
      height: 40,
      marginLeft: -spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    book: {
      fontFamily: fonts.serif.semibold,
      fontSize: 40,
      color: c.onSurface,
    },
    themePill: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.pill,
      backgroundColor: c.brandTertiary,
      marginTop: spacing.md,
    },
    themeText: {
      fontFamily: fonts.sans.medium,
      fontSize: typeScale.sm,
      color: c.onBrandTertiary,
    },
    summary: {
      fontFamily: fonts.serif.regular,
      fontSize: 19,
      lineHeight: 31,
      color: c.onSurface,
      marginTop: spacing.xl,
    },
    facts: {
      flexDirection: 'row',
      marginTop: spacing.xl,
      padding: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: c.surfaceSecondary,
    },
    fact: { flex: 1, alignItems: 'center' },
    factDivider: { width: 1, backgroundColor: c.divider },
    factLabel: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
    },
    factValue: {
      fontFamily: fonts.sans.medium,
      fontSize: typeScale.sm,
      color: c.onSurface,
      marginTop: spacing.xs,
      textAlign: 'center',
    },
    readBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      marginTop: spacing.xl,
      paddingVertical: spacing.lg,
      borderRadius: radius.md,
      backgroundColor: c.brand,
    },
    readText: {
      fontFamily: fonts.sans.semibold,
      fontSize: typeScale.lg,
      color: c.onBrand,
    },
  });
