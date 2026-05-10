export function SearchBar({ defaultValue }: { defaultValue?: string }) {
  return (
    <input
      type="search"
      name="search"
      defaultValue={defaultValue}
      placeholder="Search vocabulary..."
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400"
    />
  );
}
