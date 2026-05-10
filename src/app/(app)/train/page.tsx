import { Flashcard } from "@/components/training/flashcard";
import { TrainingHeader } from "@/components/training/training-header";
import { buildFlashcardQuestions } from "@/domain/training/training.engine";
import { getVocabularyList } from "@/domain/vocabulary/vocabulary.service";

export default async function TrainPage() {
  const items = await getVocabularyList();
  const questions = buildFlashcardQuestions(items);
  const firstQuestion = questions[0];

  return (
    <section className="space-y-6">
      <TrainingHeader />
      {firstQuestion ? (
        <>
          <Flashcard question={firstQuestion} />
          <p className="text-sm text-slate-500">
            For the first connected version, one flashcard is enough to verify that training results are written back to Supabase.
          </p>
        </>
      ) : (
        <p>No vocabulary available yet.</p>
      )}
    </section>
  );
}
