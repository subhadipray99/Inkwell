import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/src/context/AppContext';
import { AdBanner } from '@/src/ads/AdBanner';
import { TOTAL_CHAPTERS } from '@/src/lib/bible';
import { parseReference } from '@/src/lib/reference';
import { storage } from '@/src/utils/storage';
import {
  fonts,
  heroImages,
  radius,
  spacing,
  ThemeColors,
  type as typeScale,
} from '@/src/theme/tokens';

type Votd = {
  date: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
};

const FALLBACK: Votd = {
  date: '',
  book: 'John',
  chapter: 3,
  verse: 16,
  text:
    'For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.',
};

export default function Home() {
  const { colors, isDark, toggleTheme, lastRead, visited, streak, showToast } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [votd, setVotd] = useState<Votd | null>(null);
  const [jump, setJump] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      const today = dayjs().format('YYYY-MM-DD');
      const cached = await storage.getItem('votd', '');
      let parsed: Votd | null = null;
      if (cached) {
        try {
          parsed = JSON.parse(cached) as Votd;
        } catch {
          parsed = null;
        }
      }
      if (parsed && parsed.date === today) {
        if (active) setVotd(parsed);
        return;
      }
      try {
        const res = await fetch('https://bible-api.com/data/web/random');
        const json = await res.json();
        const rv = json.random_verse;
        const next: Votd = {
          date: today,
          book: rv.book,
          chapter: rv.chapter,
          verse: rv.verse,
          text: String(rv.text).replace(/\s+/g, ' ').trim(),
        };
        storage.setItem('votd', JSON.stringify(next));
        if (active) setVotd(next);
      } catch {
        if (active) setVotd(parsed ?? FALLBACK);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const completion = Math.round((visited.length / TOTAL_CHAPTERS) * 100);
  const greeting = getGreeting();

  const openVerse = (book: string, chapter: number, verse: number) => {
    router.push({
      pathname: '/reader',
      params: { book, chapter: String(chapter), verse: String(verse) },
    });
  };

  const onJump = () => {
    const ref = parseReference(jump);
    if (!ref) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      showToast('Couldn’t find that reference', 'alert-circle');
      return;
    }
    Keyboard.dismiss();
    setJump('');
    openVerse(ref.book, ref.chapter, ref.verse);
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingBottom: spacing.xxxl,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      testID="home-scroll"
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.appName}>Logos</Text>
        </View>
        <Pressable
          testID="theme-toggle-button"
          onPress={toggleTheme}
          hitSlop={12}
          style={styles.themeBtn}
        >
          <Feather
            name={isDark ? 'sun' : 'moon'}
            size={20}
            color={colors.onSurface}
          />
        </Pressable>
      </View>

      {/* Quick Jump */}
      <View style={styles.jumpWrap}>
        <Feather name="navigation" size={16} color={colors.onSurfaceTertiary} />
        <TextInput
          testID="quick-jump-input"
          value={jump}
          onChangeText={setJump}
          placeholder="Go to a verse — e.g. John 3:16"
          placeholderTextColor={colors.onSurfaceTertiary}
          style={styles.jumpInput}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="go"
          onSubmitEditing={onJump}
        />
        {jump.trim().length > 0 && (
          <Pressable testID="quick-jump-go" onPress={onJump} hitSlop={10}>
            <Feather name="arrow-right-circle" size={22} color={colors.brand} />
          </Pressable>
        )}
      </View>

      {/* Verse of the Day */}
      <Pressable
        testID="votd-card"
        style={styles.hero}
        onPress={() => votd && openVerse(votd.book, votd.chapter, votd.verse)}
      >
        <Image
          source={{ uri: isDark ? heroImages.dark : heroImages.light }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={400}
        />
        <LinearGradient
          colors={[
            'transparent',
            isDark ? 'rgba(28,27,26,0.35)' : 'rgba(43,42,40,0.30)',
            isDark ? 'rgba(28,27,26,0.92)' : 'rgba(43,42,40,0.86)',
          ]}
          locations={[0, 0.35, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroLabel}>VERSE OF THE DAY</Text>
          {votd ? (
            <>
              <Text style={styles.heroVerse} numberOfLines={5}>
                {votd.text}
              </Text>
              <Text style={styles.heroRef}>
                {votd.book} {votd.chapter}:{votd.verse}
              </Text>
            </>
          ) : (
            <Text style={styles.heroVerse}>Loading today’s verse…</Text>
          )}
        </View>
      </Pressable>

      {/* Continue Reading */}
      {lastRead ? (
        <Pressable
          testID="continue-reading-card"
          style={styles.continueCard}
          onPress={() => openVerse(lastRead.book, lastRead.chapter, lastRead.verse)}
        >
          <View style={styles.continueIcon}>
            <Feather name="book-open" size={18} color={colors.onBrandTertiary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.continueLabel}>Continue Reading</Text>
            <Text style={styles.continueRef}>
              {lastRead.book} {lastRead.chapter}:{lastRead.verse}
            </Text>
          </View>
          <Feather name="arrow-right" size={20} color={colors.onSurfaceTertiary} />
        </Pressable>
      ) : (
        <Pressable
          testID="start-reading-card"
          style={styles.continueCard}
          onPress={() => router.push('/read')}
        >
          <View style={styles.continueIcon}>
            <Feather name="book-open" size={18} color={colors.onBrandTertiary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.continueLabel}>Start Reading</Text>
            <Text style={styles.continueRef}>Open the library</Text>
          </View>
          <Feather name="arrow-right" size={20} color={colors.onSurfaceTertiary} />
        </Pressable>
      )}

      {/* Stats */}
      <View style={styles.statsRow}>
        <Pressable
          testID="progress-stat-card"
          style={styles.statCard}
          onPress={() => router.push('/progress')}
        >
          <Text style={styles.statValue}>{completion}%</Text>
          <Text style={styles.statLabel}>Bible Read</Text>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${Math.max(completion, 2)}%` }]}
            />
          </View>
        </Pressable>
        <View style={styles.statCard} testID="streak-stat-card">
          <Text style={styles.statValue}>{streak.count}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
          <View style={styles.streakRow}>
            <Feather name="zap" size={13} color={colors.brand} />
            <Text style={styles.streakHint}>
              {streak.count > 0 ? 'Keep it going' : 'Read today'}
            </Text>
          </View>
        </View>
      </View>

      {/* Learn discovery */}
      <Pressable
        testID="home-learn-card"
        style={styles.learnCard}
        onPress={() => router.push('/learn')}
      >
        <View style={styles.learnIcon}>
          <Feather name="compass" size={18} color={colors.onBrand} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.learnTitle}>Understand the Bible</Text>
          <Text style={styles.learnSub}>
            Guides, book intros & a dictionary
          </Text>
        </View>
        <Feather name="arrow-right" size={20} color={colors.onSurfaceTertiary} />
      </Pressable>

      <AdBanner style={{ marginTop: spacing.xl }} />
    </ScrollView>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xl,
      marginBottom: spacing.lg,
    },
    greeting: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.base,
      color: c.onSurfaceTertiary,
    },
    appName: {
      fontFamily: fonts.serif.semibold,
      fontSize: typeScale.xxl,
      color: c.onSurface,
      marginTop: 2,
    },
    themeBtn: {
      width: 44,
      height: 44,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceSecondary,
    },
    jumpWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginHorizontal: spacing.xl,
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.lg,
      height: 48,
      borderRadius: radius.pill,
      backgroundColor: c.surfaceSecondary,
    },
    jumpInput: {
      flex: 1,
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.base,
      color: c.onSurface,
      padding: 0,
    },
    hero: {
      marginHorizontal: spacing.xl,
      height: 300,
      borderRadius: radius.lg,
      overflow: 'hidden',
      justifyContent: 'flex-end',
      backgroundColor: c.surfaceTertiary,
    },
    heroContent: { padding: spacing.xl },
    heroLabel: {
      fontFamily: fonts.sans.semibold,
      fontSize: 11,
      letterSpacing: 2,
      color: 'rgba(253,251,247,0.85)',
      marginBottom: spacing.md,
    },
    heroVerse: {
      fontFamily: fonts.serif.medium,
      fontSize: typeScale.xl,
      lineHeight: 30,
      color: '#FDFBF7',
    },
    heroRef: {
      fontFamily: fonts.sans.medium,
      fontSize: typeScale.base,
      color: 'rgba(253,251,247,0.9)',
      marginTop: spacing.md,
    },
    continueCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginHorizontal: spacing.xl,
      marginTop: spacing.xl,
      padding: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: c.surfaceSecondary,
    },
    continueIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.brandTertiary,
    },
    continueLabel: {
      fontFamily: fonts.sans.medium,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
    },
    continueRef: {
      fontFamily: fonts.serif.medium,
      fontSize: typeScale.lg,
      color: c.onSurface,
      marginTop: 2,
    },
    statsRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginHorizontal: spacing.xl,
      marginTop: spacing.md,
    },
    statCard: {
      flex: 1,
      padding: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: c.surfaceSecondary,
    },
    statValue: {
      fontFamily: fonts.serif.semibold,
      fontSize: typeScale.xxxl,
      color: c.onSurface,
    },
    statLabel: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
      marginTop: 2,
    },
    progressTrack: {
      height: 4,
      borderRadius: radius.pill,
      backgroundColor: c.surfaceTertiary,
      marginTop: spacing.md,
      overflow: 'hidden',
    },
    progressFill: {
      height: 4,
      borderRadius: radius.pill,
      backgroundColor: c.brand,
    },
    streakRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.md,
    },
    streakHint: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
    },
    learnCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginHorizontal: spacing.xl,
      marginTop: spacing.md,
      padding: spacing.lg,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    learnIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.brand,
    },
    learnTitle: {
      fontFamily: fonts.serif.medium,
      fontSize: typeScale.lg,
      color: c.onSurface,
    },
    learnSub: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
      marginTop: 2,
    },
  });
