import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/src/context/AppContext';
import { ARTICLES } from '@/src/data/learn';
import {
  fonts,
  spacing,
  ThemeColors,
  type as typeScale,
} from '@/src/theme/tokens';

export default function ArticleScreen() {
  const { colors } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const article = ARTICLES.find((a) => a.id === id);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable
          testID="article-back"
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
        {article ? (
          <>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.subtitle}>{article.subtitle}</Text>
            <Text style={styles.meta}>{article.minutes} min read</Text>
            {article.sections.map((s, i) => (
              <View key={i} style={styles.section}>
                {s.heading ? (
                  <Text style={styles.heading}>{s.heading}</Text>
                ) : null}
                <Text style={styles.body}>{s.text}</Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.body}>Article not found.</Text>
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
    title: {
      fontFamily: fonts.serif.semibold,
      fontSize: typeScale.xxxl,
      lineHeight: 40,
      color: c.onSurface,
    },
    subtitle: {
      fontFamily: fonts.serif.italic,
      fontSize: typeScale.lg,
      color: c.onSurfaceSecondary,
      marginTop: spacing.sm,
    },
    meta: {
      fontFamily: fonts.sans.medium,
      fontSize: typeScale.sm,
      color: c.brand,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    section: { marginTop: spacing.xl },
    heading: {
      fontFamily: fonts.sans.semibold,
      fontSize: typeScale.lg,
      color: c.onSurface,
      marginBottom: spacing.sm,
    },
    body: {
      fontFamily: fonts.serif.regular,
      fontSize: 18,
      lineHeight: 30,
      color: c.onSurface,
    },
  });
