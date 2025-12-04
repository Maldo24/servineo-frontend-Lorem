import { z } from 'zod';
import ClientVerify from '@/Components/login/ClientVerify';

const SearchParamsSchema = z.object({
  token: z.string().min(1, 'Token inválido').optional(),
});

type SearchParams = Record<string, string | string[] | undefined>;

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  // ✅ Validación segura con Zod
  const parsed = SearchParamsSchema.safeParse({
    token: typeof sp.token === 'string' ? sp.token : undefined,
  });

  const token = parsed.success ? parsed.data.token : undefined;

  return (
    <main className='relative min-h-screen flex items-center justify-center px-6 text-foreground'>
      {/* Fondo ultra sutil */}
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute inset-0 bg-background' />
        <div className='absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent' />
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDIwdjIwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjA1IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')]" />
      </div>

      <div className='bg-card/95 backdrop-blur-sm rounded-3xl shadow-lg p-8 text-center max-w-sm w-full border border-border/70'>
        <h1 className='text-xl font-semibold mb-4 bg-gradient-to-r from-primary/80 to-primary/60 bg-clip-text text-transparent'>
          Verificación
        </h1>
        {/* Lógica de navegador en el componente cliente */}
        <ClientVerify token={token} />
      </div>
    </main>
  );
}
