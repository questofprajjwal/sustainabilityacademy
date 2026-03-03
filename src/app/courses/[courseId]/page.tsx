import { getCourse, getAllLessons, lessonIdToUrl } from '@/lib/courses';
import CourseOverviewClient from './_components/CourseOverviewClient';
import type { Metadata } from 'next';

interface Props {
  params: { courseId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourse(params.courseId);
  return { title: `${course.title} — Sustainability Academy` };
}

export default function CourseOverviewPage({ params }: Props) {
  const course = getCourse(params.courseId);
  const totalLessons = getAllLessons(course).length;

  return (
    <CourseOverviewClient course={course} totalLessons={totalLessons} />
  );
}
