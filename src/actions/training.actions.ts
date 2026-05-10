"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { saveTrainingAnswer } from "@/domain/progress/progress.service";

const saveTrainingAnswerSchema = z.object({
  vocabularyId: z.string().uuid().or(z.string().min(1)),
  isCorrect: z.boolean(),
  mode: z.enum(["flashcard", "multiple_choice", "text_input", "challenge"]).optional(),
});

export async function saveTrainingAnswerAction(input: unknown) {
  const parsed = saveTrainingAnswerSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten() };
  }

  try {
    const data = await saveTrainingAnswer(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/progress");
    return data;
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : "Could not save training answer.",
    };
  }
}
