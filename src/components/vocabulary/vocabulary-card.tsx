import Link from "next/link";
import type { VocabularyItem } from "@/domain/vocabulary/vocabulary.types";

export function VocabularyCard({ item }: { item: VocabularyItem }) {
  return (
    <Link href={`/vocabulary/${item.id}`} className="block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 hover:ring-slate-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{item.english}</h3>
          <p className="text-sm text-slate-600">{item.german}</p>
          {item.ipa ? <p className="mt-2 text-xs text-slate-500">{item.ipa}</p> : null}
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">Level {item.difficulty}</span>
      </div>
    </Link>
  );
}
