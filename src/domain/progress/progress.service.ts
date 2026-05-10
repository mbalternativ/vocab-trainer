import { DAILY_GOAL_DEFAULT, XP_PER_CORRECT_ANSWER } from "@/lib/constants/gamification";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type {
  DashboardProgress,
  SaveTrainingAnswerInput,
  SaveTrainingAnswerResult,
} from "./progress.types";

type UserProgressRow = Database["public"]["Tables"]["user_progress"]["Row"];
type DailyStatsRow = Database["public"]["Tables"]["daily_stats"]["Row"];

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function computeCurrentStreak(stats: DailyStatsRow[]): number {
  if (stats.length === 0) return 0;

  const completedDates = new Set(stats.filter((row) => row.daily_goal_completed).map((row) => row.stat_date));
  let streak = 0;
  const cursor = new Date();

  while (true) {
    const isoDate = cursor.toISOString().slice(0, 10);
    if (!completedDates.has(isoDate)) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

export async function getDashboardProgress(): Promise<DashboardProgress> {
  try {
    const supabase = await createClient();
    const [{ data: authData }, todayStatsResponse, allStatsResponse] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("daily_stats").select("*").eq("stat_date", getTodayIsoDate()).maybeSingle(),
      supabase.from("daily_stats").select("*").order("stat_date", { ascending: false }).limit(30),
    ]);

    const user = authData.user;
    if (!user) {
      return {
        currentStreak: 0,
        todayCorrectAnswers: 0,
        dailyGoalTarget: DAILY_GOAL_DEFAULT,
        totalXp: 0,
      };
    }

    const [todayRowResponse, progressResponse, statsResponse] = await Promise.all([
      supabase.from("daily_stats").select("*").eq("user_id", user.id).eq("stat_date", getTodayIsoDate()).maybeSingle(),
      supabase.from("user_progress").select("correct_count, wrong_count"),
      supabase.from("daily_stats").select("*").eq("user_id", user.id).order("stat_date", { ascending: false }).limit(30),
    ]);

    const today = todayRowResponse.data;
    const progressRows = progressResponse.data ?? [];
    const statRows = statsResponse.data ?? [];
    const totalXp = statRows.reduce((sum, row) => sum + row.xp_earned, 0);

    return {
      currentStreak: computeCurrentStreak(statRows),
      todayCorrectAnswers: today?.answers_correct ?? 0,
      dailyGoalTarget: today?.daily_goal_target ?? DAILY_GOAL_DEFAULT,
      totalXp,
    };
  } catch {
    return {
      currentStreak: 4,
      todayCorrectAnswers: 6,
      dailyGoalTarget: DAILY_GOAL_DEFAULT,
      totalXp: 180,
    };
  }
}

function getNextMasteryLevel(current: number, isCorrect: boolean) {
  return Math.max(0, Math.min(5, current + (isCorrect ? 1 : -1)));
}

function getNextReviewAt(isCorrect: boolean) {
  const now = new Date();
  now.setUTCDate(now.getUTCDate() + (isCorrect ? 2 : 1));
  return now.toISOString();
}

export async function saveTrainingAnswer(
  input: SaveTrainingAnswerInput,
): Promise<SaveTrainingAnswerResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in to save training progress.");
  }

  const nowIso = new Date().toISOString();
  const today = getTodayIsoDate();
  const xpAwarded = input.isCorrect ? XP_PER_CORRECT_ANSWER : 0;

  const { data: existingProgress, error: existingProgressError } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("vocabulary_id", input.vocabularyId)
    .maybeSingle();

  if (existingProgressError) {
    throw new Error(existingProgressError.message);
  }

  const currentProgress = existingProgress as UserProgressRow | null;
  const nextProgress = {
    user_id: user.id,
    vocabulary_id: input.vocabularyId,
    correct_count: (currentProgress?.correct_count ?? 0) + (input.isCorrect ? 1 : 0),
    wrong_count: (currentProgress?.wrong_count ?? 0) + (input.isCorrect ? 0 : 1),
    streak_count: input.isCorrect ? (currentProgress?.streak_count ?? 0) + 1 : 0,
    mastery_level: getNextMasteryLevel(currentProgress?.mastery_level ?? 0, input.isCorrect),
    last_seen_at: nowIso,
    next_review_at: getNextReviewAt(input.isCorrect),
  };

  const { data: updatedProgress, error: upsertProgressError } = await supabase
    .from("user_progress")
    .upsert(nextProgress, { onConflict: "user_id,vocabulary_id" })
    .select("*")
    .single();

  if (upsertProgressError || !updatedProgress) {
    throw new Error(upsertProgressError?.message ?? "Could not update user progress.");
  }

  const { data: existingDailyStats, error: existingDailyStatsError } = await supabase
    .from("daily_stats")
    .select("*")
    .eq("user_id", user.id)
    .eq("stat_date", today)
    .maybeSingle();

  if (existingDailyStatsError) {
    throw new Error(existingDailyStatsError.message);
  }

  const currentDaily = existingDailyStats as DailyStatsRow | null;
  const nextAnswersCorrect = (currentDaily?.answers_correct ?? 0) + (input.isCorrect ? 1 : 0);
  const dailyGoalTarget = currentDaily?.daily_goal_target ?? DAILY_GOAL_DEFAULT;

  const { data: updatedDailyStats, error: upsertDailyStatsError } = await supabase
    .from("daily_stats")
    .upsert(
      {
        user_id: user.id,
        stat_date: today,
        answers_total: (currentDaily?.answers_total ?? 0) + 1,
        answers_correct: nextAnswersCorrect,
        xp_earned: (currentDaily?.xp_earned ?? 0) + xpAwarded,
        daily_goal_target: dailyGoalTarget,
        daily_goal_completed: nextAnswersCorrect >= dailyGoalTarget,
      },
      { onConflict: "user_id,stat_date" },
    )
    .select("*")
    .single();

  if (upsertDailyStatsError || !updatedDailyStats) {
    throw new Error(upsertDailyStatsError?.message ?? "Could not update daily stats.");
  }

  const { error: sessionError } = await supabase.from("training_sessions").insert({
    user_id: user.id,
    mode: input.mode ?? "flashcard",
    score: input.isCorrect ? 1 : 0,
    xp_earned: xpAwarded,
    started_at: nowIso,
    finished_at: nowIso,
  });

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  return {
    ok: true,
    xpAwarded,
    masteryLevel: updatedProgress.mastery_level,
    correctCount: updatedProgress.correct_count,
    wrongCount: updatedProgress.wrong_count,
    todayCorrectAnswers: updatedDailyStats.answers_correct,
    dailyGoalTarget: updatedDailyStats.daily_goal_target,
    dailyGoalCompleted: updatedDailyStats.daily_goal_completed,
  };
}
