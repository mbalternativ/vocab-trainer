import type { ImportItem } from "./import.types";

function cleanCell(value: string | undefined): string {
  return (value ?? "")
    .replace(/^[-–—•*\d.)\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractIpa(line: string): { lineWithoutIpa: string; ipa: string | null } {
  const match = line.match(/(\/[^/]{1,80}\/|\[[^\]]{1,80}\])/);
  if (!match) {
    return { lineWithoutIpa: line, ipa: null };
  }

  return {
    lineWithoutIpa: line.replace(match[0], " ").replace(/\s+/g, " ").trim(),
    ipa: match[0],
  };
}

function parseLine(line: string, index: number): ImportItem | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length < 3) {
    return null;
  }

  const { lineWithoutIpa, ipa } = extractIpa(trimmed);

  const separators = [
    /\s+[–—-]\s+/, // word - translation
    /\s+=\s+/, // word = translation
    /\s+[:;]\s+/, // word: translation
    /\t+/, // table copy
    /\s{2,}/, // OCR table columns
  ];

  for (const separator of separators) {
    const parts = lineWithoutIpa.split(separator).map(cleanCell).filter(Boolean);
    if (parts.length >= 2) {
      const english = parts[0];
      const german = parts.slice(1).join("; ");

      return {
        id: `parsed-${index + 1}`,
        english,
        german,
        ipa,
        exampleSentence: null,
        partOfSpeech: null,
        isApproved: Boolean(english && german),
        sortOrder: index,
      };
    }
  }

  // Last-resort heuristic for rows like "apple Apfel". It only approves the
  // row if both sides look plausible after splitting around the middle.
  const tokens = lineWithoutIpa.split(/\s+/).map(cleanCell).filter(Boolean);
  if (tokens.length === 2) {
    return {
      id: `parsed-${index + 1}`,
      english: tokens[0],
      german: tokens[1],
      ipa,
      exampleSentence: null,
      partOfSpeech: null,
      isApproved: true,
      sortOrder: index,
    };
  }

  return {
    id: `parsed-${index + 1}`,
    english: cleanCell(lineWithoutIpa),
    german: "",
    ipa,
    exampleSentence: null,
    partOfSpeech: null,
    isApproved: false,
    sortOrder: index,
  };
}

export function parseRawVocabularyText(rawText: string): ImportItem[] {
  const normalized = rawText
    .replace(/\r/g, "\n")
    .replace(/[|]+/g, "\t")
    .split("\n")
    .flatMap((line) => line.split(/(?<=\w)\s{4,}(?=[A-Za-zÄÖÜäöüß])/))
    .map((line) => line.trim())
    .filter(Boolean);

  return normalized
    .map((line, index) => parseLine(line, index))
    .filter((item): item is ImportItem => Boolean(item));
}
