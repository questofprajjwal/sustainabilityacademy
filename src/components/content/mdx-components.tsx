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
      <table className="w-full border-collapse" {...props} />
    ),
    th: (props: ComponentPropsWithoutRef<'th'>) => (
      <th
        className="bg-green-800 text-white px-3 py-2 text-left text-sm font-semibold"
        {...props}
      />
    ),
    td: (props: ComponentPropsWithoutRef<'td'>) => (
      <td
        className="px-3 py-2 border-b border-gray-200 text-sm"
        {...props}
      />
    ),
    // Heading styles
    h2: (props: ComponentPropsWithoutRef<'h2'>) => (
      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4" {...props} />
    ),
    h3: (props: ComponentPropsWithoutRef<'h3'>) => (
      <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3" {...props} />
    ),
    h4: (props: ComponentPropsWithoutRef<'h4'>) => (
      <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2" {...props} />
    ),
    // Prose
    p: (props: ComponentPropsWithoutRef<'p'>) => (
      <p className="mb-4 text-gray-700 leading-relaxed" {...props} />
    ),
    ul: (props: ComponentPropsWithoutRef<'ul'>) => (
      <ul className="mb-4 pl-6 space-y-1 list-disc text-gray-700" {...props} />
    ),
    ol: (props: ComponentPropsWithoutRef<'ol'>) => (
      <ol className="mb-4 pl-6 space-y-1 list-decimal text-gray-700" {...props} />
    ),
    li: (props: ComponentPropsWithoutRef<'li'>) => (
      <li className="text-gray-700" {...props} />
    ),
    code: (props: ComponentPropsWithoutRef<'code'>) => (
      <code
        className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm text-gray-800"
        {...props}
      />
    ),
    strong: (props: ComponentPropsWithoutRef<'strong'>) => (
      <strong className="font-semibold text-gray-900" {...props} />
    ),

    // Spread any passed-in overrides
    ...components,
  };
}
