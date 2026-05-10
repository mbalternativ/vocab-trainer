import { VocabularyCreateForm } from "@/components/vocabulary/vocabulary-create-form";
import { VocabularyList } from "@/components/vocabulary/vocabulary-list";
import { getLessons } from "@/domain/lessons/lessons.service";
import { getVocabularyList } from "@/domain/vocabulary/vocabulary.service";

export default async function AdminPage() {
  const [lessons, items] = await Promise.all([getLessons(), getVocabularyList({ limit: 6 })]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Admin area</p>
        <h2 className="text-2xl font-semibold text-slate-900">Content management</h2>
        <p className="mt-2 text-slate-600">
          This page now includes a real creation form wired to the vocabulary server action.
        </p>
      </div>

      <VocabularyCreateForm lessons={lessons} />

      <section className="space-y-4">
        <div>
          <p className="text-sm text-slate-500">Latest entries</p>
          <h3 className="text-xl font-semibold text-slate-900">Recently available vocabulary</h3>
        </div>
        <VocabularyList items={items} />
      </section>
    </section>
  );
}
