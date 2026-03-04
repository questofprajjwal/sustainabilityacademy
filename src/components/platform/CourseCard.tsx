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
      <span className="text-xs text-gray-400">Coming Soon</span>
    ) : course.status === 'draft' ? (
      <span className="text-xs text-yellow-600">Draft</span>
    ) : null;

  const categoryLabel = CATEGORY_LABELS[course.category] ?? course.category;

  const isDisabled = course.status !== 'published';

  return (
    <article
      className={`bg-white border border-gray-200 rounded-lg overflow-hidden transition-colors ${
        isDisabled ? 'opacity-60' : 'hover:bg-gray-50'
      }`}
    >
      <div className="p-5">
        {/* Category + status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${colors.bg}`} aria-hidden />
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              {categoryLabel}
            </span>
          </div>
          {statusBadge}
        </div>

        {/* Title & subtitle */}
        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-1">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3 leading-relaxed">{course.subtitle}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <span>{total} lessons</span>
          <span>&middot;</span>
          <span>{course.estimatedHours}h</span>
          {hasProgress && (
            <>
              <span>&middot;</span>
              <span className="text-gray-600 font-medium">{completedLessons} done</span>
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
            className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
          >
            {hasProgress ? (percent >= 100 ? 'Review course' : 'Resume') : 'Start course'} &rarr;
          </Link>
        )}
      </div>
    </article>
  );
}
