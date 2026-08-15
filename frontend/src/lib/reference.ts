// Parse a free-text reference like "John 3:16", "1 john 2", "ps 23", "gen1:1"
// into { book, chapter, verse }. Returns null if the book can't be resolved.

import { BOOKS, bookMeta } from '@/src/lib/bible';

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// A few common abbreviations that don't resolve by simple startsWith.
const ALIASES: Record<string, string> = {
  gen: 'Genesis',
  ex: 'Exodus',
  exo: 'Exodus',
  lev: 'Leviticus',
  num: 'Numbers',
  deut: 'Deuteronomy',
  dt: 'Deuteronomy',
  josh: 'Joshua',
  jdg: 'Judges',
  ps: 'Psalms',
  psa: 'Psalms',
  psalm: 'Psalms',
  prov: 'Proverbs',
  eccl: 'Ecclesiastes',
  song: 'Song of Solomon',
  sos: 'Song of Solomon',
  isa: 'Isaiah',
  jer: 'Jeremiah',
  lam: 'Lamentations',
  ezek: 'Ezekiel',
  dan: 'Daniel',
  matt: 'Matthew',
  mt: 'Matthew',
  mk: 'Mark',
  lk: 'Luke',
  jn: 'John',
  rom: 'Romans',
  gal: 'Galatians',
  eph: 'Ephesians',
  phil: 'Philippians',
  col: 'Colossians',
  heb: 'Hebrews',
  jas: 'James',
  rev: 'Revelation',
};

export type ParsedRef = { book: string; chapter: number; verse: number };

export function parseReference(input: string): ParsedRef | null {
  const raw = input.trim();
  if (!raw) return null;

  // Split into a leading book portion and trailing "chapter[:.]verse".
  const m = raw.match(/^\s*([1-3]?\s*[A-Za-z][A-Za-z ]*?)\s*(\d+)?\s*[:.]?\s*(\d+)?\s*$/);
  if (!m) return null;

  const bookStr = m[1] || '';
  const chapterStr = m[2];
  const verseStr = m[3];
  const nBook = normalize(bookStr);
  if (!nBook) return null;

  let book: string | undefined;

  // exact normalized match
  book = BOOKS.find((b) => normalize(b.name) === nBook)?.name;
  // alias
  if (!book && ALIASES[nBook]) book = ALIASES[nBook];
  // startsWith (prefer shortest name so "john" beats "1 John")
  if (!book) {
    const matches = BOOKS.filter((b) => normalize(b.name).startsWith(nBook));
    if (matches.length) {
      matches.sort((a, b) => a.name.length - b.name.length);
      book = matches[0].name;
    }
  }
  // contains fallback
  if (!book) {
    book = BOOKS.find((b) => normalize(b.name).includes(nBook))?.name;
  }
  if (!book) return null;

  const meta = bookMeta(book);
  if (!meta) return null;

  let chapter = chapterStr ? Math.min(parseInt(chapterStr, 10), meta.chapters) : 1;
  if (chapter < 1) chapter = 1;
  let verse = verseStr ? Math.max(parseInt(verseStr, 10), 1) : 1;

  return { book, chapter, verse };
}
