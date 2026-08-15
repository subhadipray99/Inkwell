import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/src/context/AppContext';
import { DictEntry, searchDictionary } from '@/src/lib/dictionary';
import {
  fonts,
  spacing,
  ThemeColors,
  type as typeScale,
} from '@/src/theme/tokens';

export default function Dictionary() {
  const { colors } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DictEntry[]>([]);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setResults(searchDictionary(query));
    }, 180);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query]);

  const open = (t: string) => {
    Keyboard.dismiss();
    router.push({ pathname: '/learn/term', params: { term: t } });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable
          testID="dictionary-back"
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Feather name="chevron-left" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.title}>Bible Dictionary</Text>
        <View style={styles.inputWrap}>
          <Feather name="search" size={18} color={colors.onSurfaceTertiary} />
          <TextInput
            testID="dictionary-input"
            value={query}
            onChangeText={setQuery}
            placeholder="Search 3,900+ entries…"
            placeholderTextColor={colors.onSurfaceTertiary}
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <Pressable testID="dictionary-clear" onPress={() => setQuery('')} hitSlop={10}>
              <Feather name="x" size={18} color={colors.onSurfaceTertiary} />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(e) => e.t}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingBottom: insets.bottom + spacing.xxl,
        }}
        renderItem={({ item }) => (
          <Pressable
            testID={`dict-term-${item.t}`}
            style={styles.row}
            onPress={() => open(item.t)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.term}>{item.t}</Text>
              <Text style={styles.preview} numberOfLines={2}>
                {item.d}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.onSurfaceTertiary} />
          </Pressable>
        )}
      />
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.surface },
    header: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
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
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: spacing.lg,
      marginHorizontal: spacing.sm,
      paddingBottom: spacing.md,
      borderBottomWidth: 1.5,
      borderBottomColor: c.borderStrong,
    },
    input: {
      flex: 1,
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.lg,
      color: c.onSurface,
      padding: 0,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.lg,
    },
    term: {
      fontFamily: fonts.serif.medium,
      fontSize: typeScale.lg,
      color: c.onSurface,
    },
    preview: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
      marginTop: 2,
      lineHeight: 18,
    },
    divider: { height: 1, backgroundColor: c.divider },
  });
