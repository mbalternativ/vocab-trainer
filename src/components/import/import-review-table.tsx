import type { ImportItem } from "@/domain/import/import.types";

export function ImportReviewTable({ items }: { items: ImportItem[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="px-4 py-3">English</th>
            <th className="px-4 py-3">German</th>
            <th className="px-4 py-3">IPA</th>
            <th className="px-4 py-3">Approved</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3 align-top">
                <p className="font-medium text-slate-900">{item.english}</p>
                {item.partOfSpeech ? <p className="mt-1 text-xs text-slate-500">{item.partOfSpeech}</p> : null}
              </td>
              <td className="px-4 py-3 align-top">
                <p className="text-slate-800">{item.german}</p>
                {item.exampleSentence ? <p className="mt-1 text-xs text-slate-500">{item.exampleSentence}</p> : null}
              </td>
              <td className="px-4 py-3 align-top">{item.ipa ?? "—"}</td>
              <td className="px-4 py-3 align-top">
                <span className={`rounded-full px-2 py-1 text-xs ${item.isApproved ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                  {item.isApproved ? "Approved" : "Pending"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
