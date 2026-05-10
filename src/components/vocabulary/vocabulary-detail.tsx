import type { VocabularyItem } from "@/domain/vocabulary/vocabulary.types";
import { PronunciationButton } from "@/components/audio/pronunciation-button";

export function VocabularyDetail({ item }: { item: VocabularyItem }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Vocabulary detail</p>
          <h2 className="text-3xl font-semibold text-slate-900">{item.english}</h2>
          <p className="mt-2 text-lg text-slate-700">{item.german}</p>
          {item.ipa ? <p className="mt-2 text-sm text-slate-500">{item.ipa}</p> : null}
        </div>
        <PronunciationButton text={item.english} audioUrl={item.audioUrl} customAudioPath={item.customAudioPath} />
      </div>
      {item.exampleSentence ? (
        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Example</p>
          <p className="mt-1 text-slate-800">{item.exampleSentence}</p>
        </div>
      ) : null}
    </section>
  );
}
