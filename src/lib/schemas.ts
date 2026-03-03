import { z } from 'zod';

export const QuizQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()).min(2).max(6),
  answer: z.number().int().min(0),
  explanation: z.string().optional(),
}).refine(q => q.answer < q.options.length, {
  message: 'answer index must be within options range',
});

export const LessonMetaSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  duration: z.string().optional(),
  vmRef: z.string().optional(),
});

export const ModuleSchema = z.object({
  id: z.number().int().min(0),
  title: z.string().min(1),
  subtitle: z.string(),
  icon: z.string(),
  color: z.string(),
  lessons: z.array(LessonMetaSchema).min(1),
});

export const CourseSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  subtitle: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.string(),
  status: z.enum(['published', 'draft', 'coming-soon']),
  category: z.enum(['methodologies', 'markets', 'esg', 'fundamentals', 'green-finance']),
  estimatedHours: z.number().positive(),
  modules: z.array(ModuleSchema).min(1),
});

export type CourseInput = z.infer<typeof CourseSchema>;
export type ModuleInput = z.infer<typeof ModuleSchema>;
export type LessonMetaInput = z.infer<typeof LessonMetaSchema>;
export type QuizQuestionInput = z.infer<typeof QuizQuestionSchema>;
