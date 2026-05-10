import type { VocabularyItem } from "@/domain/vocabulary/vocabulary.types";
import type { TrainingQuestion } from "./training.types";

export function buildFlashcardQuestions(items: VocabularyItem[]): TrainingQuestion[] {
  return items.map((item) => ({
    id: `q-${item.id}`,
    vocabularyId: item.id,
    type: "flashcard",
    prompt: item.english,
    answer: item.german,
  }));
}
