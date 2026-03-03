'use client';

import Link from 'next/link';
import { useProgress } from '@/lib/progress';
import type { Course } from '@/lib/types';
import { getColor } from '@/lib/colors';
import { lessonIdToUrl } from '@/lib/url-helpers';
import ProgressBar from '@/components/learning/ProgressBar';
import Breadcrumb from '@/components/platform/Breadcrumb';
import Footer from '@/components/platform/Footer';

interface Props {
  course: Course;
  totalLessons: number;
}

export default function CourseOverviewClient({ course, totalLessons }: Props) {
  const progress = useProgress(course.id);
  const colors = getColor(course.color);

  const completedCount = progress.mounted
    ? course.modules.flatMap(m => m.lessons).filter(l => progress.isCompleted(l.id)).length
    : 0;

  const percent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  const resumeHref = progress.mounted && progress.lastAccessedLesson
    ? `/courses/${course.id}/${lessonIdToUrl(progress.lastAccessedLesson)}`
    : `/courses/${course.id}/${lessonIdToUrl(course.modules[0].lessons[0].id)}`;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 min-[400px]:px-5 sm:px-6 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          crumbs={[
            { label: 'Home', href: '/' },
            { label: course.title },
          ]}
        />

        {/* Course header */}
        <div className="mt-6 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-5xl" role="img" aria-label={course.title}>
              {course.icon}
            </span>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {course.title}
              </h1>
              <p className="text-gray-500 mt-1">{course.subtitle}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                <span>{totalLessons} lessons</span>
                <span>·</span>
                <span>~{course.estimatedHours}h</span>
                {progress.mounted && completedCount > 0 && (
                  <>
                    <span>·</span>
                    <span className="text-green-600 font-medium">
                      {completedCount} completed
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {progress.mounted && completedCount > 0 && (
            <div className="mt-4">
              <ProgressBar
                percent={percent}
                colorClass={colors.bg}
                label={`${Math.round(percent)}% complete`}
              />
            </div>
          )}

          {/* Resume CTA */}
          <div className="mt-5 flex gap-3">
            <Link
              href={resumeHref}
              className={`inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-xl text-white transition-colors ${colors.btn}`}
            >
              {completedCount > 0 ? '▶ Resume Course' : '▶ Start Course'}
            </Link>
            {completedCount > 0 && (
              <Link
                href={`/courses/${course.id}/${lessonIdToUrl(course.modules[0].lessons[0].id)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Start from Beginning
              </Link>
            )}
          </div>
        </div>

        {/* Module cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Course Modules</h2>
          {course.modules.map(mod => {
            const modColors = getColor(mod.color);
            const modCompleted = progress.mounted
              ? mod.lessons.filter(l => progress.isCompleted(l.id)).length
              : 0;
            const modPercent = mod.lessons.length > 0 ? (modCompleted / mod.lessons.length) * 100 : 0;
            const firstLesson = mod.lessons[0];

            return (
              <div
                key={mod.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`h-1 ${modColors.bg}`} aria-hidden />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5" aria-hidden>{mod.icon}</span>
                      <div>
                        <p className={`text-xs font-semibold ${modColors.text} mb-0.5`}>
                          Module {mod.id + 1}
                        </p>
                        <h3 className="font-bold text-gray-900">{mod.title}</h3>
                        <p className="text-sm text-gray-500">{mod.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-500">
                        {mod.lessons.length} lesson{mod.lessons.length !== 1 ? 's' : ''}
                      </p>
                      {progress.mounted && modCompleted > 0 && (
                        <p className="text-xs text-green-600 font-medium">
                          {modCompleted}/{mod.lessons.length} done
                        </p>
                      )}
                    </div>
                  </div>

                  {progress.mounted && modCompleted > 0 && (
                    <div className="mt-3">
                      <ProgressBar percent={modPercent} colorClass={modColors.bg} />
                    </div>
                  )}

                  <div className="mt-4">
                    <Link
                      href={`/courses/${course.id}/${lessonIdToUrl(firstLesson.id)}`}
                      className={`inline-flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-lg transition-colors ${
                        modCompleted === mod.lessons.length
                          ? 'text-green-700 bg-green-50 hover:bg-green-100'
                          : modCompleted > 0
                          ? `${modColors.text} ${modColors.light} hover:opacity-80`
                          : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {modCompleted === mod.lessons.length
                        ? '✓ Review Module'
                        : modCompleted > 0
                        ? '▶ Continue'
                        : 'Start Module'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
