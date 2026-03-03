import { getAllCourses, getAllLessons } from '@/lib/courses';
import LandingClient from './_components/LandingClient';

export default function HomePage() {
  const courses = getAllCourses();
  // Serialize only what's needed — avoid passing fs-dependent objects to client
  const courseData = courses.map(course => ({
    course: course,
    totalLessons: getAllLessons(course).length,
  }));

  return <LandingClient courseData={courseData} />;
}
