"use client";

import { useMemo } from "react";

export function useDailyGoal(current: number, target: number) {
  return useMemo(() => Math.min(100, Math.round((current / target) * 100)), [current, target]);
}
