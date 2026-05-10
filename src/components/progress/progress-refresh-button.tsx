"use client";

import { useActionState } from "react";
import { refreshProgressAction } from "@/actions/progress.actions";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

const initialState = {
  ok: false as const,
  message: "",
};

export function ProgressRefreshButton() {
  const [state, formAction] = useActionState(async () => {
    const result = await refreshProgressAction();
    return {
      ok: result.ok,
      message: result.ok ? `Progress refreshed. Total XP: ${result.data.totalXp}.` : "Could not refresh progress.",
    };
  }, initialState);

  return (
    <form action={formAction} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Refresh summary</p>
          <p className="text-sm text-slate-700">Trigger the progress action and revalidate the dashboard.</p>
        </div>
        <FormSubmitButton pendingLabel="Refreshing..." variant="secondary">Refresh progress</FormSubmitButton>
      </div>
      {state.message ? <p className="mt-3 text-sm text-emerald-600">{state.message}</p> : null}
    </form>
  );
}
