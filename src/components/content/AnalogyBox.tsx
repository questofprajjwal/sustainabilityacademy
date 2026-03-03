import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function AnalogyBox({ children }: Props) {
  return (
    <div
      className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded my-4"
      role="note"
      aria-label="Analogy"
    >
      {children}
    </div>
  );
}
