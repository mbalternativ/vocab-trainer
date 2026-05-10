import { DailyGoalCard } from "@/components/progress/daily-goal-card";
import { ProgressRefreshButton } from "@/components/progress/progress-refresh-button";
import { StreakCard } from "@/components/progress/streak-card";
import { XpCard } from "@/components/progress/xp-card";
import { getDashboardProgress } from "@/domain/progress/progress.service";

export default async function ProgressPage() {
  const progress = await getDashboardProgress();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Progress</p>
        <h2 className="text-2xl font-semibold text-slate-900">Learning stats</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <XpCard value={progress.totalXp} />
        <StreakCard value={progress.currentStreak} />
        <DailyGoalCard current={progress.todayCorrectAnswers} target={progress.dailyGoalTarget} />
      </div>
      <ProgressRefreshButton />
    </section>
  );
}
