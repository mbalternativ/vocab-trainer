import { createClient } from "@/lib/supabase/server";
import type { Database, TableInsert, TableUpdate } from "@/types/database";
import { mapVocabularyRow } from "./vocabulary.mapper";
import type {
  CreateVocabularyInput,
  UpdateVocabularyInput,
  VocabularyFilters,
  VocabularyItem,
} from "./vocabulary.types";

const fallbackVocabulary: VocabularyItem[] = [
  {
    id: "demo-1",
    lessonId: "unit-1",
    english: "apple",
    german: "Apfel",
    ipa: "/ˈæp.əl/",
    exampleSentence: "I eat an apple every day.",
    partOfSpeech: "noun",
    difficulty: 1,
    audioUrl: null,
    customAudioPath: null,
    sourceType: "manual",
  },
  {
    id: "demo-2",
    lessonId: "unit-1",
    english: "school",
    german: "Schule",
    ipa: "/skuːl/",
    exampleSentence: "The school is near the park.",
    partOfSpeech: "noun",
    difficulty: 1,
    audioUrl: null,
    customAudioPath: null,
    sourceType: "manual",
  },
  {
    id: "demo-3",
    lessonId: "unit-2",
    english: "bread",
    german: "Brot",
    ipa: "/bred/",
    exampleSentence: "We need some bread for breakfast.",
    partOfSpeech: "noun",
    difficulty: 1,
    audioUrl: null,
    customAudioPath: null,
    sourceType: "manual",
  },
];

type VocabularyRow = Database["public"]["Tables"]["vocabulary"]["Row"];

function toInsertPayload(input: CreateVocabularyInput): TableInsert<"vocabulary"> {
  return {
    lesson_id: input.lessonId ?? null,
    english: input.english,
    german: input.german,
    ipa: input.ipa ?? null,
    example_sentence: input.exampleSentence ?? null,
    part_of_speech: input.partOfSpeech ?? null,
    difficulty: input.difficulty ?? 1,
    audio_url: input.audioUrl ?? null,
    custom_audio_path: input.customAudioPath ?? null,
    source_type: input.sourceType ?? "manual",
    is_published: input.isPublished ?? true,
  };
}

function toUpdatePayload(input: UpdateVocabularyInput): TableUpdate<"vocabulary"> {
  return {
    lesson_id: input.lessonId,
    english: input.english,
    german: input.german,
    ipa: input.ipa,
    example_sentence: input.exampleSentence,
    part_of_speech: input.partOfSpeech,
    difficulty: input.difficulty,
    audio_url: input.audioUrl,
    custom_audio_path: input.customAudioPath,
    source_type: input.sourceType,
    is_published: input.isPublished,
  };
}

export async function getVocabularyList(filters: VocabularyFilters = {}): Promise<VocabularyItem[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("vocabulary")
      .select("*")
      .eq("is_published", true)
      .order("english", { ascending: true });

    if (filters.lessonId) {
      query = query.eq("lesson_id", filters.lessonId);
    }

    if (filters.search) {
      const term = filters.search.trim();
      if (term) {
        query = query.or(`english.ilike.%${term}%,german.ilike.%${term}%`);
      }
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error || !data) {
      return fallbackVocabulary;
    }

    return data.map(mapVocabularyRow);
  } catch {
    return fallbackVocabulary;
  }
}

export async function getVocabularyById(id: string): Promise<VocabularyItem | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vocabulary")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return fallbackVocabulary.find((item) => item.id === id) ?? null;
    }

    return mapVocabularyRow(data as VocabularyRow);
  } catch {
    return fallbackVocabulary.find((item) => item.id === id) ?? null;
  }
}

export async function createVocabulary(input: CreateVocabularyInput): Promise<VocabularyItem> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vocabulary")
    .insert(toInsertPayload(input))
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not create vocabulary item.");
  }

  return mapVocabularyRow(data as VocabularyRow);
}

export async function updateVocabulary(id: string, input: UpdateVocabularyInput): Promise<VocabularyItem> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vocabulary")
    .update(toUpdatePayload(input))
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not update vocabulary item.");
  }

  return mapVocabularyRow(data as VocabularyRow);
}

export async function deleteVocabulary(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("vocabulary").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
