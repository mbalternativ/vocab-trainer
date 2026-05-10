"use client";

import { useMemo } from "react";
import type { TrainingQuestion } from "@/domain/training/training.types";

export function useTrainingSession(questions: TrainingQuestion[]) {
  return useMemo(
    () => ({
      total: questions.length,
      current: questions[0] ?? null,
    }),
    [questions],
  );
}
