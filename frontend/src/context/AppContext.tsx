// Global app state — all persistence is local (AsyncStorage via @/src/utils/storage).
// Objects/arrays are JSON-string encoded so they fit the storage value contract.

import * as SplashScreen from 'expo-splash-screen';
import dayjs from 'dayjs';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { storage } from '@/src/utils/storage';
import { Translation } from '@/src/lib/bible';
import {
  darkColors,
  fonts,
  lightColors,
  radius,
  spacing,
  ThemeColors,
  type as typeScale,
} from '@/src/theme/tokens';

export type HighlightColor = 'yellow' | 'red' | 'green';
export type LastRead = { book: string; chapter: number; verse: number } | null;
export type Bookmark = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  savedAt: string;
};
export type Streak = { count: number; lastVisitDate: string };
type Highlights = Record<string, HighlightColor>;

// --- storage helpers for objects/arrays ---
const loadJSON = async <T,>(key: string, fallback: T): Promise<T> => {
  const raw = await storage.getItem(key, '');
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};
const saveJSON = (key: string, val: unknown) =>
  storage.setItem(key, JSON.stringify(val));

const KEY = {
  dark: 'theme_dark',
  translation: 'translation',
  bookmarks: 'bookmarks',
  highlights: 'highlights',
  lastRead: 'lastRead',
  visited: 'chaptersVisited',
  streak: 'streak',
  fontScale: 'fontScale',
  votd: 'votd',
};

type Ctx = {
  ready: boolean;
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  translation: Translation;
  setTranslation: (t: Translation) => void;
  bookmarks: Bookmark[];
  isBookmarked: (book: string, chapter: number, verse: number) => boolean;
  toggleBookmark: (b: Omit<Bookmark, 'savedAt'>) => void;
  removeBookmark: (savedAt: string) => void;
  highlights: Highlights;
  setHighlight: (book: string, chapter: number, verse: number, color: HighlightColor | null) => void;
  lastRead: LastRead;
  visited: string[];
  streak: Streak;
  recordVisit: (book: string, chapter: number, verse: number) => void;
  fontScale: number;
  setFontScale: (n: number) => void;
  showToast: (msg: string, icon?: keyof typeof Feather.glyphMap) => void;
};

const AppContext = createContext<Ctx | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

const refKey = (b: string, c: number, v: number) => `${b}|${c}|${v}`;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [translation, setTranslationState] = useState<Translation>('KJV');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [highlights, setHighlights] = useState<Highlights>({});
  const [lastRead, setLastRead] = useState<LastRead>(null);
  const [visited, setVisited] = useState<string[]>([]);
  const [streak, setStreak] = useState<Streak>({ count: 0, lastVisitDate: '' });
  const [fontScale, setFontScaleState] = useState(1);
  const [toast, setToast] = useState<{
    id: number;
    msg: string;
    icon: keyof typeof Feather.glyphMap;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const [d, t, bm, hl, lr, vs, sk, fs] = await Promise.all([
        storage.getItem(KEY.dark, false),
        storage.getItem(KEY.translation, 'KJV'),
        loadJSON<Bookmark[]>(KEY.bookmarks, []),
        loadJSON<Highlights>(KEY.highlights, {}),
        loadJSON<LastRead>(KEY.lastRead, null),
        loadJSON<string[]>(KEY.visited, []),
        loadJSON<Streak>(KEY.streak, { count: 0, lastVisitDate: '' }),
        storage.getItem(KEY.fontScale, 1),
      ]);
      setIsDark(!!d);
      setTranslationState((t as Translation) || 'KJV');
      setBookmarks(bm);
      setHighlights(hl);
      setLastRead(lr);
      setVisited(vs);
      setFontScaleState(fs || 1);

      // Streak — increments once per calendar day, resets after a missed day.
      const today = dayjs().format('YYYY-MM-DD');
      let next = sk;
      if (sk.lastVisitDate !== today) {
        const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
        next = {
          count: sk.lastVisitDate === yesterday ? sk.count + 1 : 1,
          lastVisitDate: today,
        };
        saveJSON(KEY.streak, next);
      }
      setStreak(next);
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      storage.setItem(KEY.dark, next);
      return next;
    });
  }, []);

  const setTranslation = useCallback((t: Translation) => {
    setTranslationState(t);
    storage.setItem(KEY.translation, t);
  }, []);

  const setFontScale = useCallback((n: number) => {
    setFontScaleState(n);
    storage.setItem(KEY.fontScale, n);
  }, []);

  const isBookmarked = useCallback(
    (book: string, chapter: number, verse: number) =>
      bookmarks.some(
        (b) => b.book === book && b.chapter === chapter && b.verse === verse,
      ),
    [bookmarks],
  );

  const toggleBookmark = useCallback((b: Omit<Bookmark, 'savedAt'>) => {
    setBookmarks((prev) => {
      const exists = prev.find(
        (x) => x.book === b.book && x.chapter === b.chapter && x.verse === b.verse,
      );
      const next = exists
        ? prev.filter((x) => x !== exists)
        : [{ ...b, savedAt: new Date().toISOString() }, ...prev];
      saveJSON(KEY.bookmarks, next);
      return next;
    });
  }, []);

  const removeBookmark = useCallback((savedAt: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((x) => x.savedAt !== savedAt);
      saveJSON(KEY.bookmarks, next);
      return next;
    });
  }, []);

  const setHighlight = useCallback(
    (book: string, chapter: number, verse: number, color: HighlightColor | null) => {
      setHighlights((prev) => {
        const k = refKey(book, chapter, verse);
        const next = { ...prev };
        if (color) next[k] = color;
        else delete next[k];
        saveJSON(KEY.highlights, next);
        return next;
      });
    },
    [],
  );

  const recordVisit = useCallback(
    (book: string, chapter: number, verse: number) => {
      const lr = { book, chapter, verse };
      setLastRead(lr);
      saveJSON(KEY.lastRead, lr);
      const id = `${book}-${chapter}`;
      setVisited((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        saveJSON(KEY.visited, next);
        return next;
      });
    },
    [],
  );

  const toastId = useRef(0);
  const showToast = useCallback(
    (msg: string, icon: keyof typeof Feather.glyphMap = 'check') => {
      toastId.current += 1;
      setToast({ id: toastId.current, msg, icon });
    },
    [],
  );

  const value = useMemo<Ctx>(
    () => ({
      ready,
      isDark,
      colors,
      toggleTheme,
      translation,
      setTranslation,
      bookmarks,
      isBookmarked,
      toggleBookmark,
      removeBookmark,
      highlights,
      setHighlight,
      lastRead,
      visited,
      streak,
      recordVisit,
      fontScale,
      setFontScale,
      showToast,
    }),
    [
      ready,
      isDark,
      colors,
      toggleTheme,
      translation,
      setTranslation,
      bookmarks,
      isBookmarked,
      toggleBookmark,
      removeBookmark,
      highlights,
      setHighlight,
      lastRead,
      visited,
      streak,
      recordVisit,
      fontScale,
      setFontScale,
      showToast,
    ],
  );

  return (
    <AppContext.Provider value={value}>
      {ready ? children : null}
      <Toast toast={toast} colors={colors} onDone={() => setToast(null)} />
    </AppContext.Provider>
  );
}

function Toast({
  toast,
  colors,
  onDone,
}: {
  toast: { id: number; msg: string; icon: keyof typeof Feather.glyphMap } | null;
  colors: ThemeColors;
  onDone: () => void;
}) {
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (!toast) return;
    opacity.value = withTiming(1, { duration: 220, easing: Easing.out(Easing.quad) });
    translateY.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.quad) });
    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 260 });
      translateY.value = withTiming(20, { duration: 260 }, (finished) => {
        if (finished) runOnJS(onDone)();
      });
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast?.id]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!toast) return null;

  return (
    <View
      style={[styles.toastWrap, { bottom: insets.bottom + 90, pointerEvents: 'none' }]}
    >
      <Animated.View
        style={[
          styles.toast,
          { backgroundColor: colors.surfaceInverse },
          style,
        ]}
      >
        <Feather name={toast.icon} size={16} color={colors.onSurfaceInverse} />
        <Text
          style={[
            styles.toastText,
            { color: colors.onSurfaceInverse },
          ]}
        >
          {toast.msg}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  toastWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  toastText: {
    fontFamily: fonts.sans.medium,
    fontSize: typeScale.base,
  },
});
