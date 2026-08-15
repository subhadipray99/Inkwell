import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HighlightColor, useApp } from '@/src/context/AppContext';
import {
  TRANSLATIONS,
  Translation,
  adjacentChapter,
  getChapter,
} from '@/src/lib/bible';
import {
  fonts,
  radius,
  spacing,
  ThemeColors,
  type as typeScale,
} from '@/src/theme/tokens';

const HIGHLIGHTS: { id: HighlightColor; key: 'highlightYellow' | 'highlightRed' | 'highlightGreen' }[] = [
  { id: 'yellow', key: 'highlightYellow' },
  { id: 'red', key: 'highlightRed' },
  { id: 'green', key: 'highlightGreen' },
];

export default function Reader() {
  const {
    colors,
    translation,
    setTranslation,
    highlights,
    setHighlight,
    isBookmarked,
    toggleBookmark,
    recordVisit,
    fontScale,
    setFontScale,
    showToast,
  } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ book: string; chapter: string; verse?: string }>();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [loc, setLoc] = useState({
    book: params.book,
    chapter: Number(params.chapter) || 1,
  });

  const scrollRef = useRef<ScrollView>(null);
  const targetVerse = useRef<number | null>(
    params.verse && Number(params.verse) > 1 ? Number(params.verse) : null,
  );
  const scrolled = useRef(false);
  const [flashVerse, setFlashVerse] = useState<number | null>(targetVerse.current);

  const verseSheet = useRef<BottomSheetModal>(null);
  const settingsSheet = useRef<BottomSheetModal>(null);
  const shareSheet = useRef<BottomSheetModal>(null);
  const cardRef = useRef<View>(null);
  const [selected, setSelected] = useState<{ verse: number; text: string } | null>(null);

  const verses = useMemo(() => {
    const arr = getChapter(translation, loc.book, loc.chapter);
    return arr
      .map((text, i) => ({ v: i + 1, text }))
      .filter((x) => x.text.length > 0);
  }, [translation, loc.book, loc.chapter]);

  useEffect(() => {
    recordVisit(loc.book, loc.chapter, targetVerse.current ?? 1);
  }, [loc.book, loc.chapter, recordVisit]);

  useEffect(() => {
    if (flashVerse == null) return;
    const t = setTimeout(() => setFlashVerse(null), 1800);
    return () => clearTimeout(t);
  }, [flashVerse]);

  const goChapter = (dir: 1 | -1) => {
    const next = adjacentChapter(loc.book, loc.chapter, dir);
    if (!next) return;
    Haptics.selectionAsync().catch(() => {});
    targetVerse.current = null;
    scrolled.current = true;
    setFlashVerse(null);
    setLoc(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const onVerseLayout = (v: number, y: number) => {
    if (!scrolled.current && targetVerse.current === v) {
      scrolled.current = true;
      setTimeout(
        () => scrollRef.current?.scrollTo({ y: Math.max(y - 120, 0), animated: true }),
        60,
      );
    }
  };

  const openVerse = (v: number, text: string) => {
    Haptics.selectionAsync().catch(() => {});
    setSelected({ verse: v, text });
    verseSheet.current?.present();
  };

  const doHighlight = (color: HighlightColor | null) => {
    if (!selected) return;
    setHighlight(loc.book, loc.chapter, selected.verse, color);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    verseSheet.current?.dismiss();
  };

  const doCopy = async () => {
    if (!selected) return;
    await Clipboard.setStringAsync(
      `“${selected.text}” — ${loc.book} ${loc.chapter}:${selected.verse} (${translation})`,
    );
    verseSheet.current?.dismiss();
    showToast('Copied to clipboard', 'copy');
  };

  const doBookmark = () => {
    if (!selected) return;
    const already = isBookmarked(loc.book, loc.chapter, selected.verse);
    toggleBookmark({
      book: loc.book,
      chapter: loc.chapter,
      verse: selected.verse,
      text: selected.text,
      translation,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    verseSheet.current?.dismiss();
    showToast(already ? 'Bookmark removed' : 'Verse saved', already ? 'trash-2' : 'bookmark');
  };

  const openShare = () => {
    verseSheet.current?.dismiss();
    setTimeout(() => shareSheet.current?.present(), 260);
  };

  const doShareImage = async () => {
    try {
      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        showToast('Sharing not available here', 'alert-circle');
      }
    } catch {
      showToast('Could not create image', 'alert-circle');
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.45}
      />
    ),
    [],
  );

  const vFontSize = 19 * fontScale;
  const vLineHeight = 32 * fontScale;
  const selectedHighlight = selected
    ? highlights[`${loc.book}|${loc.chapter}|${selected.verse}`]
    : undefined;
  const selectedBookmarked = selected
    ? isBookmarked(loc.book, loc.chapter, selected.verse)
    : false;

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          testID="reader-back"
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.iconBtn}
        >
          <Feather name="chevron-left" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {loc.book} {loc.chapter}
        </Text>
        <Pressable
          testID="reader-translation-pill"
          onPress={() => settingsSheet.current?.present()}
          style={styles.transPill}
        >
          <Text style={styles.transPillText}>{translation}</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.lg,
          paddingBottom: insets.bottom + 120,
        }}
        testID="reader-scroll"
      >
        {verses.map((item) => {
          const hc = highlights[`${loc.book}|${loc.chapter}|${item.v}`];
          const flash = flashVerse === item.v;
          return (
            <Pressable
              key={item.v}
              testID={`verse-${item.v}`}
              onPress={() => openVerse(item.v, item.text)}
              onLayout={(e) => onVerseLayout(item.v, e.nativeEvent.layout.y)}
              style={[
                styles.verseRow,
                flash && { backgroundColor: colors.surfaceSecondary },
              ]}
            >
              <Text
                style={[
                  styles.verseText,
                  { fontSize: vFontSize, lineHeight: vLineHeight },
                  hc ? { backgroundColor: colors[highlightKey(hc)] } : null,
                ]}
              >
                <Text style={styles.verseNum}>{item.v} </Text>
                {item.text}
              </Text>
            </Pressable>
          );
        })}

        {/* Chapter nav */}
        <View style={styles.navRow}>
          <Pressable
            testID="reader-prev"
            style={styles.navBtn}
            onPress={() => goChapter(-1)}
          >
            <Feather name="arrow-left" size={18} color={colors.onSurface} />
            <Text style={styles.navText}>Previous</Text>
          </Pressable>
          <Pressable
            testID="reader-next"
            style={styles.navBtn}
            onPress={() => goChapter(1)}
          >
            <Text style={styles.navText}>Next</Text>
            <Feather name="arrow-right" size={18} color={colors.onSurface} />
          </Pressable>
        </View>
      </ScrollView>

      {/* Font size floating pill */}
      <Pressable
        testID="reader-settings-pill"
        style={[styles.floatingPill, { bottom: insets.bottom + spacing.xl }]}
        onPress={() => settingsSheet.current?.present()}
      >
        <Text style={styles.floatingA}>Aa</Text>
      </Pressable>

      {/* Verse actions sheet */}
      <BottomSheetModal
        ref={verseSheet}
        enableDynamicSizing
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.borderStrong }}
      >
        <BottomSheetView style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]}>
          <Text style={styles.sheetRef}>
            {loc.book} {loc.chapter}:{selected?.verse}
          </Text>
          <Text style={styles.sheetVerse} numberOfLines={4}>
            {selected?.text}
          </Text>

          <Text style={styles.sheetSectionLabel}>HIGHLIGHT</Text>
          <View style={styles.swatchRow}>
            {HIGHLIGHTS.map((h) => {
              const active = selectedHighlight === h.id;
              return (
                <Pressable
                  key={h.id}
                  testID={`highlight-${h.id}`}
                  onPress={() => doHighlight(h.id)}
                  style={[
                    styles.swatch,
                    { backgroundColor: colors[h.key] },
                    active && { borderColor: colors.onSurface, borderWidth: 2 },
                  ]}
                >
                  {active && <Feather name="check" size={18} color={colors.onSurface} />}
                </Pressable>
              );
            })}
            <Pressable
              testID="highlight-none"
              onPress={() => doHighlight(null)}
              style={[styles.swatch, styles.swatchNone, { borderColor: colors.borderStrong }]}
            >
              <Feather name="slash" size={18} color={colors.onSurfaceTertiary} />
            </Pressable>
          </View>

          <View style={styles.actionRow}>
            <Pressable testID="verse-copy" style={styles.actionBtn} onPress={doCopy}>
              <Feather name="copy" size={18} color={colors.onSurface} />
              <Text style={styles.actionText}>Copy</Text>
            </Pressable>
            <Pressable testID="verse-bookmark" style={styles.actionBtn} onPress={doBookmark}>
              <Feather
                name="bookmark"
                size={18}
                color={selectedBookmarked ? colors.brand : colors.onSurface}
              />
              <Text
                style={[
                  styles.actionText,
                  selectedBookmarked && { color: colors.brand },
                ]}
              >
                {selectedBookmarked ? 'Saved' : 'Save'}
              </Text>
            </Pressable>
            <Pressable testID="verse-share" style={styles.actionBtn} onPress={openShare}>
              <Feather name="share-2" size={18} color={colors.onSurface} />
              <Text style={styles.actionText}>Share</Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      {/* Settings sheet */}
      <BottomSheetModal
        ref={settingsSheet}
        enableDynamicSizing
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.borderStrong }}
      >
        <BottomSheetView style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]}>
          <Text style={styles.sheetSectionLabel}>TRANSLATION</Text>
          <View style={styles.segment}>
            {TRANSLATIONS.map((t) => {
              const active = translation === t.id;
              return (
                <Pressable
                  key={t.id}
                  testID={`translation-${t.id}`}
                  onPress={() => {
                    setTranslation(t.id as Translation);
                    Haptics.selectionAsync().catch(() => {});
                  }}
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
                    {t.label}
                  </Text>
                  <Text
                    style={[
                      styles.segmentSub,
                      { color: active ? colors.onSurfaceInverse : colors.onSurfaceTertiary },
                    ]}
                  >
                    {t.full}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.sheetSectionLabel, { marginTop: spacing.xl }]}>
            TEXT SIZE
          </Text>
          <View style={styles.fontRow}>
            <Pressable
              testID="font-decrease"
              style={styles.fontBtn}
              onPress={() => setFontScale(Math.max(0.85, +(fontScale - 0.1).toFixed(2)))}
            >
              <Text style={[styles.fontBtnText, { fontSize: 16 }]}>A</Text>
            </Pressable>
            <View style={styles.fontPreview}>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${((fontScale - 0.85) / (1.5 - 0.85)) * 100}%` },
                  ]}
                />
              </View>
            </View>
            <Pressable
              testID="font-increase"
              style={styles.fontBtn}
              onPress={() => setFontScale(Math.min(1.5, +(fontScale + 0.1).toFixed(2)))}
            >
              <Text style={[styles.fontBtnText, { fontSize: 26 }]}>A</Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      {/* Share sheet — renders a verse card and shares it as an image */}
      <BottomSheetModal
        ref={shareSheet}
        enableDynamicSizing
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.borderStrong }}
      >
        <BottomSheetView style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]}>
          <Text style={styles.sheetSectionLabel}>SHARE THIS VERSE</Text>
          <View ref={cardRef} collapsable={false} style={styles.shareCard}>
            <Feather name="feather" size={22} color={colors.brand} />
            <Text style={styles.shareVerse}>{selected?.text}</Text>
            <Text style={styles.shareRef}>
              {loc.book} {loc.chapter}:{selected?.verse}
            </Text>
            <View style={styles.shareFooter}>
              <View style={styles.shareDot} />
              <Text style={styles.shareBrand}>Logos · {translation}</Text>
            </View>
          </View>

          <Pressable testID="share-image-button" style={styles.shareBtn} onPress={doShareImage}>
            <Feather name="share-2" size={18} color={colors.onBrand} />
            <Text style={styles.shareBtnText}>Share image</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

function highlightKey(c: HighlightColor): 'highlightYellow' | 'highlightRed' | 'highlightGreen' {
  return c === 'yellow' ? 'highlightYellow' : c === 'red' ? 'highlightRed' : 'highlightGreen';
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.surface },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: c.divider,
    },
    iconBtn: {
      width: 44,
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
    transPill: {
      minWidth: 44,
      height: 32,
      paddingHorizontal: spacing.md,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceSecondary,
    },
    transPillText: {
      fontFamily: fonts.sans.semibold,
      fontSize: typeScale.sm,
      color: c.onSurface,
    },
    verseRow: {
      borderRadius: radius.sm,
      marginBottom: spacing.xs,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xs,
    },
    verseText: {
      fontFamily: fonts.serif.regular,
      color: c.onSurface,
    },
    verseNum: {
      fontFamily: fonts.sans.semibold,
      fontSize: typeScale.sm,
      color: c.brand,
    },
    navRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.xxl,
      gap: spacing.md,
    },
    navBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.lg,
      borderRadius: radius.md,
      backgroundColor: c.surfaceSecondary,
    },
    navText: {
      fontFamily: fonts.sans.medium,
      fontSize: typeScale.base,
      color: c.onSurface,
    },
    floatingPill: {
      position: 'absolute',
      right: spacing.xl,
      width: 52,
      height: 52,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceInverse,
    },
    floatingA: {
      fontFamily: fonts.serif.semibold,
      fontSize: 20,
      color: c.onSurfaceInverse,
    },
    sheet: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.sm,
    },
    sheetRef: {
      fontFamily: fonts.sans.semibold,
      fontSize: typeScale.base,
      color: c.brand,
      marginBottom: spacing.sm,
    },
    sheetVerse: {
      fontFamily: fonts.serif.regular,
      fontSize: typeScale.lg,
      lineHeight: 26,
      color: c.onSurface,
      marginBottom: spacing.xl,
    },
    sheetSectionLabel: {
      fontFamily: fonts.sans.semibold,
      fontSize: 11,
      letterSpacing: 1.5,
      color: c.onSurfaceTertiary,
      marginBottom: spacing.md,
    },
    swatchRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.xl,
    },
    swatch: {
      width: 52,
      height: 52,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    swatchNone: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
    },
    actionRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    actionBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.lg,
      borderRadius: radius.md,
      backgroundColor: c.surfaceSecondary,
    },
    actionText: {
      fontFamily: fonts.sans.medium,
      fontSize: typeScale.base,
      color: c.onSurface,
    },
    segment: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    segmentBtn: {
      flex: 1,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      backgroundColor: c.surfaceSecondary,
    },
    segmentText: {
      fontFamily: fonts.sans.semibold,
      fontSize: typeScale.lg,
    },
    segmentSub: {
      fontFamily: fonts.sans.regular,
      fontSize: typeScale.sm,
      marginTop: 2,
    },
    fontRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
    },
    fontBtn: {
      width: 52,
      height: 52,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceSecondary,
    },
    fontBtnText: {
      fontFamily: fonts.serif.semibold,
      color: c.onSurface,
    },
    fontPreview: { flex: 1 },
    track: {
      height: 4,
      borderRadius: radius.pill,
      backgroundColor: c.surfaceTertiary,
      overflow: 'hidden',
    },
    fill: {
      height: 4,
      borderRadius: radius.pill,
      backgroundColor: c.brand,
    },
    shareCard: {
      backgroundColor: c.surfaceSecondary,
      borderRadius: radius.lg,
      padding: spacing.xl,
      marginBottom: spacing.xl,
    },
    shareVerse: {
      fontFamily: fonts.serif.medium,
      fontSize: 22,
      lineHeight: 34,
      color: c.onSurface,
      marginTop: spacing.lg,
    },
    shareRef: {
      fontFamily: fonts.sans.semibold,
      fontSize: typeScale.base,
      color: c.brand,
      marginTop: spacing.lg,
    },
    shareFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: spacing.xl,
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: c.divider,
    },
    shareDot: {
      width: 8,
      height: 8,
      borderRadius: radius.pill,
      backgroundColor: c.brand,
    },
    shareBrand: {
      fontFamily: fonts.sans.medium,
      fontSize: typeScale.sm,
      color: c.onSurfaceTertiary,
      letterSpacing: 0.5,
    },
    shareBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.lg,
      borderRadius: radius.md,
      backgroundColor: c.brand,
    },
    shareBtnText: {
      fontFamily: fonts.sans.semibold,
      fontSize: typeScale.lg,
      color: c.onBrand,
    },
  });
