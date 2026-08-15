import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/src/context/AppContext';
import { bookMeta } from '@/src/lib/bible';
import {
  fonts,
  radius,
  spacing,
  ThemeColors,
  type as typeScale,
} from '@/src/theme/tokens';

export default function Chapters() {
  const { colors, visited } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { book } = useLocalSearchParams<{ book: string }>();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const meta = bookMeta(book || '');
  const chapters = useMemo(
    () => Array.from({ length: meta?.chapters ?? 0 }, (_, i) => i + 1),
    [meta],
  );
  const visitedSet = useMemo(() => new Set(visited), [visited]);

  const open = (chapter: number) => {
    router.push({
      pathname: '/reader',
      params: { book: book!, chapter: String(chapter), verse: '1' },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable
          testID="chapters-back"
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Feather name="chevron-left" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {book}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <FlatList
        data={chapters}
        keyExtractor={(n) => String(n)}
        numColumns={5}
        columnWrapperStyle={{ gap: spacing.md }}
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.md,
          paddingBottom: insets.bottom + spacing.xxl,
          gap: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.count}>{meta?.chapters} chapters</Text>
        }
        renderItem={({ item }) => {
          const isVisited = visitedSet.has(`${book}-${item}`);
          return (
            <Pressable
              testID={`chapter-tile-${item}`}
              style={[styles.tile, isVisited && styles.tileVisited]}
              onPress={() => open(item)}
            >
              <Text
                style={[styles.tileText, isVisited && styles.tileTextVisited]}
              >
                {item}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.surface },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },
    backBtn: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontFamily: fonts.serif.semibold,
      fontSize: typeScale.xl,
      color: c.onSurface,
    },
    count: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.base,
      color: c.onSurfaceTertiary,
      marginBottom: spacing.lg,
    },
    tile: {
      flex: 1,
      aspectRatio: 1,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceSecondary,
    },
    tileVisited: {
      backgroundColor: c.brandTertiary,
    },
    tileText: {
      fontFamily: fonts.sans.medium,
      fontSize: typeScale.lg,
      color: c.onSurface,
    },
    tileTextVisited: {
      color: c.onBrandTertiary,
    },
  });
