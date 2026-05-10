import { z } from "zod";

export const vocabularySchema = z.object({
  english: z.string().trim().min(1),
  german: z.string().trim().min(1),
  ipa: z.string().trim().nullable().optional(),
  exampleSentence: z.string().trim().nullable().optional(),
  partOfSpeech: z.string().trim().nullable().optional(),
  lessonId: z.string().uuid().nullable().optional(),
  difficulty: z.coerce.number().int().min(1).max(5).default(1),
  audioUrl: z.string().url().nullable().optional(),
  customAudioPath: z.string().trim().nullable().optional(),
  sourceType: z.enum(["manual", "import", "audio"]).default("manual"),
  isPublished: z.boolean().default(true),
});

export const vocabularyUpdateSchema = vocabularySchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be updated",
);
