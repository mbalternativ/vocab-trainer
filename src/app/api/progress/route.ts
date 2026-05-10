import { NextResponse } from "next/server";
import { getDashboardProgress } from "@/domain/progress/progress.service";

export async function GET() {
  try {
    const progress = await getDashboardProgress();
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load progress." },
      { status: 500 },
    );
  }
}
