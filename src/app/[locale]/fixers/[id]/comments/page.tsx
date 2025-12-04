'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useComments } from '@/app/components/hooks/useComments';

type FilterType = 'all' | 'positive' | 'negative';

export default function CommentsPage() {
  const params = useParams();
  const fixerId = params.id as string;
  const [filter, setFilter] = useState<FilterType>('all');
  const { data, loading, error } = useComments(fixerId, filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className='flex gap-0.5'>
        {[1, 2, 3].map((star) => (
          <svg
            key={star}
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill={star <= rating ? '#FFA500' : 'none'}
            stroke='#FFA500'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z' />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-900'>Jobs Comments</h1>
          <div className='flex gap-2'>
            <button
              onClick={() => (filter === 'positive' ? setFilter('all') : setFilter('positive'))}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                filter === 'positive'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Positive
            </button>
            <button
              onClick={() => (filter === 'negative' ? setFilter('all') : setFilter('negative'))}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                filter === 'negative'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              Negative
            </button>
          </div>
        </div>
        <div className='mb-4 flex gap-x-2 flex-row-reverse justify-between align-middle text-black'></div>
        {loading ? (
          <div className='flex justify-center items-center py-12'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='40'
              height='40'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='animate-spin text-gray-600'
            >
              <path d='M21 12a9 9 0 1 1-6.219-8.56' />
            </svg>
          </div>
        ) : error ? (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-red-700'>
            Error loading comments: {error}
          </div>
        ) : data.length === 0 ? (
          <div className='bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500'>
            No comments found
          </div>
        ) : (
          <div className='space-y-4'>
            {data.map((comment) => (
              <div
                key={comment._id} // The color can be change here for negative or positive, I knew you would ask xdd
                className={`${filter === 'all' && 'bg-white'} ${filter === 'negative' ? 'bg-red-200' : 'bg-green-100'} border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className='flex justify-between items-start mb-3'>
                  <div>
                    <h3 className='font-semibold text-gray-900 text-sm'>
                      {comment.requesterName} - {comment.title}
                    </h3>
                    <p className='text-xs text-gray-500 mt-1'>
                      Date: {formatDate(comment.createdAt)}
                    </p>
                  </div>
                  {renderStars(comment.rating)}
                </div>
                <p className='text-sm text-gray-700 leading-relaxed'>{comment.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
