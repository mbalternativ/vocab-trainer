"use client";

import { useActionState } from "react";
import { createVocabularyAction } from "@/actions/vocabulary.actions";
import type { Lesson } from "@/domain/lessons/lessons.types";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

const initialState = {
  type FormState = {
  ok: boolean;
  message: string;
  errors?: {
    fieldErrors?: Record<string, string[] | undefined>;
  };
};

const initialState: FormState = {
  ok: false,
  message: "",
  errors: undefined,
};
};

async function submitCreateVocabulary(_: FormState,

  formData: FormData

): Promise<FormState> {
  const isPublishedValue = formData.get("isPublished");
  const difficultyValue = formData.get("difficulty");
  const lessonIdValue = formData.get("lessonId");

  const result = await createVocabularyAction({
    english: String(formData.get("english") ?? ""),
    german: String(formData.get("german") ?? ""),
    ipa: String(formData.get("ipa") ?? "") || null,
    exampleSentence: String(formData.get("exampleSentence") ?? "") || null,
    partOfSpeech: String(formData.get("partOfSpeech") ?? "") || null,
    lessonId: lessonIdValue ? String(lessonIdValue) : null,
    difficulty: difficultyValue ? Number(difficultyValue) : 1,
    audioUrl: String(formData.get("audioUrl") ?? "") || null,
    customAudioPath: String(formData.get("customAudioPath") ?? "") || null,
    sourceType: String(formData.get("sourceType") ?? "manual"),
    isPublished: isPublishedValue === "on",
  });

if (result.ok) {
  return {
    ok: true,
    message: `Saved “${result.data.english}”.`,
    errors: undefined,
  } as FormState;
}

return {
  ok: false,
  message: result.message ?? "Could not save vocabulary item.",
  errors: result.errors,
} as FormState;
}

function FieldError({ errors, name }: { errors?: Record<string, string[] | undefined>; name: string }) {
  const message = errors?.[name]?.[0];
  if (!message) return null;
  return <p className="text-sm text-red-600">{message}</p>;
}

export function VocabularyCreateForm({ lessons }: { lessons: Lesson[] }) {
  const [state, formAction] = useActionState(submitCreateVocabulary, initialState);

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-5">
        <p className="text-sm text-slate-500">New vocabulary</p>
        <h2 className="text-2xl font-semibold text-slate-900">Create a vocabulary entry</h2>
      </div>

      <form action={formAction} className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">English *</span>
          <input name="english" className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
          <FieldError errors={state.errors?.fieldErrors} name="english" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">German *</span>
          <input name="german" className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
          <FieldError errors={state.errors?.fieldErrors} name="german" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Lesson</span>
          <select name="lessonId" className="rounded-xl border border-slate-200 px-4 py-2 text-sm" defaultValue="">
            <option value="">No lesson</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Difficulty</span>
          <select name="difficulty" className="rounded-xl border border-slate-200 px-4 py-2 text-sm" defaultValue="1">
            {[1, 2, 3, 4, 5].map((level) => (
              <option key={level} value={level}>
                Level {level}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">IPA</span>
          <input name="ipa" className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Part of speech</span>
          <input name="partOfSpeech" className="rounded-xl border border-slate-200 px-4 py-2 text-sm" placeholder="noun, verb, adjective..." />
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Example sentence</span>
          <textarea name="exampleSentence" rows={3} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Audio URL</span>
          <input name="audioUrl" type="url" className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Custom audio path</span>
          <input name="customAudioPath" className="rounded-xl border border-slate-200 px-4 py-2 text-sm" placeholder="audio/unit-1/word.mp3" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Source type</span>
          <select name="sourceType" className="rounded-xl border border-slate-200 px-4 py-2 text-sm" defaultValue="manual">
            <option value="manual">Manual</option>
            <option value="import">Import</option>
            <option value="audio">Audio</option>
          </select>
        </label>

        <label className="flex items-center gap-2 self-end rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700">
          <input type="checkbox" name="isPublished" defaultChecked />
          Published
        </label>

        <div className="md:col-span-2 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div>
            {state.message ? (
              <p className={state.ok ? "text-sm text-emerald-600" : "text-sm text-red-600"}>{state.message}</p>
            ) : (
              <p className="text-sm text-slate-500">This form is connected to the real create action.</p>
            )}
          </div>
          <FormSubmitButton pendingLabel="Creating...">Create vocabulary</FormSubmitButton>
        </div>
      </form>
    </section>
  );
}
