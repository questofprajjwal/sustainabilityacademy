import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function HighlightBox({ children }: Props) {
  return (
    <div
      className="border border-green-200 bg-gradient-to-br from-green-50 to-white p-5 rounded-xl my-6 shadow-sm relative overflow-hidden"
      role="note"
      aria-label="Key takeaway"
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500 rounded-l-xl"></div>
      <div className="pl-2">
        {children}
      </div>
    </div>
  );
}
