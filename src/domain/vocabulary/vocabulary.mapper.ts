import type { Database } from "@/types/database";
import type { VocabularyItem } from "./vocabulary.types";

type VocabularyRow = Database["public"]["Tables"]["vocabulary"]["Row"];

export function mapVocabularyRow(row: VocabularyRow): VocabularyItem {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    english: row.english,
    german: row.german,
    ipa: row.ipa,
    exampleSentence: row.example_sentence,
    partOfSpeech: row.part_of_speech,
    difficulty: row.difficulty,
    audioUrl: row.audio_url,
    customAudioPath: row.custom_audio_path,
    sourceType: row.source_type,
  };
}
