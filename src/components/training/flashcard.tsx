"use client";

import { useActionState, useState } from "react";
import type { TrainingQuestion } from "@/domain/training/training.types";
import { saveTrainingAnswerAction } from "@/actions/training.actions";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

const initialState = {
  ok: false as const,
  message: "",
};

export function Flashcard({ question }: { question: TrainingQuestion }) {
  const [revealed, setRevealed] = useState(false);
  const [state, formAction] = useActionState(async (_: typeof initialState, formData: FormData) => {
    const isCorrect = formData.get("isCorrect") === "true";
    const result = await saveTrainingAnswerAction({
      vocabularyId: question.vocabularyId,
      isCorrect,
      mode: question.type === "multiple-choice" ? "multiple_choice" : "flashcard",
    });

    if (result.ok) {
      return {
        ok: true as const,
        message: isCorrect
          ? `Saved. +${result.xpAwarded} XP, mastery now ${result.masteryLevel}.`
          : `Saved as incorrect. Mastery now ${result.masteryLevel}.`,
      };
    }

    return {
      ok: false as const,
      message: result.message ?? "Could not save training result.",
    };
  }, initialState);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm text-slate-500">Prompt</p>
      <h3 className="mt-2 text-3xl font-semibold text-slate-900">{question.prompt}</h3>

      <div className="mt-6 rounded-xl bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">Answer</p>
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            className="text-sm font-medium text-slate-700 underline underline-offset-4"
          >
            {revealed ? "Hide" : "Reveal"}
          </button>
        </div>
        <p className="mt-2 text-lg text-slate-800">{revealed ? question.answer : "••••••••"}</p>
      </div>

      <form action={formAction} className="mt-6 flex flex-wrap items-center gap-3">
        <input type="hidden" name="isCorrect" value="false" />
        <FormSubmitButton pendingLabel="Saving..." variant="secondary">
          I was wrong
        </FormSubmitButton>
        <button type="submit" name="isCorrect" value="true" className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          I got it right
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-500">Your answer is written to the real training progress action.</p>
      {state.message ? (
        <p className={state.ok ? "mt-3 text-sm text-emerald-600" : "mt-3 text-sm text-red-600"}>{state.message}</p>
      ) : null}
    </div>
  );
}
