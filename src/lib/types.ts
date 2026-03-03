// ─── Core domain types ────────────────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  status: 'published' | 'draft' | 'coming-soon';
  category: 'methodologies' | 'markets' | 'esg' | 'fundamentals';
  estimatedHours: number;
  modules: Module[];
}

export interface Module {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  lessons: LessonMeta[];
}

export interface LessonMeta {
  id: string;
  title: string;
  duration?: string;
  vmRef?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

// ─── Progress types ───────────────────────────────────────────────────────────

export interface PlatformProgress {
  version: 2;
  courses: Record<string, CourseProgress>;
}

export interface CourseProgress {
  startedAt: number;
  lastAccessedAt: number;
  lastAccessedLesson: string | null;
  completedLessons: Record<string, number>;   // lessonId → timestamp
  quizzes: Record<string, QuizState>;          // lessonId → quiz state
}

export interface QuizState {
  answers: Record<number, number>;
  submitted: Record<number, boolean>;
  score?: number;
}

// ─── Derived/computed types ───────────────────────────────────────────────────

export interface CourseStats {
  courseId: string;
  completedCount: number;
  totalLessons: number;
  percentComplete: number;
  lastAccessedLesson: string | null;
  lastAccessedAt: number | null;
}

export interface PlatformStats {
  coursesStarted: number;
  totalLessonsCompleted: number;
  totalLessons: number;
}

// ─── Navigation helpers ───────────────────────────────────────────────────────

export interface LessonNavContext {
  prevLesson: LessonMeta | null;
  nextLesson: LessonMeta | null;
  moduleTitle: string;
  lessonIndex: number;    // 1-based position within the module
  moduleLessonCount: number;
}
