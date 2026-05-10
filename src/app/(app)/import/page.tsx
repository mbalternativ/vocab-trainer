import { ImageUpload } from "@/components/import/image-upload";
import { ImportFinalizeForm } from "@/components/import/import-finalize-form";
import { ImportJobCard } from "@/components/import/import-job-card";
import { ImportOcrForm } from "@/components/import/import-ocr-form";
import { ImportReviewTable } from "@/components/import/import-review-table";
import { getImportJob, getImportPreview, getRecentImports } from "@/domain/import/import.service";

export default async function ImportPage({
  searchParams,
}: {
  searchParams?: Promise<{ importId?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const importId = params?.importId?.trim() || undefined;
  const [items, selectedJob, recentImports] = await Promise.all([
    getImportPreview(importId),
    importId ? getImportJob(importId) : Promise.resolve(null),
    getRecentImports(),
  ]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Photo import</p>
        <h2 className="text-2xl font-semibold text-slate-900">Upload and review book photos</h2>
        <p className="mt-2 text-slate-600">
          Uploads now go to Supabase Storage and create a real import job. OCR can now be started for a selected import. The raw OCR text is stored and parsed into reviewable import_items automatically.
        </p>
      </div>

      <ImageUpload />

      {selectedJob ? (
        <section className="space-y-3">
          <div>
            <p className="text-sm text-slate-500">Step 2</p>
            <h3 className="text-xl font-semibold text-slate-900">Selected import</h3>
            <p className="mt-1 text-sm text-slate-600">
              OCR payload endpoint: <code className="rounded bg-slate-100 px-1 py-0.5">/api/imports/{selectedJob.id}/ocr-prep</code>
            </p>
          </div>
          <ImportJobCard job={selectedJob} />
          <ImportOcrForm importId={selectedJob.id} />
        </section>
      ) : null}

      <section className="space-y-3">
        <div>
          <p className="text-sm text-slate-500">Step 3</p>
          <h3 className="text-xl font-semibold text-slate-900">Review extracted rows</h3>
        </div>
        <ImportReviewTable items={items} />
      </section>

      <ImportFinalizeForm importId={importId ?? items[0]?.importId} />

      <section className="space-y-3">
        <div>
          <p className="text-sm text-slate-500">Recent work</p>
          <h3 className="text-xl font-semibold text-slate-900">Latest import jobs</h3>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {recentImports.length > 0 ? (
            recentImports.map((job) => <ImportJobCard key={job.id} job={job} />)
          ) : (
            <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
              No import jobs yet.
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
