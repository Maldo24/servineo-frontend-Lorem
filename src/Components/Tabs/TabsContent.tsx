'use client';

import type { ReactNode } from 'react';
import { useTabs } from './Tabs';

interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
}

const TabsContent = ({ value, className, children }: TabsContentProps) => {
  const { value: activeTab } = useTabs();

  if (value !== activeTab) return null;

  return (
    <div
      role='tabpanel'
      className={`mt-4 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${className || ''}`}
    >
      {children}
    </div>
  );
};

export default TabsContent;
