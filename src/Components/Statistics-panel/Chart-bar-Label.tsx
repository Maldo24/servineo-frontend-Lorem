'use client';

import { TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from 'recharts';

// Definir interfaces para TypeScript
interface ChartDataItem {
  name: string;
  value: number;
}

interface ChartBarLabelProps {
  data: ChartDataItem[];
  title?: string;
  description?: string;
  color?: string;
  dataKey?: string;
  nameKey?: string;
  trendText?: string;
  footerText?: string;
  showTrend?: boolean;
  className?: string;
  height?: number;
  barSize?: number;
}

// Custom Tooltip Component
interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-sm'>
        <p className='font-medium text-gray-900'>{label}</p>
        <p className='text-sm text-blue-600'>{`Value: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export function ChartBarLabel({
  data,
  title = 'Bar Chart',
  description = 'Chart data',
  color = '#2563eb',
  dataKey = 'value',
  nameKey = 'name',
  trendText = 'Trending up by 5.2% this month',
  footerText = 'Showing data statistics',
  showTrend = true,
  className = '',
  height = 300,
  barSize = 100, // Barras más delgadas
}: ChartBarLabelProps) {
  return (
    <div className={`flex flex-col border rounded-lg bg-white shadow-sm w-full ${className}`}>
      <div className='p-6 pb-0'>
        <h3 className='text-lg font-semibold'>{title}</h3>
        <p className='text-sm text-gray-500 mt-1'>{description}</p>
      </div>

      <div className='p-6'>
        <div className='w-full' style={{ height: `${height}px` }}>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap='15%' // Espacio entre categorías
            >
              <CartesianGrid vertical={false} stroke='#f3f4f6' />
              <XAxis
                dataKey={nameKey}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => (typeof value === 'string' ? value.slice(0, 10) : value)}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey={dataKey}
                fill={color}
                radius={[4, 4, 0, 0]} // Esquinas menos redondeadas
                barSize={barSize} // Control del ancho de barras
              >
                <LabelList
                  dataKey={dataKey}
                  position='top'
                  offset={8}
                  fill='#1f2937'
                  fontSize={12}
                  fontWeight={600}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className='p-6 pt-0 flex flex-col items-start gap-2 text-sm'>
        {showTrend && (
          <div className='flex gap-2 leading-none font-medium items-center'>
            {trendText} <TrendingUp className='h-4 w-4' />
          </div>
        )}
        <div className='text-gray-500 leading-none'>{footerText}</div>
      </div>
    </div>
  );
}
