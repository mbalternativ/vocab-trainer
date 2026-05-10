import { NextRequest, NextResponse } from "next/server";
import { runOcrAndPopulateImportItems } from "@/domain/import/import.service";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;

  try {
    const result = await runOcrAndPopulateImportItems(params.id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not run OCR for this import." },
      { status: 500 },
    );
  }
}
