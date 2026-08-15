# Logos — Offline-First Bible Reading App (PRD)

## Original Problem Statement
Build a minimal, offline-first Bible reading app. No backend, no database, no authentication — a static/client-only app. All persistence in the device's local storage (AsyncStorage). Full Bible text (66 books, 1,189 chapters, ~31,100 verses) bundled as static JSON per translation (indexed book -> chapter -> array of verses), sourced from the seven1m/open-bibles public-domain repo. Translations: KJV + WEB. Core features: Browse, Search, Translation switcher, Verse of the Day (one network call/day, cached), Bookmarks, Reading progress (lastRead / chaptersVisited / streak), Dark mode. Design: calm, typography-first, warm palette, serif scripture + sans UI. Out of scope: accounts, servers, payments, analytics, cross-device sync.

## Architecture
- **Frontend only**: Expo Router (SDK 54), React Native. No backend/DB provisioned (unused template backend left untouched).
- **Data**: `src/data/kjv.json` + `src/data/web.json` (~4MB each, parsed via clean OSIS/USFX conversion from open-bibles), `src/data/books.json` (metadata). Loaded lazily via `require` in `src/lib/bible.ts`.
- **State/persistence**: `src/context/AppContext.tsx` (React Context) + `@/src/utils/storage` (AsyncStorage). Keys: theme_dark, translation, bookmarks, highlights, lastRead, chaptersVisited, streak, fontScale, votd.
- **Design system**: `src/theme/tokens.ts` — warm cream light / soft dark-gray dark, Lora serif (scripture), DM Sans (UI). Fonts bundled in `assets/fonts` (loaded with expo-font).
- **Navigation**: bottom tabs `(tabs)`: Home, Read, Search, Saved, Progress. Stack routes: `chapters`, `reader`.
- **Libraries**: @gorhom/bottom-sheet (verse actions + settings), reanimated (toast), expo-clipboard, expo-haptics, expo-image, expo-linear-gradient.

## User Personas
- Daily devotional reader who wants a calm, distraction-free scripture experience offline.
- Study reader who highlights, copies, and bookmarks verses and tracks reading progress.

## Core Requirements (static)
1. Browse Book -> Chapter -> Verse with app-like transitions.
2. Client-side search across bundled text.
3. KJV/WEB translation switch without losing place.
4. Verse of the Day fetched at most once/day, cached by date.
5. Bookmarks (save/list newest-first/jump/remove).
6. Reading progress: Continue Reading, completion % of 1189, daily streak.
7. Dark mode persisted, no flash of wrong theme.
8. Verse highlighting (yellow/red/green) + copy to clipboard.

## Implemented (2026-06-15)
- Full KJV + WEB bundled offline (66/1189/31102 each, verified).
- Home: VOTD hero (live API + daily cache + fallback), Continue/Start Reading, progress + streak stat cards, theme toggle.
- Read library with OT/NT toggle; chapter grid with visited highlighting; reader with serif verses, auto-scroll-to-verse, prev/next across book boundaries, translation pill, floating text-size pill.
- Verse-action bottom sheet: highlight (yellow/red/green/none), copy, save. Settings sheet: translation + font size.
- Search with debounce, match emphasis, empty/no-results/loading states.
- Bookmarks screen (newest-first, jump, remove) with empty state.
- Progress screen: big completion %, OT/NT breakdown, streak + saved metrics.
- Dark mode persisted; splash held until storage loads (no theme flash).
- Streak increments once/calendar day, resets on missed day.
- Toast confirmations + haptics on save/highlight/copy/tab press.
- Testing agent: 14/14 flows pass.

## Backlog (prioritized)
- **P1**: Verse-of-the-day share as image; adjustable line-spacing; jump-to-reference quick input.
- **P2**: Reading plans / daily plan; per-book completion list; audio reading; more translations (ASV/BBE from same repo).
- **P2**: Bookmark folders/notes; highlights list view; export bookmarks.

## Next Tasks
- Await user feedback; consider verse sharing (image/card) and a highlights-only view as next delights.
