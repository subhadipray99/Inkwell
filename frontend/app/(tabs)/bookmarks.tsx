import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Bookmark, useApp } from '@/src/context/AppContext';
import {
  fonts,
  radius,
  spacing,
  ThemeColors,
  type as typeScale,
} from '@/src/theme/tokens';

export default function Bookmarks() {
  const { colors, bookmarks, removeBookmark, showToast } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const openVerse = (b: Bookmark) => {
    router.push({
      pathname: '/reader',
      params: {
        book: b.book,
        chapter: String(b.chapter),
        verse: String(b.verse),
      },
    });
  };

  const onRemove = (b: Bookmark) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    removeBookmark(b.savedAt);
    showToast('Bookmark removed', 'trash-2');
  };

  const renderItem = ({ item }: { item: Bookmark }) => (
    <Pressable
      testID={`bookmark-${item.book}-${item.chapter}-${item.verse}`}
      style={styles.item}
      onPress={() => openVerse(item)}
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
          onPress={() => onRemove(item)}
          hitSlop={10}
          style={styles.removeBtn}
        >
          <Feather name="trash-2" size={16} color={colors.onSurfaceTertiary} />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved</Text>
        <Text style={styles.subtitle}>
          {bookmarks.length} {bookmarks.length === 1 ? 'verse' : 'verses'}
        </Text>
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.empty} testID="bookmarks-empty">
          <View style={styles.emptyIcon}>
            <Feather name="bookmark" size={30} color={colors.onSurfaceTertiary} />
          </View>
          <Text style={styles.emptyTitle}>No verses saved yet</Text>
          <Text style={styles.emptyText}>
            Tap a verse while reading to save it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(b) => b.savedAt}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          contentContainerStyle={{
            paddingHorizontal: spacing.xl,
            paddingBottom: insets.bottom + spacing.xxl,
          }}
        />
      )}
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
    subtitle: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.base,
      color: c.onSurfaceTertiary,
      marginTop: 2,
    },
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
