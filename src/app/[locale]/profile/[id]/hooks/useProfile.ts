import { useState, useEffect } from 'react';
import { apiUrl } from '@/config/api';
type ProfileData = {
  name: string;
  photo_url: string;
  role: string;
  ratings: {
    1: number;
    2: number;
    3: number;
  };
  average_rating: number;
  rating_count: number;
};
export const useProfile = (userId: string | undefined) => {
  const [data, setData] = useState<ProfileData | null>(null);
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setErrors('There is no user ID provided');
      return;
    }

    const fetchData = async () => {
      try {
        const url = apiUrl(`api/profile/${userId}`);
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        if (!response.ok) {
          const status = response.status;
          const bodyText = await response.text().catch(() => '');
          let message = 'Unknown error';
          switch (status) {
            case 400:
              message = 'Invalid ID';
              break;
            case 422:
              message = 'Invalid ID format';
              break;
            case 404:
              message = 'User not found';
              break;
            case 500:
              message = 'Server error';
              break;
            default:
              message = bodyText || `Error ${status}`;
          }
          setErrors(message);
          return;
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Crash: Error fetching profile data:', error);
        setErrors('Network error');
      }
    };

    fetchData();
  }, [userId]);

  return { data, errors };
};
