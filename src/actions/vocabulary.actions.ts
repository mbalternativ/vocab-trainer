"use server";

import { revalidatePath } from "next/cache";
import { createVocabulary, deleteVocabulary, updateVocabulary } from "@/domain/vocabulary/vocabulary.service";
import { vocabularySchema, vocabularyUpdateSchema } from "@/domain/vocabulary/vocabulary.schemas";

export async function createVocabularyAction(input: unknown) {
  const parsed = vocabularySchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten() };
  }

  try {
    const data = await createVocabulary(parsed.data);
    revalidatePath("/vocabulary");
    revalidatePath("/dashboard");
    return { ok: true as const, data };
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : "Could not create vocabulary item.",
    };
  }
}

export async function updateVocabularyAction(id: string, input: unknown) {
  const parsed = vocabularyUpdateSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten() };
  }

  try {
    const data = await updateVocabulary(id, parsed.data);
    revalidatePath("/vocabulary");
    revalidatePath(`/vocabulary/${id}`);
    return { ok: true as const, data };
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : "Could not update vocabulary item.",
    };
  }
}

export async function deleteVocabularyAction(id: string) {
  try {
    await deleteVocabulary(id);
    revalidatePath("/vocabulary");
    revalidatePath("/dashboard");
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : "Could not delete vocabulary item.",
    };
  }
}
