import { mockRatings } from './utils';
import { ClientRatings, RatingDetailsList } from './components';

type Params = { fixerId: string };

export default async function RatingsPage({ params }: { params: Promise<Params> }) {
  const { fixerId } = await params;

  const useBackend = true;
  return (
    <main className='max-w-3xl mx-auto p-6 space-y-4' style={{ color: 'var(--foreground)' }}>
      <header className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold tracking-tight'>Rating Details</h1>
        <a
          href={`/profile/${fixerId}`}
          className='text-sm px-3 py-1.5 border rounded-lg transition-colors hover:bg-white/60'
          style={{ borderColor: 'var(--surface-border)' }}
          aria-label='Back to profile'
        >
          Back
        </a>
      </header>

      {useBackend ? (
        <ClientRatings fixerId={fixerId} />
      ) : (
        <RatingDetailsList ratings={mockRatings} />
      )}
    </main>
  );
}
