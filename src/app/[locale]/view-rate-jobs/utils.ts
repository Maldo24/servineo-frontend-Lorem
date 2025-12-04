export type RatedJob = {
  id: string;
  title: string;
  dateISO: string;
  rating: 0 | 1 | 2 | 3 | null;
};
