import type { ReactNode } from 'react';

interface TabsListProps {
  className?: string;
  children: ReactNode;
}

const TabsList = ({ className, children }: TabsListProps) => (
  <div
    className={`inline-flex h-12 items-center justify-start rounded-lg bg-gray-100/80 p-1 text-gray-500 w-full md:w-auto overflow-x-auto ${className || ''}`}
    role='tablist'
  >
    {children}
  </div>
);

export default TabsList;
