import Link from 'next/link';
import type { Course } from '@/lib/types';
import { getColor } from '@/lib/colors';
import ProgressBar from '@/components/learning/ProgressBar';

interface Props {
  course: Course;
  completedLessons?: number;
  totalLessons?: number;
  lastLessonId?: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  methodologies: 'Methodology',
  markets: 'Carbon Markets',
  esg: 'ESG',
  fundamentals: 'Fundamentals',
  'green-finance': 'Green Finance',
};

export default function CourseCard({ course, completedLessons = 0, totalLessons, lastLessonId }: Props) {
  const colors = getColor(course.color);
  const total = totalLessons ?? course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const percent = total > 0 ? (completedLessons / total) * 100 : 0;
  const hasProgress = completedLessons > 0;

  const resumeHref = lastLessonId
    ? `/courses/${course.id}/${lastLessonId}`
    : `/courses/${course.id}`;

  const statusBadge =
    course.status === 'coming-soon' ? (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        Coming Soon
      </span>
    ) : course.status === 'draft' ? (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        Draft
      </span>
    ) : null;

  const categoryLabel = CATEGORY_LABELS[course.category] ?? course.category;

  const isDisabled = course.status !== 'published';

  return (
    <article
      className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-shadow ${
        isDisabled ? 'opacity-70' : 'hover:shadow-md'
      }`}
    >
      {/* Color header bar */}
      <div className={`h-1.5 ${colors.bg}`} aria-hidden />

      <div className="p-5">
        {/* Icon + status */}
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl" role="img" aria-label={course.title}>
            {course.icon}
          </span>
          <div className="flex items-center gap-2">
            {statusBadge}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors.light} ${colors.text}`}
            >
              {categoryLabel}
            </span>
          </div>
        </div>

        {/* Title & subtitle */}
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-1">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3 leading-snug">{course.subtitle}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <span>{total} lessons</span>
          <span>·</span>
          <span>{course.estimatedHours}h</span>
          {hasProgress && (
            <>
              <span>·</span>
              <span className="text-green-600 font-medium">{completedLessons} done</span>
            </>
          )}
        </div>

        {/* Progress */}
        {hasProgress && (
          <div className="mb-4">
            <ProgressBar percent={percent} colorClass={colors.bg} />
          </div>
        )}

        {/* CTA */}
        {!isDisabled && (
          <Link
            href={resumeHref}
            className={`block w-full text-center py-2 text-sm font-medium rounded-lg transition-colors ${colors.btn}`}
          >
            {hasProgress ? (percent >= 100 ? 'Review Course' : 'Resume') : 'Start Course'}
          </Link>
        )}
      </div>
    </article>
  );
}
