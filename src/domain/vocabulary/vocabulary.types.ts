export type VocabularyItem = {
  id: string;
  lessonId: string | null;
  english: string;
  german: string;
  ipa: string | null;
  exampleSentence: string | null;
  partOfSpeech: string | null;
  difficulty: number;
  audioUrl: string | null;
  customAudioPath: string | null;
  sourceType: "manual" | "import" | "audio";
};

export type VocabularyFilters = {
  lessonId?: string;
  search?: string;
  limit?: number;
};

export type CreateVocabularyInput = {
  lessonId?: string | null;
  english: string;
  german: string;
  ipa?: string | null;
  exampleSentence?: string | null;
  partOfSpeech?: string | null;
  difficulty?: number;
  audioUrl?: string | null;
  customAudioPath?: string | null;
  sourceType?: "manual" | "import" | "audio";
  isPublished?: boolean;
};

export type UpdateVocabularyInput = Partial<CreateVocabularyInput>;
