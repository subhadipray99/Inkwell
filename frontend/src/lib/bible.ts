// Offline Bible data access. Full text bundled as static JSON (KJV + WEB),
// indexed book -> chapter -> array of verses. Translations are required lazily
// so the JS bundle only parses the ~4MB file the first time it's actually read.

import booksData from '@/src/data/books.json';

export type Testament = 'OT' | 'NT';
export type BookMeta = { name: string; chapters: number; testament: Testament };

export const BOOKS = booksData as BookMeta[];
export const TOTAL_CHAPTERS = 1189;

export type Translation = 'KJV' | 'WEB';
export const TRANSLATIONS: { id: Translation; label: string; full: string }[] = [
  { id: 'KJV', label: 'KJV', full: 'King James Version' },
  { id: 'WEB', label: 'WEB', full: 'World English Bible' },
];

type BibleData = Record<string, Record<string, string[]>>;

const cache: Partial<Record<Translation, BibleData>> = {};

export function getBible(t: Translation): BibleData {
  if (!cache[t]) {
    cache[t] = (
      t === 'KJV'
        ? require('@/src/data/kjv.json')
        : require('@/src/data/web.json')
    ) as BibleData;
  }
  return cache[t]!;
}

export function getChapter(t: Translation, book: string, chapter: number): string[] {
  return getBible(t)[book]?.[String(chapter)] ?? [];
}

export function getVerse(
  t: Translation,
  book: string,
  chapter: number,
  verse: number,
): string {
  return getChapter(t, book, chapter)[verse - 1] ?? '';
}

export function bookMeta(name: string): BookMeta | undefined {
  return BOOKS.find((b) => b.name === name);
}

export function bookIndex(name: string): number {
  return BOOKS.findIndex((b) => b.name === name);
}

// Compute the previous / next chapter across book boundaries.
export function adjacentChapter(
  book: string,
  chapter: number,
  dir: 1 | -1,
): { book: string; chapter: number } | null {
  const meta = bookMeta(book);
  if (!meta) return null;
  const target = chapter + dir;
  if (target >= 1 && target <= meta.chapters) return { book, chapter: target };
  const idx = bookIndex(book);
  const nextIdx = idx + dir;
  if (nextIdx < 0 || nextIdx >= BOOKS.length) return null;
  const nb = BOOKS[nextIdx];
  return { book: nb.name, chapter: dir === 1 ? 1 : nb.chapters };
}

export type SearchResult = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
};

export function searchVerses(
  t: Translation,
  query: string,
  limit = 150,
): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const data = getBible(t);
  const results: SearchResult[] = [];
  for (const book of BOOKS) {
    const chapters = data[book.name];
    if (!chapters) continue;
    for (const ch of Object.keys(chapters)) {
      const verses = chapters[ch];
      for (let i = 0; i < verses.length; i++) {
        const text = verses[i];
        if (text && text.toLowerCase().includes(q)) {
          results.push({ book: book.name, chapter: Number(ch), verse: i + 1, text });
          if (results.length >= limit) return results;
        }
      }
    }
  }
  return results;
}

export function verseRefKey(book: string, chapter: number, verse: number): string {
  return `${book}|${chapter}|${verse}`;
}
