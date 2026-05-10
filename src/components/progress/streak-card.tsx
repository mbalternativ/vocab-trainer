export function StreakCard({ value }: { value: number }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm text-slate-500">Current streak</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value} days</p>
    </div>
  );
}
