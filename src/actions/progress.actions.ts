"use server";

import { revalidatePath } from "next/cache";
import { getDashboardProgress } from "@/domain/progress/progress.service";

export async function refreshProgressAction() {
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  const progress = await getDashboardProgress();
  return { ok: true as const, data: progress };
}
