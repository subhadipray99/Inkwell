import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Bookmark, HighlightColor, useApp } from '@/src/context/AppContext';
import { bookIndex, getVerse } from '@/src/lib/bible';
import {
  fonts,
  radius,
  spacing,
  ThemeColors,
  type as typeScale,
} from '@/src/theme/tokens';

type Mode = 'bookmarks' | 'highlights';

type HL = {
  book: string;
  chapter: number;
  verse: number;
  color: HighlightColor;
  text: string;
};

const COLOR_KEY: Record<HighlightColor, 'highlightYellow' | 'highlightRed' | 'highlightGreen'> = {
  yellow: 'highlightYellow',
  red: 'highlightRed',
  green: 'highlightGreen',
};

export default function Saved() {
  const {
    colors,
    bookmarks,
    removeBookmark,
    highlights,
    setHighlight,
    translation,
    showToast,
  } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [mode, setMode] = useState<Mode>('bookmarks');

  const hlList = useMemo<HL[]>(() => {
    const arr: HL[] = Object.entries(highlights).map(([k, color]) => {
      const [book, chapter, verse] = k.split('|');
      return {
        book,
        chapter: Number(chapter),
        verse: Number(verse),
        color,
        text: getVerse(translation, book, Number(chapter), Number(verse)),
      };
    });
    arr.sort((a, b) => {
      const bi = bookIndex(a.book) - bookIndex(b.book);
      if (bi !== 0) return bi;
      if (a.chapter !== b.chapter) return a.chapter - b.chapter;
      return a.verse - b.verse;
    });
    return arr;
  }, [highlights, translation]);

  const openVerse = (book: string, chapter: number, verse: number) => {
    router.push({
      pathname: '/reader',
      params: { book, chapter: String(chapter), verse: String(verse) },
    });
  };

  const removeBm = (b: Bookmark) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    removeBookmark(b.savedAt);
    showToast('Bookmark removed', 'trash-2');
  };

  const removeHl = (h: HL) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setHighlight(h.book, h.chapter, h.verse, null);
    showToast('Highlight removed', 'trash-2');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved</Text>
        <View style={styles.segment}>
          {(['bookmarks', 'highlights'] as Mode[]).map((m) => {
            const active = mode === m;
            return (
              <Pressable
                key={m}
                testID={`saved-tab-${m}`}
                onPress={() => setMode(m)}
                style={[styles.segmentBtn, active && { backgroundColor: colors.surfaceInverse }]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: active ? colors.onSurfaceInverse : colors.onSurfaceSecondary },
                  ]}
                >
                  {m === 'bookmarks'
                    ? `Bookmarks (${bookmarks.length})`
                    : `Highlights (${hlList.length})`}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {mode === 'bookmarks' ? (
        bookmarks.length === 0 ? (
          <EmptyState
            icon="bookmark"
            title="No verses saved yet"
            text="Tap a verse while reading to save it here."
            styles={styles}
            colors={colors}
            testID="bookmarks-empty"
          />
        ) : (
          <FlatList
            data={bookmarks}
            keyExtractor={(b) => b.savedAt}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
            contentContainerStyle={{
              paddingHorizontal: spacing.xl,
              paddingBottom: insets.bottom + spacing.xxl,
            }}
            renderItem={({ item }) => (
              <Pressable
                testID={`bookmark-${item.book}-${item.chapter}-${item.verse}`}
                style={styles.item}
                onPress={() => openVerse(item.book, item.chapter, item.verse)}
              >
                <View style={styles.itemHeader}>
                  <Text style={styles.ref}>
                    {item.book} {item.chapter}:{item.verse}
                  </Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.translation}</Text>
                  </View>
                </View>
                <Text style={styles.verse} numberOfLines={4}>
                  {item.text}
                </Text>
                <View style={styles.itemFooter}>
                  <Text style={styles.saved}>
                    Saved {dayjs(item.savedAt).format('MMM D, YYYY')}
                  </Text>
                  <Pressable
                    testID={`bookmark-remove-${item.book}-${item.chapter}-${item.verse}`}
                    onPress={() => removeBm(item)}
                    hitSlop={10}
                    style={styles.removeBtn}
                  >
                    <Feather name="trash-2" size={16} color={colors.onSurfaceTertiary} />
                  </Pressable>
                </View>
              </Pressable>
            )}
          />
        )
      ) : hlList.length === 0 ? (
        <EmptyState
          icon="edit-3"
          title="No highlights yet"
          text="Long-tap a verse and pick a color to mark it."
          styles={styles}
          colors={colors}
          testID="highlights-empty"
        />
      ) : (
        <FlatList
          data={hlList}
          keyExtractor={(h) => `${h.book}-${h.chapter}-${h.verse}`}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          contentContainerStyle={{
            paddingHorizontal: spacing.xl,
            paddingBottom: insets.bottom + spacing.xxl,
          }}
          renderItem={({ item }) => (
            <Pressable
              testID={`highlight-item-${item.book}-${item.chapter}-${item.verse}`}
              style={styles.item}
              onPress={() => openVerse(item.book, item.chapter, item.verse)}
            >
              <View style={styles.itemHeader}>
                <View style={styles.hlRefRow}>
                  <View
                    style={[styles.dot, { backgroundColor: colors[COLOR_KEY[item.color]] }]}
                  />
                  <Text style={styles.ref}>
                    {item.book} {item.chapter}:{item.verse}
                  </Text>
                </View>
                <Pressable
                  testID={`highlight-remove-${item.book}-${item.chapter}-${item.verse}`}
                  onPress={() => removeHl(item)}
                  hitSlop={10}
                  style={styles.removeBtn}
                >
                  <Feather name="trash-2" size={16} color={colors.onSurfaceTertiary} />
                </Pressable>
              </View>
              <Text
                style={[styles.verse, { backgroundColor: colors[COLOR_KEY[item.color]] }]}
                numberOfLines={4}
              >
                {item.text}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

function EmptyState({
  icon,
  title,
  text,
  styles,
  colors,
  testID,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  text: string;
  styles: ReturnType<typeof makeStyles>;
  colors: ThemeColors;
  testID: string;
}) {
  return (
    <View style={styles.empty} testID={testID}>
      <View style={styles.emptyIcon}>
        <Feather name={icon} size={30} color={colors.onSurfaceTertiary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.surface },
    header: { paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
    title: {
      fontFamily: fonts.serif.semibold,
      fontSize: typeScale.xxxl,
      color: c.onSurface,
    },
    segment: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.lg,
      backgroundColor: c.surfaceSecondary,
      borderRadius: radius.pill,
      padding: spacing.xs,
    },
    segmentBtn: {
      flex: 1,
      paddingVertical: spacing.sm + 2,
      borderRadius: radius.pill,
      alignItems: 'center',
    },
    segmentText: { fontFamily: fonts.sans.medium, fontSize: typeScale.base },
    item: {
      padding: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: c.surfaceSecondary,
    },
    itemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    hlRefRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    dot: { width: 12, height: 12, borderRadius: radius.pill },
    ref: {
      fontFamily: fonts.sans.semibold,
      fontSize: typeScale.base,
      color: c.brand,
    },
    badge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.sm,
      backgroundColor: c.surfaceTertiary,
    },
    badgeText: {
      fontFamily: fonts.sans.medium,
      fontSize: 10,
      letterSpacing: 1,
      color: c.onSurfaceTertiary,
    },
    verse: {
      fontFamily: fonts.serif.regular,
      fontSize: typeScale.lg,
      lineHeight: 27,
      color: c.onSurface,
      borderRadius: radius.sm,
    },
    itemFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.md,
    },
    saved: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
    },
    removeBtn: {
      width: 32,
      height: 32,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xxl,
      gap: spacing.sm,
    },
    emptyIcon: {
      width: 72,
      height: 72,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceSecondary,
      marginBottom: spacing.sm,
    },
    emptyTitle: {
      fontFamily: fonts.serif.medium,
      fontSize: typeScale.xl,
      color: c.onSurface,
    },
    emptyText: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.base,
      color: c.onSurfaceTertiary,
      textAlign: 'center',
    },
  });
