import { NextRequest, NextResponse } from "next/server";
import { buildOcrPreparation, getImportJob } from "@/domain/import/import.service";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;

  try {
    const job = await getImportJob(params.id);

    if (!job) {
      return NextResponse.json({ error: "Import not found." }, { status: 404 });
    }

    const fileName = job.imagePath.split("/").pop() ?? `${job.id}.jpg`;
    const contentType = fileName.endsWith(".png")
      ? "image/png"
      : fileName.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg";

    const payload = await buildOcrPreparation(job.id, job.imagePath, fileName, contentType);
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not prepare OCR payload." },
      { status: 500 },
    );
  }
}
