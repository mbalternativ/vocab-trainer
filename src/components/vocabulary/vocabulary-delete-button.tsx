"use client";

import { useActionState } from "react";
import { deleteVocabularyAction } from "@/actions/vocabulary.actions";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

const initialState = {
  ok: false as const,
  message: "",
};

export function VocabularyDeleteButton({ id, label }: { id: string; label: string }) {
  const [state, formAction] = useActionState(async () => {
    const result = await deleteVocabularyAction(id);
    return {
      ok: result.ok,
      message: result.ok ? `Deleted “${label}”.` : result.message ?? "Could not delete vocabulary item.",
    };
  }, initialState);

  return (
    <form action={formAction} className="space-y-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div>
        <p className="text-sm text-slate-500">Danger zone</p>
        <h3 className="text-xl font-semibold text-slate-900">Delete this entry</h3>
      </div>
      <p className="text-sm text-slate-600">Use this only if the word should be removed from the shared vocabulary list.</p>
      {state.message ? (
        <p className={state.ok ? "text-sm text-emerald-600" : "text-sm text-red-600"}>{state.message}</p>
      ) : null}
      <FormSubmitButton pendingLabel="Deleting..." variant="secondary">Delete vocabulary</FormSubmitButton>
    </form>
  );
}
