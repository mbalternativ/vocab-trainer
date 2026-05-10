import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";
import { extractTextFromImageUrl } from "./ocr.service";
import { parseRawVocabularyText } from "./parser.service";
import type {
  FinalizeImportResult,
  ImportItem,
  ImportJob,
  OcrPreparation,
  OcrRunResult,
  UploadImportImageResult,
} from "./import.types";

type ImportItemRow = Database["public"]["Tables"]["import_items"]["Row"];
type ImportRow = Database["public"]["Tables"]["imports"]["Row"];

function getImportsBucketName() {
  return process.env.NEXT_PUBLIC_SUPABASE_IMPORTS_BUCKET || "import-images";
}

function mapImportItemRow(row: ImportItemRow): ImportItem {
  return {
    id: row.id,
    importId: row.import_id,
    english: row.english ?? "",
    german: row.german ?? "",
    ipa: row.ipa,
    exampleSentence: row.example_sentence,
    partOfSpeech: row.part_of_speech,
    isApproved: row.is_approved,
    sortOrder: row.sort_order,
  };
}

async function createSignedPreviewUrl(path: string): Promise<string | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
      .from(getImportsBucketName())
      .createSignedUrl(path, 60 * 60);

    if (error) {
      return null;
    }

    return data.signedUrl;
  } catch {
    return null;
  }
}

function mapImportRow(row: ImportRow, previewUrl: string | null): ImportJob {
  return {
    id: row.id,
    imagePath: row.image_path,
    previewUrl,
    parseStatus: row.parse_status,
    reviewStatus: row.review_status,
    createdAt: row.created_at,
  };
}

export async function getImportPreview(importId?: string): Promise<ImportItem[]> {
  if (!importId) {
    return [
      { id: "imp-1", english: "apple", german: "Apfel", ipa: "/ˈæp.əl/", isApproved: true },
      { id: "imp-2", english: "teacher", german: "Lehrer/in", ipa: "/ˈtiː.tʃər/", isApproved: true },
    ];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("import_items")
    .select("*")
    .eq("import_id", importId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapImportItemRow);
}

export async function getImportJob(importId: string): Promise<ImportJob | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("imports").select("*").eq("id", importId).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const previewUrl = await createSignedPreviewUrl(data.image_path);
  return mapImportRow(data, previewUrl);
}

export async function getRecentImports(limit = 5): Promise<ImportJob[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("imports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  const rows = data ?? [];
  const previewUrls = await Promise.all(rows.map((row) => createSignedPreviewUrl(row.image_path)));

  return rows.map((row, index) => mapImportRow(row, previewUrls[index] ?? null));
}

export async function buildOcrPreparation(importId: string, imagePath: string, fileName: string, contentType: string): Promise<OcrPreparation> {
  const signedImageUrl = await createSignedPreviewUrl(imagePath);

  return {
    importId,
    imagePath,
    signedImageUrl,
    fileName,
    contentType,
    suggestedProvider: "google-vision",
    status: signedImageUrl ? "ready" : "missing-image-access",
  };
}

export async function uploadImportImage(file: File): Promise<UploadImportImageResult> {
  if (!file || file.size === 0) {
    throw new Error("Please choose an image file.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are supported.");
  }

  const maxFileSizeMb = 6;
  if (file.size > maxFileSizeMb * 1024 * 1024) {
    throw new Error(`Please upload an image smaller than ${maxFileSizeMb}MB.`);
  }

  const supabase = createAdminClient();
  const importId = randomUUID();
  const fileExtension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const imagePath = `manual/${importId}.${fileExtension}`;
  const bucket = getImportsBucketName();

  const { error: uploadError } = await supabase.storage.from(bucket).upload(imagePath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: importRow, error: insertError } = await supabase
    .from("imports")
    .insert({
      id: importId,
      image_path: imagePath,
      parse_status: "pending",
      review_status: "pending",
    })
    .select("*")
    .single();

  if (insertError) {
    await supabase.storage.from(bucket).remove([imagePath]);
    throw new Error(insertError.message);
  }

  const previewUrl = await createSignedPreviewUrl(imagePath);
  const ocrPreparation = await buildOcrPreparation(importId, imagePath, file.name, file.type || "image/jpeg");

  return {
    importId,
    imagePath,
    previewUrl,
    fileName: file.name,
    contentType: file.type || "image/jpeg",
    ocrPreparation,
  };
}

export async function finalizeImport(importId: string): Promise<FinalizeImportResult> {
  const supabase = await createClient();
  const { data: importItems, error: itemsError } = await supabase
    .from("import_items")
    .select("*")
    .eq("import_id", importId)
    .eq("is_approved", true)
    .order("sort_order", { ascending: true });

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  const approvedItems = (importItems ?? []).filter(
    (item: ImportItemRow) => Boolean(item.english && item.german),
  );
  if (approvedItems.length === 0) {
    throw new Error("No approved import items found.");
  }

  const vocabularyPayload = approvedItems.map((item: ImportItemRow) => ({
    english: item.english!,
    german: item.german!,
    ipa: item.ipa,
    example_sentence: item.example_sentence,
    part_of_speech: item.part_of_speech,
    source_type: "import" as const,
    is_published: true,
  }));

  const { error: insertError } = await supabase.from("vocabulary").insert(vocabularyPayload);

  if (insertError) {
    throw new Error(insertError.message);
  }

  const { error: updateImportError } = await supabase
    .from("imports")
    .update({ review_status: "imported" })
    .eq("id", importId);

  if (updateImportError) {
    throw new Error(updateImportError.message);
  }

  return {
    importId,
    importedCount: approvedItems.length,
  };
}


export async function runOcrAndPopulateImportItems(importId: string): Promise<OcrRunResult> {
  const supabase = createAdminClient();

  const { data: importRow, error: importError } = await supabase
    .from("imports")
    .select("*")
    .eq("id", importId)
    .maybeSingle();

  if (importError) {
    throw new Error(importError.message);
  }

  if (!importRow) {
    throw new Error("Import not found.");
  }

  const signedImageUrl = await createSignedPreviewUrl(importRow.image_path);
  if (!signedImageUrl) {
    throw new Error("Could not create signed image URL for OCR.");
  }

  const { error: processingError } = await supabase
    .from("imports")
    .update({ parse_status: "processing", error_message: null })
    .eq("id", importId);

  if (processingError) {
    throw new Error(processingError.message);
  }

  try {
    const ocrResult = await extractTextFromImageUrl(signedImageUrl);
    const parsedItems = parseRawVocabularyText(ocrResult.rawText);

    if (parsedItems.length === 0) {
      throw new Error("OCR text was found, but no vocabulary rows could be parsed.");
    }

    const { error: deleteError } = await supabase
      .from("import_items")
      .delete()
      .eq("import_id", importId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    const itemPayload = parsedItems.map((item, index) => ({
      import_id: importId,
      english: item.english || null,
      german: item.german || null,
      ipa: item.ipa ?? null,
      example_sentence: item.exampleSentence ?? null,
      part_of_speech: item.partOfSpeech ?? null,
      is_approved: Boolean(item.english && item.german && item.isApproved),
      sort_order: item.sortOrder ?? index,
    }));

    const { error: insertError } = await supabase.from("import_items").insert(itemPayload);
    if (insertError) {
      throw new Error(insertError.message);
    }

    const approvedCount = itemPayload.filter((item) => item.is_approved).length;
    const { error: updateError } = await supabase
      .from("imports")
      .update({
        ocr_raw_text: ocrResult.rawText,
        parse_status: "parsed",
        review_status: "pending",
        error_message: null,
      })
      .eq("id", importId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return {
      importId,
      provider: ocrResult.provider,
      rawText: ocrResult.rawText,
      parsedCount: itemPayload.length,
      approvedCount,
    };
  } catch (error) {
    await supabase
      .from("imports")
      .update({
        parse_status: "failed",
        error_message: error instanceof Error ? error.message : "OCR parsing failed.",
      })
      .eq("id", importId);

    throw error;
  }
}
