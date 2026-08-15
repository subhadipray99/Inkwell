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

## Implemented — v1 (2026-06-15)
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

## Implemented — v2 (2026-06-15)
- **Quick Jump**: reference box on Home ("John 3:16", "ps 23", "1 john 2") -> opens passage; invalid input toasts. Parser in `src/lib/reference.ts` with alias map.
- **Verse Sharing**: reader share sheet renders a styled verse card and exports it via react-native-view-shot + expo-sharing (native share; web renders card only).
- **Learn tab** (new bottom tab): 5 original explainer articles, introductions to all 66 books (theme/author/date/summary + "Read this book"), and Easton's Bible Dictionary (1897, public domain, 3,963 searchable entries). Data in `src/data/learn.ts` + `src/data/dictionary.json`.
- **Highlights View**: Saved tab now has Bookmarks | Highlights toggle; highlights listed with colored background, jump, and remove.
- **Navigation change**: tabs are Home, Read, Learn, Search, Saved; Progress moved to a pushed `/progress` screen from Home's progress card.
- Testing agent: iteration 2 — all 4 new features + nav change pass 100%.


## Backlog (prioritized)
- **P2**: Reading plans / daily plan; per-book completion list; audio reading; more translations (ASV/BBE from same repo).
- **P2**: Bookmark folders/notes; export bookmarks; share verse card styling themes; link cross-references in dictionary entries.

## Next Tasks
- Await user feedback. Candidate delights: reading plans, cross-reference links in the dictionary, and customizable share-card backgrounds.
