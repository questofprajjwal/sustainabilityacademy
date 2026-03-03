import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function HighlightBox({ children }: Props) {
  return (
    <div
      className="border-l-4 border-green-600 bg-green-50 p-4 rounded my-4"
      role="note"
      aria-label="Key takeaway"
    >
      {children}
    </div>
  );
}
