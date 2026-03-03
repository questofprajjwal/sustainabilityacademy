import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function ResponsiveTable({ children }: Props) {
  return (
    <div className="-mx-4 sm:mx-0 overflow-x-auto my-4">
      <div className="min-w-[480px] px-4 sm:px-0">
        {children}
      </div>
    </div>
  );
}
