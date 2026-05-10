import type { Lesson } from "@/domain/lessons/lessons.types";

export function LessonFilter({ lessons, defaultValue }: { lessons: Lesson[]; defaultValue?: string }) {
  return (
    <select name="lessonId" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm" defaultValue={defaultValue ?? "all"}>
      <option value="all">All lessons</option>
      {lessons.map((lesson) => (
        <option key={lesson.id} value={lesson.id}>
          {lesson.title}
        </option>
      ))}
    </select>
  );
}
