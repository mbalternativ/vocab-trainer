"use client";

import { useActionState } from "react";
import { uploadImportImageAction, type UploadImportActionState } from "@/actions/import.actions";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

const initialState: UploadImportActionState = {
  ok: false,
  message: "",
};

export function ImageUpload() {
  const [state, formAction] = useActionState(uploadImportImageAction, initialState);

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4">
        <p className="text-sm text-slate-500">Step 1</p>
        <h3 className="text-xl font-semibold text-slate-900">Upload a book photo</h3>
        <p className="mt-2 text-sm text-slate-600">
          The image is uploaded to Supabase Storage and an import record is created immediately.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Photo</span>
          <input
            type="file"
            name="image"
            accept="image/png,image/jpeg,image/webp,image/jpg"
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
            required
          />
        </label>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">Best results: one clear page, little skew, good light.</p>
          <FormSubmitButton pendingLabel="Uploading...">Upload photo</FormSubmitButton>
        </div>
      </form>

      {state.message ? (
        <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${state.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          <p>{state.message}</p>
          {state.ok && state.importId ? (
            <div className="mt-2 space-y-1 text-xs text-emerald-800">
              <p><span className="font-semibold">Import ID:</span> {state.importId}</p>
              {state.fileName ? <p><span className="font-semibold">File:</span> {state.fileName}</p> : null}
              <p><span className="font-semibold">OCR prep:</span> {state.ocrReady ? "Signed image URL ready" : "Preview URL could not be prepared"}</p>
              <p>
                Open <code className="rounded bg-white/70 px-1 py-0.5">/import?importId={state.importId}</code> to continue reviewing.
              </p>
              {state.previewUrl ? (
                <a className="inline-flex text-emerald-700 underline" href={state.previewUrl} target="_blank" rel="noreferrer">
                  Open uploaded image preview
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
