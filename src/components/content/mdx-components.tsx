/**
 * mdx-components.tsx
 *
 * Component map for MDX content. Imported by Next.js via the
 * mdx-components.tsx convention in the project root.
 */

import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef } from 'react';
import HighlightBox from './HighlightBox';
import AnalogyBox from './AnalogyBox';
import ExampleBox from './ExampleBox';
import FormulaBox from './FormulaBox';
import ResponsiveTable from './ResponsiveTable';
import CalculationExercise from './CalculationExercise';
import DeepDive from './DeepDive';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    // Custom content components
    HighlightBox,
    AnalogyBox,
    ExampleBox,
    FormulaBox,
    ResponsiveTable,
    CalculationExercise,
    DeepDive,

    // Tables: add styles only — MDX content wraps tables in <ResponsiveTable> already
    table: (props: ComponentPropsWithoutRef<'table'>) => (
      <div className="overflow-x-auto my-10 shadow-sm rounded-lg border border-gray-100">
        <table className="w-full border-collapse text-left" {...props} />
      </div>
    ),
    th: (props: ComponentPropsWithoutRef<'th'>) => (
      <th
        className="bg-slate-800 text-white px-6 py-4 text-sm font-semibold tracking-wide"
        {...props}
      />
    ),
    td: (props: ComponentPropsWithoutRef<'td'>) => (
      <td
        className="px-6 py-4 border-b border-gray-100 text-sm text-gray-700 bg-white"
        {...props}
      />
    ),
    // Heading styles
    h2: (props: ComponentPropsWithoutRef<'h2'>) => (
      <h2 className="text-3xl font-extrabold text-gray-900 mt-12 mb-6 tracking-tight border-b pb-2 border-gray-100" {...props} />
    ),
    h3: (props: ComponentPropsWithoutRef<'h3'>) => (
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4 tracking-tight" {...props} />
    ),
    h4: (props: ComponentPropsWithoutRef<'h4'>) => (
      <h4 className="text-lg font-semibold text-gray-700 mt-6 mb-3" {...props} />
    ),
    // Prose
    p: (props: ComponentPropsWithoutRef<'p'>) => (
      <p className="mb-5 text-gray-600 leading-relaxed text-base" {...props} />
    ),
    ul: (props: ComponentPropsWithoutRef<'ul'>) => (
      <ul className="mb-6 pl-6 space-y-2 list-disc text-gray-600 text-base marker:text-gray-400" {...props} />
    ),
    ol: (props: ComponentPropsWithoutRef<'ol'>) => (
      <ol className="mb-6 pl-6 space-y-2 list-decimal text-gray-600 text-base marker:text-gray-400" {...props} />
    ),
    li: (props: ComponentPropsWithoutRef<'li'>) => (
      <li className="pl-1" {...props} />
    ),
    code: (props: ComponentPropsWithoutRef<'code'>) => (
      <code
        className="bg-gray-50 px-1.5 py-0.5 rounded-md font-mono text-sm text-indigo-700 border border-gray-200"
        {...props}
      />
    ),
    strong: (props: ComponentPropsWithoutRef<'strong'>) => (
      <strong className="font-semibold text-gray-900" {...props} />
    ),
    blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 py-1 italic text-gray-600 my-6" {...props} />
    ),

    // Spread any passed-in overrides
    ...components,
  };
}
