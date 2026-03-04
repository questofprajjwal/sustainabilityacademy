'use client';

import { usePlatformProgress } from '@/lib/progress';
import type { Course } from '@/lib/types';
import CourseCard from '@/components/platform/CourseCard';
import PlatformNav from '@/components/platform/PlatformNav';
import Footer from '@/components/platform/Footer';
import { lessonIdToUrl } from '@/lib/url-helpers';

interface CourseData {
  course: Course;
  totalLessons: number;
}

interface Props {
  courseData: CourseData[];
}

export default function LandingClient({ courseData }: Props) {
  const { mounted, getCourseProgress, lastAccessedCourse } = usePlatformProgress();

  // Build "Continue Learning" href
  let continueLessonHref: string | undefined;
  if (mounted && lastAccessedCourse) {
    const cp = getCourseProgress(lastAccessedCourse);
    if (cp?.lastAccessedLesson) {
      continueLessonHref = `/courses/${lastAccessedCourse}/${lessonIdToUrl(cp.lastAccessedLesson)}`;
    }
  }

  // Total stats
  let totalCompleted = 0;
  if (mounted) {
    for (const cd of courseData) {
      const cp = getCourseProgress(cd.course.id);
      totalCompleted += Object.keys(cp?.completedLessons ?? {}).length;
    }
  }
  const totalLessons = courseData.reduce((s, cd) => s + cd.totalLessons, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PlatformNav lastLessonHref={continueLessonHref} />

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="px-4 sm:px-6 py-16 sm:py-24 border-b border-gray-100">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-3 leading-tight">
              Sustainability Academy
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-xl">
              Free courses on climate, carbon markets, ESG, and more.
            </p>

            {/* Stats */}
            {mounted && totalCompleted > 0 && (
              <p className="text-sm text-gray-400 mb-6">
                {totalCompleted} of {totalLessons} lessons completed
              </p>
            )}

            {continueLessonHref && (
              <a
                href={continueLessonHref}
                className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
              >
                Continue learning &rarr;
              </a>
            )}
          </div>
        </section>

        {/* Courses */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <section aria-labelledby="courses-heading">
            <h2 id="courses-heading" className="text-lg font-semibold text-gray-900 mb-8">
              Courses
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {courseData.map(({ course, totalLessons: tl }) => {
                const cp = mounted ? getCourseProgress(course.id) : null;
                const completedCount = Object.keys(cp?.completedLessons ?? {}).length;
                const lastLesson = cp?.lastAccessedLesson;
                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    completedLessons={completedCount}
                    totalLessons={tl}
                    lastLessonId={lastLesson ? lessonIdToUrl(lastLesson) : undefined}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
