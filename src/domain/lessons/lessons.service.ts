import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { Lesson } from "./lessons.types";

const fallbackLessons: Lesson[] = [
  {
    id: "unit-1",
    title: "Unit 1",
    topic: "Basics",
    chapter: "Chapter 1",
    bookSource: "School Book",
    sortOrder: 1,
  },
  {
    id: "unit-2",
    title: "Unit 2",
    topic: "Food",
    chapter: "Chapter 2",
    bookSource: "School Book",
    sortOrder: 2,
  },
];

type LessonRow = Database["public"]["Tables"]["lessons"]["Row"];

function mapLessonRow(row: LessonRow): Lesson {
  return {
    id: row.id,
    title: row.title,
    topic: row.topic,
    chapter: row.chapter,
    bookSource: row.book_source,
    sortOrder: row.sort_order,
  };
}

export async function getLessons(): Promise<Lesson[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    if (error || !data) {
      return fallbackLessons;
    }

    return data.map(mapLessonRow);
  } catch {
    return fallbackLessons;
  }
}
