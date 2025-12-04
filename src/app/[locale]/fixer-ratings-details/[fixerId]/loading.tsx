export default function Loading() {
  return (
    <div className='max-w-3xl mx-auto p-6 space-y-4' aria-busy='true' aria-live='polite'>
      <div className='flex items-center justify-between'>
        <div className='h-7 w-40 rounded-md bg-neutral-100 animate-pulse' />
        <div className='h-8 w-20 rounded-lg bg-neutral-100 animate-pulse' />
      </div>

      <div className='space-y-3'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className='flex items-start gap-4 p-4 rounded-xl border bg-white animate-pulse'
          >
            <div className='h-10 w-10 rounded-full bg-neutral-100' />
            <div className='flex-1 min-w-0 space-y-2'>
              <div className='flex items-center justify-between gap-2'>
                <div className='h-4 w-32 bg-neutral-100 rounded' />
                <div className='h-4 w-16 bg-neutral-100 rounded' />
              </div>
              <div className='h-3 w-24 bg-neutral-100 rounded' />
              <div className='h-4 w-full bg-neutral-100 rounded' />
              <div className='h-4 w-3/4 bg-neutral-100 rounded' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
