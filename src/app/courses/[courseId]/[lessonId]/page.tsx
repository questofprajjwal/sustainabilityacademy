import { getCourse, getQuiz, getLessonNavContext, getLessonStaticParams } from '@/lib/courses';
import { urlToLessonId } from '@/lib/url-helpers';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getMDXComponents } from '@/components/content/mdx-components';
import LessonClient from './_components/LessonClient';
import type { Metadata } from 'next';

interface Props {
  params: { courseId: string; lessonId: string };
}

export async function generateStaticParams() {
  return getLessonStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourse(params.courseId);
  const lessonId = urlToLessonId(params.lessonId);
  const navCtx = getLessonNavContext(course, lessonId);
  const lesson = course.modules.flatMap(m => m.lessons).find(l => l.id === lessonId);
  return {
    title: `${lesson?.title ?? lessonId} — ${course.title} — Sustainability Academy`,
    description: navCtx
      ? `Module ${navCtx.moduleTitle}: lesson ${navCtx.lessonIndex} of ${navCtx.moduleLessonCount}`
      : undefined,
  };
}

export default function LessonPage({ params }: Props) {
  const { courseId, lessonId: urlLessonId } = params;
  const course = getCourse(courseId);
  const lessonId = urlToLessonId(urlLessonId);

  const contentPath = join(process.cwd(), 'src', 'content', courseId, 'lessons', `${lessonId}.mdx`);
  const rawContent = existsSync(contentPath) ? readFileSync(contentPath, 'utf-8') : '';
  // Strip the MDX comment header line
  const mdxSource = rawContent.replace(/^\{\/\*.*?\*\/\}\n\n/, '');

  const quiz = getQuiz(courseId, lessonId);
  const navCtx = getLessonNavContext(course, lessonId);
  const lesson = course.modules.flatMap(m => m.lessons).find(l => l.id === lessonId);

  return (
    <LessonClient
      courseId={courseId}
      lessonId={lessonId}
      lessonMeta={lesson ?? { id: lessonId, title: lessonId }}
      quiz={quiz}
      navCtx={navCtx}
      courseColor={course.color}
    >
      <MDXRemote source={mdxSource} components={getMDXComponents()} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
    </LessonClient>
  );
}
