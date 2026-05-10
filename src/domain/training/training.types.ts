export type TrainingMode = "flashcard" | "multiple_choice" | "text_input";

export type TrainingQuestion = {
  id: string;
  vocabularyId: string;
  type: TrainingMode;
  prompt: string;
  answer: string;
  choices?: string[];
};
