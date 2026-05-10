import type { ImportJob } from "@/domain/import/import.types";

function StatusPill({ label }: { label: string }) {
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{label}</span>;
}

export function ImportJobCard({ job }: { job: ImportJob }) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Recent import</p>
          <h3 className="text-base font-semibold text-slate-900">{job.id}</h3>
          <p className="mt-1 text-xs text-slate-500">Stored at {job.imagePath}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={`Parse: ${job.parseStatus}`} />
          <StatusPill label={`Review: ${job.reviewStatus}`} />
        </div>
      </div>

      {job.previewUrl ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={job.previewUrl} alt="Uploaded import preview" className="h-56 w-full object-cover" />
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-4 text-sm">
        <p className="text-slate-500">Created {new Date(job.createdAt).toLocaleString()}</p>
        <a href={`/import?importId=${job.id}`} className="font-medium text-slate-900 underline">
          Review this import
        </a>
      </div>
    </article>
  );
}
