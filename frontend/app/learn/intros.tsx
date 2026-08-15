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
import { BOOK_INTROS } from '@/src/data/learn';
import {
  fonts,
  radius,
  spacing,
  ThemeColors,
  type as typeScale,
} from '@/src/theme/tokens';

export default function Intros() {
  const { colors } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [testament, setTestament] = useState<Testament>('OT');

  const books = useMemo(
    () => BOOKS.filter((b) => b.testament === testament),
    [testament],
  );

  const renderItem = ({ item }: { item: BookMeta }) => {
    const intro = BOOK_INTROS[item.name];
    return (
      <Pressable
        testID={`intro-row-${item.name}`}
        style={styles.row}
        onPress={() =>
          router.push({ pathname: '/learn/book', params: { book: item.name } })
        }
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.book}>{item.name}</Text>
          <Text style={styles.theme}>{intro?.theme}</Text>
        </View>
        <Feather name="chevron-right" size={18} color={colors.onSurfaceTertiary} />
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable
          testID="intros-back"
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Feather name="chevron-left" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.title}>Book Introductions</Text>
        <View style={styles.segment}>
          {(['OT', 'NT'] as Testament[]).map((t) => {
            const active = testament === t;
            return (
              <Pressable
                key={t}
                testID={`intros-testament-${t}`}
                onPress={() => setTestament(t)}
                style={[styles.segmentBtn, active && { backgroundColor: colors.surfaceInverse }]}
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
    header: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
    backBtn: {
      width: 40,
      height: 40,
      marginLeft: -spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontFamily: fonts.serif.semibold,
      fontSize: typeScale.xxl,
      color: c.onSurface,
      paddingHorizontal: spacing.sm,
      marginTop: spacing.sm,
    },
    segment: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.lg,
      marginHorizontal: spacing.sm,
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
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.lg,
    },
    book: {
      fontFamily: fonts.serif.medium,
      fontSize: typeScale.xl,
      color: c.onSurface,
    },
    theme: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
      marginTop: 2,
    },
    divider: { height: 1, backgroundColor: c.divider },
  });
