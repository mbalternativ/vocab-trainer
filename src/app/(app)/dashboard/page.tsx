import { DailyGoalCard } from "@/components/progress/daily-goal-card";
import { StreakCard } from "@/components/progress/streak-card";
import { XpCard } from "@/components/progress/xp-card";
import { getDashboardProgress } from "@/domain/progress/progress.service";

export default async function DashboardPage() {
  const progress = await getDashboardProgress();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Overview</p>
        <h2 className="text-2xl font-semibold text-slate-900">Learning dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <DailyGoalCard current={progress.todayCorrectAnswers} target={progress.dailyGoalTarget} />
        <StreakCard value={progress.currentStreak} />
        <XpCard value={progress.totalXp} />
      </div>
    </section>
  );
}
