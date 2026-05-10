import { LessonFilter } from "@/components/vocabulary/lesson-filter";
import { SearchBar } from "@/components/vocabulary/search-bar";
import { VocabularyList } from "@/components/vocabulary/vocabulary-list";
import { getLessons } from "@/domain/lessons/lessons.service";
import { getVocabularyList } from "@/domain/vocabulary/vocabulary.service";

export default async function VocabularyPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string; lessonId?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const search = params?.search?.trim() || undefined;
  const lessonId = params?.lessonId && params.lessonId !== "all" ? params.lessonId : undefined;

  const [items, lessons] = await Promise.all([getVocabularyList({ search, lessonId }), getLessons()]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Vocabulary library</p>
          <h2 className="text-2xl font-semibold text-slate-900">All published words</h2>
        </div>
        <form className="grid gap-3 md:grid-cols-[16rem_12rem_auto]">
          <SearchBar defaultValue={search} />
          <LessonFilter lessons={lessons} defaultValue={lessonId ?? "all"} />
          <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Apply
          </button>
        </form>
      </div>
      {items.length > 0 ? <VocabularyList items={items} /> : <p className="text-slate-600">No vocabulary matched your filters.</p>}
    </section>
  );
}
