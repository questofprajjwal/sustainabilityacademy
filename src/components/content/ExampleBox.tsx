import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title?: string;
}

export default function ExampleBox({ children, title }: Props) {
  return (
    <div
      className="border-l-4 border-amber-600 bg-amber-50 p-4 rounded my-4"
      role="note"
      aria-label={title ?? 'Worked example'}
    >
      {children}
    </div>
  );
}
