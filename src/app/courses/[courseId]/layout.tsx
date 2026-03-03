import { getCourse, getCourseStaticParams } from '@/lib/courses';
import CourseShell from './_components/CourseShell';

interface Props {
  children: React.ReactNode;
  params: { courseId: string };
}

export async function generateStaticParams() {
  return getCourseStaticParams();
}

export default function CourseLayout({ children, params }: Props) {
  const course = getCourse(params.courseId);
  return <CourseShell course={course}>{children}</CourseShell>;
}
