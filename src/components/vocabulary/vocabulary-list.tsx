import type { VocabularyItem } from "@/domain/vocabulary/vocabulary.types";
import { VocabularyCard } from "./vocabulary-card";

export function VocabularyList({ items }: { items: VocabularyItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <VocabularyCard key={item.id} item={item} />
      ))}
    </div>
  );
}
