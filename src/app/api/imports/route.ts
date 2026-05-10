import { NextRequest, NextResponse } from "next/server";
import { getImportJob, getImportPreview, getRecentImports } from "@/domain/import/import.service";

export async function GET(request: NextRequest) {
  const importId = request.nextUrl.searchParams.get("importId") ?? undefined;
  const mode = request.nextUrl.searchParams.get("mode") ?? "items";

  try {
    if (mode === "recent") {
      const jobs = await getRecentImports();
      return NextResponse.json(jobs);
    }

    if (mode === "job" && importId) {
      const job = await getImportJob(importId);
      return NextResponse.json(job);
    }

    const items = await getImportPreview(importId);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load import preview." },
      { status: 500 },
    );
  }
}
