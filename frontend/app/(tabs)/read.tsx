import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/src/context/AppContext';
import { BOOKS, BookMeta, Testament } from '@/src/lib/bible';
import {
  fonts,
  radius,
  spacing,
  ThemeColors,
  type as typeScale,
} from '@/src/theme/tokens';

export default function Library() {
  const { colors } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [testament, setTestament] = useState<Testament>('OT');

  const books = useMemo(
    () => BOOKS.filter((b) => b.testament === testament),
    [testament],
  );

  const renderItem = ({ item }: { item: BookMeta }) => (
    <Pressable
      testID={`book-row-${item.name}`}
      style={styles.bookRow}
      onPress={() =>
        router.push({ pathname: '/chapters', params: { book: item.name } })
      }
    >
      <Text style={styles.bookName}>{item.name}</Text>
      <View style={styles.bookMeta}>
        <Text style={styles.chapterCount}>{item.chapters} ch</Text>
        <Feather name="chevron-right" size={18} color={colors.onSurfaceTertiary} />
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.subtitle}>66 books · 1,189 chapters</Text>
        <View style={styles.segment}>
          {(['OT', 'NT'] as Testament[]).map((t) => {
            const active = testament === t;
            return (
              <Pressable
                key={t}
                testID={`testament-${t}`}
                onPress={() => setTestament(t)}
                style={[
                  styles.segmentBtn,
                  active && { backgroundColor: colors.surfaceInverse },
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: active ? colors.onSurfaceInverse : colors.onSurfaceSecondary },
                  ]}
                >
                  {t === 'OT' ? 'Old Testament' : 'New Testament'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={books}
        keyExtractor={(b) => b.name}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingBottom: insets.bottom + spacing.xxl,
        }}
      />
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.surface },
    header: {
      paddingHorizontal: spacing.xl,
      marginBottom: spacing.lg,
    },
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
    segmentText: {
      fontFamily: fonts.sans.medium,
      fontSize: typeScale.base,
    },
    bookRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.lg,
    },
    bookName: {
      fontFamily: fonts.serif.medium,
      fontSize: typeScale.xl,
      color: c.onSurface,
    },
    bookMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    chapterCount: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
    },
    divider: {
      height: 1,
      backgroundColor: c.divider,
    },
  });
