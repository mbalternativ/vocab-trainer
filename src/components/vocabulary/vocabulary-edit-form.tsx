"use client";

import { useActionState } from "react";
import { updateVocabularyAction } from "@/actions/vocabulary.actions";
import type { Lesson } from "@/domain/lessons/lessons.types";
import type { VocabularyItem } from "@/domain/vocabulary/vocabulary.types";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

function buildInitialState() {
  return {
    ok: false as const,
    message: "",
    errors: undefined as
      | {
          fieldErrors?: Record<string, string[] | undefined>;
        }
      | undefined,
  };
}

function FieldError({ errors, name }: { errors?: Record<string, string[] | undefined>; name: string }) {
  const message = errors?.[name]?.[0];
  if (!message) return null;
  return <p className="text-sm text-red-600">{message}</p>;
}

export function VocabularyEditForm({ item, lessons }: { item: VocabularyItem; lessons: Lesson[] }) {
  const [state, formAction] = useActionState(async (_: ReturnType<typeof buildInitialState>, formData: FormData) => {
    const result = await updateVocabularyAction(item.id, {
      english: String(formData.get("english") ?? ""),
      german: String(formData.get("german") ?? ""),
      ipa: String(formData.get("ipa") ?? "") || null,
      exampleSentence: String(formData.get("exampleSentence") ?? "") || null,
      partOfSpeech: String(formData.get("partOfSpeech") ?? "") || null,
      lessonId: String(formData.get("lessonId") ?? "") || null,
      difficulty: Number(formData.get("difficulty") ?? item.difficulty),
      audioUrl: String(formData.get("audioUrl") ?? "") || null,
      customAudioPath: String(formData.get("customAudioPath") ?? "") || null,
      sourceType: String(formData.get("sourceType") ?? item.sourceType),
      isPublished: formData.get("isPublished") === "on",
    });

    if (result.ok) {
      return { ok: true as const, message: `Updated “${result.data.english}”.`, errors: undefined };
    }

    return {
      ok: false as const,
      message: result.message ?? "Could not update vocabulary item.",
      errors: result.errors,
    };
  }, buildInitialState());

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-5">
        <p className="text-sm text-slate-500">Edit</p>
        <h3 className="text-xl font-semibold text-slate-900">Update this vocabulary entry</h3>
      </div>

      <form action={formAction} className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">English</span>
          <input name="english" defaultValue={item.english} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
          <FieldError errors={state.errors?.fieldErrors} name="english" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">German</span>
          <input name="german" defaultValue={item.german} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
          <FieldError errors={state.errors?.fieldErrors} name="german" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Lesson</span>
          <select name="lessonId" defaultValue={item.lessonId ?? ""} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">
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
          <select name="difficulty" defaultValue={String(item.difficulty)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">
            {[1, 2, 3, 4, 5].map((level) => (
              <option key={level} value={level}>
                Level {level}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">IPA</span>
          <input name="ipa" defaultValue={item.ipa ?? ""} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Part of speech</span>
          <input name="partOfSpeech" defaultValue={item.partOfSpeech ?? ""} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Example sentence</span>
          <textarea name="exampleSentence" defaultValue={item.exampleSentence ?? ""} rows={3} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Audio URL</span>
          <input name="audioUrl" type="url" defaultValue={item.audioUrl ?? ""} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Custom audio path</span>
          <input name="customAudioPath" defaultValue={item.customAudioPath ?? ""} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Source type</span>
          <select name="sourceType" defaultValue={item.sourceType} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">
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
              <p className="text-sm text-slate-500">Changes are saved through the real update action.</p>
            )}
          </div>
          <FormSubmitButton pendingLabel="Updating...">Save changes</FormSubmitButton>
        </div>
      </form>
    </section>
  );
}
