import { DB_VALUES, JobTypeValue, CityValue } from '@/app/redux/contants';

export function useJobTypeAutoMatch() {
  const findMatchingJobType = (searchQuery: string): JobTypeValue | null => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase().trim();

    const exactMatch = DB_VALUES.jobTypes.find((jobType) => jobType.toLowerCase() === query);

    if (exactMatch) return exactMatch;

    const partialMatch = DB_VALUES.jobTypes.find((jobType) =>
      jobType.toLowerCase().includes(query),
    );

    return partialMatch || null;
  };

  const findMatchingCity = (searchQuery: string): CityValue | null => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase().trim();

    const exactMatch = DB_VALUES.cities.find((city) => city.toLowerCase() === query);

    if (exactMatch) return exactMatch;

    const partialMatch = DB_VALUES.cities.find((city) => city.toLowerCase().includes(query));

    return partialMatch || null;
  };

  return {
    findMatchingJobType,
    findMatchingCity,
    availableJobTypes: DB_VALUES.jobTypes,
    availableCities: DB_VALUES.cities,
  };
}
