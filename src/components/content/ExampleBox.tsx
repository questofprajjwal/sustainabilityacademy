import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title?: string;
}

export default function ExampleBox({ children, title }: Props) {
  return (
    <div
      className="border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl my-6 shadow-sm relative overflow-hidden"
      role="note"
      aria-label={title ?? 'Worked example'}
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 rounded-l-xl"></div>
      <div className="pl-2">
        {children}
      </div>
    </div>
  );
}
