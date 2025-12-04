import type { ReactNode } from 'react';
import { Roboto } from 'next/font/google';
import './theme.css';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'], display: 'swap' });

export default function FeatureLayout({ children }: { children: ReactNode }) {
  return <section className={roboto.className}>{children}</section>;
}
