export type DashboardProgress = {
  currentStreak: number;
  todayCorrectAnswers: number;
  dailyGoalTarget: number;
  totalXp: number;
};

export type SaveTrainingAnswerInput = {
  vocabularyId: string;
  isCorrect: boolean;
  mode?: "flashcard" | "multiple_choice" | "text_input" | "challenge";
};

export type SaveTrainingAnswerResult = {
  ok: true;
  xpAwarded: number;
  masteryLevel: number;
  correctCount: number;
  wrongCount: number;
  todayCorrectAnswers: number;
  dailyGoalTarget: number;
  dailyGoalCompleted: boolean;
};
