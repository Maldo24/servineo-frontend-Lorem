'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart, Tooltip } from 'recharts';

interface ChartData {
  [key: string]: string | number | undefined;
  name: string;
  value: number;
  fill?: string;
}

interface ChartPieDonutProps {
  data: ChartData[];
  title?: string;
  description?: string;
}

export function ChartPieDonut({
  data,
  title = 'Estadísticas - Búsquedas',
  description = 'January - June 2024',
}: ChartPieDonutProps) {
  // Asignar colores si no vienen en los datos
  const dataWithColors = data.map((item, index) => ({
    ...item,
    fill: item.fill || ['#FFBB28', '#EF4444', '#60A5FA'][index % 3],
  }));

  return (
    <div className='flex flex-col border rounded-lg bg-white shadow-sm p-6'>
      <div className='items-center text-center mb-4'>
        <h3 className='text-lg font-semibold'>{title}</h3>
        <p className='text-sm text-gray-500 mt-1'>{description}</p>
      </div>

      <div className='flex-1 flex justify-center'>
        <PieChart width={250} height={250}>
          <Tooltip />
          <Pie
            data={dataWithColors}
            dataKey='value'
            nameKey='name'
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
          />
        </PieChart>
      </div>

      <div className='flex justify-center gap-4 mt-4 mb-4'>
        {dataWithColors.map((item, index) => (
          <div key={index} className='flex items-center gap-2'>
            <div className='w-4 h-4 rounded-sm' style={{ backgroundColor: item.fill }} />
            <span className='text-sm capitalize'>{item.name}</span>
          </div>
        ))}
      </div>

      <div className='flex flex-col gap-2 text-sm mt-4 text-center'>
        <div className='flex items-center justify-center gap-2 font-medium'>
          Estadísticas de los usuarios <TrendingUp className='h-4 w-4' />
        </div>
      </div>
    </div>
  );
}
