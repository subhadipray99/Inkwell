// Easton's Bible Dictionary (public domain, 1897). Loaded lazily.

export type DictEntry = { t: string; d: string };

let cache: DictEntry[] | null = null;

export function getDictionary(): DictEntry[] {
  if (!cache) {
    cache = require('@/src/data/dictionary.json') as DictEntry[];
  }
  return cache;
}

export function searchDictionary(query: string, limit = 60): DictEntry[] {
  const q = query.trim().toLowerCase();
  const data = getDictionary();
  if (!q) return data.slice(0, limit);
  const starts: DictEntry[] = [];
  const contains: DictEntry[] = [];
  for (const e of data) {
    const term = e.t.toLowerCase();
    if (term.startsWith(q)) starts.push(e);
    else if (term.includes(q)) contains.push(e);
    if (starts.length >= limit) break;
  }
  return [...starts, ...contains].slice(0, limit);
}

export function getEntry(term: string): DictEntry | undefined {
  return getDictionary().find((e) => e.t === term);
}
