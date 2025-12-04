import { apiUrl } from '@/config/api';
import { useState, useEffect } from 'react';

type Comment = {
  _id: string;
  title: string;
  createdAt: string;
  rating: number;
  comment: string;
  requesterName: string;
};

type FilterType = 'all' | 'positive' | 'negative';

export const useComments = (fixerId: string, filter: FilterType = 'all') => {
  const [data, setData] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);

      try {
        let endpoint = `api/comments/${fixerId}`;

        if (filter === 'positive') {
          endpoint = `api/comments/${fixerId}/positive`;
        } else if (filter === 'negative') {
          endpoint = `api/comments/${fixerId}/negative`;
        }

        const url = apiUrl(endpoint);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [fixerId, filter]);

  return { data, loading, error };
};
