export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type TableDef<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<
        {
          id: string;
          display_name: string | null;
          role: "admin" | "editor" | "learner";
          created_at: string;
          updated_at: string;
        },
        {
          id: string;
          display_name?: string | null;
          role?: "admin" | "editor" | "learner";
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          display_name?: string | null;
          role?: "admin" | "editor" | "learner";
          created_at?: string;
          updated_at?: string;
        }
      >;
      lessons: TableDef<
        {
          id: string;
          title: string;
          topic: string | null;
          book_source: string | null;
          chapter: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          title: string;
          topic?: string | null;
          book_source?: string | null;
          chapter?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          title?: string;
          topic?: string | null;
          book_source?: string | null;
          chapter?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      vocabulary: TableDef<
        {
          id: string;
          lesson_id: string | null;
          english: string;
          german: string;
          ipa: string | null;
          example_sentence: string | null;
          part_of_speech: string | null;
          difficulty: number;
          audio_url: string | null;
          custom_audio_path: string | null;
          source_type: "manual" | "import" | "audio";
          is_published: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          lesson_id?: string | null;
          english: string;
          german: string;
          ipa?: string | null;
          example_sentence?: string | null;
          part_of_speech?: string | null;
          difficulty?: number;
          audio_url?: string | null;
          custom_audio_path?: string | null;
          source_type?: "manual" | "import" | "audio";
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          lesson_id?: string | null;
          english?: string;
          german?: string;
          ipa?: string | null;
          example_sentence?: string | null;
          part_of_speech?: string | null;
          difficulty?: number;
          audio_url?: string | null;
          custom_audio_path?: string | null;
          source_type?: "manual" | "import" | "audio";
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      vocabulary_tags: TableDef<
        {
          id: string;
          vocabulary_id: string;
          tag: string;
          created_at: string;
        },
        {
          id?: string;
          vocabulary_id: string;
          tag: string;
          created_at?: string;
        },
        {
          id?: string;
          vocabulary_id?: string;
          tag?: string;
          created_at?: string;
        }
      >;
      user_progress: TableDef<
        {
          id: string;
          user_id: string;
          vocabulary_id: string;
          correct_count: number;
          wrong_count: number;
          streak_count: number;
          mastery_level: number;
          last_seen_at: string | null;
          next_review_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          user_id: string;
          vocabulary_id: string;
          correct_count?: number;
          wrong_count?: number;
          streak_count?: number;
          mastery_level?: number;
          last_seen_at?: string | null;
          next_review_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          user_id?: string;
          vocabulary_id?: string;
          correct_count?: number;
          wrong_count?: number;
          streak_count?: number;
          mastery_level?: number;
          last_seen_at?: string | null;
          next_review_at?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      training_sessions: TableDef<
        {
          id: string;
          user_id: string | null;
          mode: "flashcard" | "multiple_choice" | "text_input" | "challenge";
          score: number;
          xp_earned: number;
          started_at: string;
          finished_at: string | null;
        },
        {
          id?: string;
          user_id?: string | null;
          mode: "flashcard" | "multiple_choice" | "text_input" | "challenge";
          score?: number;
          xp_earned?: number;
          started_at?: string;
          finished_at?: string | null;
        },
        {
          id?: string;
          user_id?: string | null;
          mode?: "flashcard" | "multiple_choice" | "text_input" | "challenge";
          score?: number;
          xp_earned?: number;
          started_at?: string;
          finished_at?: string | null;
        }
      >;
      daily_stats: TableDef<
        {
          id: string;
          user_id: string;
          stat_date: string;
          answers_total: number;
          answers_correct: number;
          xp_earned: number;
          daily_goal_target: number;
          daily_goal_completed: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          user_id: string;
          stat_date: string;
          answers_total?: number;
          answers_correct?: number;
          xp_earned?: number;
          daily_goal_target?: number;
          daily_goal_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          user_id?: string;
          stat_date?: string;
          answers_total?: number;
          answers_correct?: number;
          xp_earned?: number;
          daily_goal_target?: number;
          daily_goal_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      imports: TableDef<
        {
          id: string;
          user_id: string | null;
          image_path: string;
          ocr_raw_text: string | null;
          parse_status: "pending" | "processing" | "parsed" | "failed";
          review_status: "pending" | "reviewed" | "imported";
          error_message: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          user_id?: string | null;
          image_path: string;
          ocr_raw_text?: string | null;
          parse_status?: "pending" | "processing" | "parsed" | "failed";
          review_status?: "pending" | "reviewed" | "imported";
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          user_id?: string | null;
          image_path?: string;
          ocr_raw_text?: string | null;
          parse_status?: "pending" | "processing" | "parsed" | "failed";
          review_status?: "pending" | "reviewed" | "imported";
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      import_items: TableDef<
        {
          id: string;
          import_id: string;
          english: string | null;
          german: string | null;
          ipa: string | null;
          example_sentence: string | null;
          part_of_speech: string | null;
          is_approved: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          import_id: string;
          english?: string | null;
          german?: string | null;
          ipa?: string | null;
          example_sentence?: string | null;
          part_of_speech?: string | null;
          is_approved?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          import_id?: string;
          english?: string | null;
          german?: string | null;
          ipa?: string | null;
          example_sentence?: string | null;
          part_of_speech?: string | null;
          is_approved?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        }
      >;
    };
  };
};

export type PublicSchema = Database["public"];
export type TableName = keyof PublicSchema["Tables"];
export type TableRow<T extends TableName> = PublicSchema["Tables"][T]["Row"];
export type TableInsert<T extends TableName> = PublicSchema["Tables"][T]["Insert"];
export type TableUpdate<T extends TableName> = PublicSchema["Tables"][T]["Update"];
