import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import { SearchResult, searchVerses } from '@/src/lib/bible';
import {
  fonts,
  heroImages,
  radius,
  spacing,
  ThemeColors,
  type as typeScale,
} from '@/src/theme/tokens';

export default function Search() {
  const { colors, translation } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (query.trim().length < 2) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounce.current = setTimeout(() => {
      const r = searchVerses(translation, query);
      setResults(r);
      setLoading(false);
      setSearched(true);
    }, 250);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query, translation]);

  const openResult = (item: SearchResult) => {
    Keyboard.dismiss();
    router.push({
      pathname: '/reader',
      params: {
        book: item.book,
        chapter: String(item.chapter),
        verse: String(item.verse),
      },
    });
  };

  const renderItem = ({ item }: { item: SearchResult }) => (
    <Pressable
      testID={`search-result-${item.book}-${item.chapter}-${item.verse}`}
      style={styles.result}
      onPress={() => openResult(item)}
    >
      <Text style={styles.resultRef}>
        {item.book} {item.chapter}:{item.verse}
      </Text>
      <Text style={styles.resultText} numberOfLines={3}>
        {highlight(item.text, query)}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Text style={styles.title}>Search</Text>
      <View style={styles.inputWrap}>
        <Feather name="search" size={18} color={colors.onSurfaceTertiary} />
        <TextInput
          testID="search-input"
          value={query}
          onChangeText={setQuery}
          placeholder={`Search the ${translation}…`}
          placeholderTextColor={colors.onSurfaceTertiary}
          style={styles.input}
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable testID="search-clear" onPress={() => setQuery('')} hitSlop={10}>
            <Feather name="x" size={18} color={colors.onSurfaceTertiary} />
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : searched && results.length === 0 ? (
        <View style={styles.center} testID="search-no-results">
          <Feather name="search" size={28} color={colors.onSurfaceTertiary} />
          <Text style={styles.emptyText}>No verses found for “{query}”.</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.center} testID="search-empty">
          <Image
            source={{ uri: heroImages.emptySearch }}
            style={styles.emptyImg}
            contentFit="cover"
          />
          <Text style={styles.emptyTitle}>Search Scripture</Text>
          <Text style={styles.emptyText}>
            Type a word or phrase to find it across the {translation}.
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(r) => `${r.book}-${r.chapter}-${r.verse}`}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.count}>
              {results.length}
              {results.length >= 150 ? '+' : ''} results
            </Text>
          }
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          contentContainerStyle={{
            paddingHorizontal: spacing.xl,
            paddingBottom: insets.bottom + spacing.xxl,
          }}
        />
      )}
    </View>
  );
}

// Render matched substring in the brand color (simple, single-match highlight).
function highlight(text: string, query: string) {
  const q = query.trim();
  if (q.length < 2) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <Text style={{ fontFamily: fonts.serif.semibold }}>
        {text.slice(idx, idx + q.length)}
      </Text>
      {text.slice(idx + q.length)}
    </>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.surface },
    title: {
      fontFamily: fonts.serif.semibold,
      fontSize: typeScale.xxxl,
      color: c.onSurface,
      paddingHorizontal: spacing.xl,
    },
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginHorizontal: spacing.xl,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
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
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xxl,
      gap: spacing.md,
    },
    emptyImg: {
      width: 140,
      height: 140,
      borderRadius: radius.lg,
      marginBottom: spacing.sm,
      opacity: 0.9,
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
      lineHeight: 20,
    },
    count: {
      fontFamily: fonts.sans.medium,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
      marginBottom: spacing.md,
    },
    result: {
      paddingVertical: spacing.lg,
    },
    resultRef: {
      fontFamily: fonts.sans.semibold,
      fontSize: typeScale.sm,
      color: c.brand,
      marginBottom: spacing.xs,
    },
    resultText: {
      fontFamily: fonts.serif.regular,
      fontSize: typeScale.lg,
      lineHeight: 26,
      color: c.onSurface,
    },
    divider: { height: 1, backgroundColor: c.divider },
  });
