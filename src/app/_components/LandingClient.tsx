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
    <div className="min-h-screen flex flex-col">
      <PlatformNav lastLessonHref={continueLessonHref} />

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-green-800 to-green-600 text-white px-4 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-5xl mb-4" aria-hidden>🌿</div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
              Sustainability Academy
            </h1>
            <p className="text-lg sm:text-xl text-green-100 mb-3 max-w-2xl mx-auto">
              Expert-authored courses across the full spectrum of sustainability —
              climate, carbon markets, ESG, clean energy, biodiversity, and beyond.
            </p>
            <p className="text-base text-green-200 mb-8 max-w-xl mx-auto">
              For sustainability professionals, ESG analysts, researchers, consultants,
              and everyone building expertise in the green economy.
            </p>

            {/* Stats */}
            {mounted && totalCompleted > 0 && (
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-5 py-2 text-sm backdrop-blur-sm mb-6">
                <span className="text-green-200">📊</span>
                <span>{totalCompleted} of {totalLessons} lessons completed across all courses</span>
              </div>
            )}

            {continueLessonHref && (
              <div className="mt-2">
                <a
                  href={continueLessonHref}
                  className="inline-flex items-center gap-2 bg-white text-green-800 font-semibold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-lg"
                >
                  <span aria-hidden>▶</span> Continue Learning
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Topic breadth strip */}
        <section aria-label="Topics covered" className="bg-white border-b border-gray-200 py-5 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-3">
              Topics covered
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { icon: '🌡', label: 'Climate Science & Policy' },
                { icon: '📊', label: 'ESG & Corporate Reporting' },
                { icon: '🌿', label: 'Carbon Markets & Offsets' },
                { icon: '☀', label: 'Renewable Energy' },
                { icon: '♻', label: 'Circular Economy' },
                { icon: '🌊', label: 'Biodiversity & Ecosystems' },
                { icon: '🌾', label: 'Sustainable Agriculture' },
                { icon: '🏭', label: 'Corporate Sustainability' },
                { icon: '💰', label: 'Green Finance' },
                { icon: '📋', label: 'Sustainability Standards' },
              ].map(({ icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-gray-600 bg-gray-50 border border-gray-200"
                >
                  <span aria-hidden>{icon}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* All Courses */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <section aria-labelledby="courses-heading">
            <h2 id="courses-heading" className="text-2xl font-bold text-gray-900 mb-2">
              All Courses
            </h2>
            <p className="text-gray-500 mb-8 text-sm">
              New courses across climate, ESG, green finance, and more are added regularly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
