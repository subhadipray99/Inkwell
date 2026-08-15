import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/src/context/AppContext';
import { getEntry } from '@/src/lib/dictionary';
import {
  fonts,
  spacing,
  ThemeColors,
  type as typeScale,
} from '@/src/theme/tokens';

export default function TermScreen() {
  const { colors } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { term } = useLocalSearchParams<{ term: string }>();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const entry = term ? getEntry(term) : undefined;
  const paragraphs = entry ? entry.d.split('\n\n').filter(Boolean) : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable
          testID="term-back"
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
        <Text style={styles.term}>{entry?.t ?? term}</Text>
        <Text style={styles.source}>Easton’s Bible Dictionary</Text>
        {paragraphs.length ? (
          paragraphs.map((p, i) => (
            <Text key={i} style={styles.body}>
              {p}
            </Text>
          ))
        ) : (
          <Text style={styles.body}>No definition available.</Text>
        )}
      </ScrollView>
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
    term: {
      fontFamily: fonts.serif.semibold,
      fontSize: typeScale.xxxl,
      color: c.onSurface,
    },
    source: {
      fontFamily: fonts.sans.medium,
      fontSize: typeScale.sm,
      color: c.brand,
      marginTop: spacing.xs,
      marginBottom: spacing.lg,
    },
    body: {
      fontFamily: fonts.serif.regular,
      fontSize: 18,
      lineHeight: 30,
      color: c.onSurface,
      marginBottom: spacing.lg,
    },
  });
