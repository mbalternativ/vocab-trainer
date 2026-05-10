"use client";

import { useActionState } from "react";
import { runOcrForImportAction } from "@/actions/import.actions";
import { Button } from "@/components/ui/button";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

type OcrFormState = {
  ok: boolean;
  message: string;
};

const initialState: OcrFormState = { ok: false, message: "" };

export function ImportOcrForm({ importId }: { importId?: string }) {
  const [state, formAction] = useActionState(async (_state: OcrFormState): Promise<OcrFormState> => {
    if (!importId) {
      return { ok: false, message: "Upload or select an import before running OCR." };
    }

    const result = await runOcrForImportAction({ importId });
    if (result.ok) {
      return {
        ok: true,
        message: `OCR complete: ${result.data.parsedCount} rows parsed, ${result.data.approvedCount} auto-approved.`,
      };
    }

    return {
      ok: false,
      message: result.message ?? "Could not run OCR for this import.",
    };
  }, initialState);

  return (
    <form action={formAction} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">OCR ausführen</p>
          <p className="mt-1 text-sm text-slate-500">
            Der OCR-Schritt liest das hochgeladene Bild, speichert den Rohtext und befüllt import_items automatisch.
          </p>
        </div>
        {importId ? <FormSubmitButton>OCR starten</FormSubmitButton> : <Button disabled>OCR starten</Button>}
      </div>
      {state.message ? (
        <p className={`mt-3 text-sm ${state.ok ? "text-emerald-700" : "text-red-700"}`}>{state.message}</p>
      ) : null}
    </form>
  );
}
