import { notFound } from "next/navigation";
import { VocabularyDeleteButton } from "@/components/vocabulary/vocabulary-delete-button";
import { VocabularyDetail } from "@/components/vocabulary/vocabulary-detail";
import { VocabularyEditForm } from "@/components/vocabulary/vocabulary-edit-form";
import { getLessons } from "@/domain/lessons/lessons.service";
import { getVocabularyById } from "@/domain/vocabulary/vocabulary.service";

export default async function VocabularyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, lessons] = await Promise.all([getVocabularyById(id), getLessons()]);

  if (!item) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <VocabularyDetail item={item} />
      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <VocabularyEditForm item={item} lessons={lessons} />
        <VocabularyDeleteButton id={item.id} label={item.english} />
      </div>
    </section>
  );
}
