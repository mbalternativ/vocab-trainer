"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { finalizeImport, runOcrAndPopulateImportItems, uploadImportImage } from "@/domain/import/import.service";

const finalizeImportSchema = z.object({
  importId: z.string().uuid().or(z.string().min(1)),
});

export type UploadImportActionState = {
  ok: boolean;
  message: string;
  importId?: string;
  previewUrl?: string | null;
  imagePath?: string;
  fileName?: string;
  ocrReady?: boolean;
};

export async function uploadImportImageAction(
  _prevState: UploadImportActionState,
  formData: FormData,
): Promise<UploadImportActionState> {
  const fileEntry = formData.get("image");

  if (!(fileEntry instanceof File)) {
    return { ok: false, message: "Please choose an image file." };
  }

  try {
    const result = await uploadImportImage(fileEntry);
    revalidatePath("/import");

    return {
      ok: true,
      message: `Upload complete. Import ${result.importId} is ready for OCR preparation.`,
      importId: result.importId,
      previewUrl: result.previewUrl,
      imagePath: result.imagePath,
      fileName: result.fileName,
      ocrReady: result.ocrPreparation.status === "ready",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not upload the image.",
    };
  }
}

export async function finalizeImportAction(input: unknown) {
  const parsed = finalizeImportSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten() };
  }

  try {
    const result = await finalizeImport(parsed.data.importId);
    revalidatePath("/import");
    revalidatePath("/vocabulary");
    return { ok: true as const, data: result };
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : "Could not finalize import.",
    };
  }
}


export async function runOcrForImportAction(input: unknown) {
  const parsed = finalizeImportSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten() };
  }

  try {
    const result = await runOcrAndPopulateImportItems(parsed.data.importId);
    revalidatePath("/import");
    return { ok: true as const, data: result };
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : "Could not run OCR for this import.",
    };
  }
}
