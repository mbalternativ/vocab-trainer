export function DailyGoalCard({ current, target }: { current: number; target: number }) {
  const percent = Math.min(100, Math.round((current / target) * 100));

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Daily goal</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {current}/{target}
          </p>
        </div>
        <p className="text-sm font-medium text-slate-600">{percent}%</p>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-slate-900" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
