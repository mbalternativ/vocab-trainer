"use client";

import { useActionState } from "react";
import { finalizeImportAction } from "@/actions/import.actions";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

const initialState = {
  ok: false as const,
  message: "",
};

export function ImportFinalizeForm({ importId }: { importId?: string }) {
  const [state, formAction] = useActionState(async (_: typeof initialState, formData: FormData) => {
    const id = String(formData.get("importId") ?? "").trim();
    const result = await finalizeImportAction({ importId: id });

    return {
      ok: result.ok,
      message: result.ok
        ? `Imported ${result.data.importedCount} entries from ${result.data.importId}.`
        : result.message ?? "Could not finalize import.",
    };
  }, initialState);

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4">
        <p className="text-sm text-slate-500">Finalize review</p>
        <h3 className="text-xl font-semibold text-slate-900">Move approved import rows into vocabulary</h3>
      </div>

      <form action={formAction} className="space-y-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Import ID</span>
          <input
            name="importId"
            defaultValue={importId ?? ""}
            placeholder="Paste a real import id"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
          />
        </label>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">This form is connected to the real finalize import action.</p>
          <FormSubmitButton pendingLabel="Importing...">Finalize import</FormSubmitButton>
        </div>
      </form>

      {state.message ? (
        <p className={state.ok ? "mt-4 text-sm text-emerald-600" : "mt-4 text-sm text-red-600"}>{state.message}</p>
      ) : null}
    </section>
  );
}
