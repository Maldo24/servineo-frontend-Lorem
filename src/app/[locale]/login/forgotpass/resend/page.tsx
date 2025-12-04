import { z } from 'zod';
import ClientView from '@/Components/login/ClientResend';

// ✅ Esquema de validación Zod para los searchParams
const SearchParamsSchema = z.object({
  email: z.string().email().optional(),
  token: z.string().min(1, 'Token inválido').optional(),
});

type SearchParams = Record<string, string | string[] | undefined>;

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;

  // ✅ Validación segura con Zod
  const parsed = SearchParamsSchema.safeParse({
    email: typeof sp.email === 'string' ? sp.email : undefined,
    token: typeof sp.token === 'string' ? sp.token : undefined,
  });

  // Si algo no cumple con el esquema, se ignora el valor (sin romper la UI)
  const email = parsed.success ? parsed.data.email : undefined;
  const token = parsed.success ? parsed.data.token : undefined;

  return (
    <main className='relative min-h-screen flex items-center justify-center px-6 text-foreground'>
      {/* Fondo ultra sutil (idéntico al resto de pantallas) */}
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute inset-0 bg-background' />
        <div className='absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent' />
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDIwdjIwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjA1IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')]" />
      </div>

      <div className='w-full max-w-md bg-card/95 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden border border-border/70'>
        {/* Header de confirmación */}
        <div className='bg-gradient-to-r from-primary to-primary/90 p-6'>
          <div className='flex items-center gap-3 text-primary-foreground'>
            <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-foreground/10 ring-1 ring-primary-foreground/25'>
              <svg
                className='w-6 h-6'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
                aria-hidden='true'
              >
                <path d='M20 6L9 17l-5-5' />
              </svg>
            </span>
            <div>
              <h1 className='text-xl font-semibold leading-6'>¡Enlace enviado!</h1>
              <p className='text-primary-foreground/90 text-sm'>
                {email ? (
                  <>
                    Revisa <span className='font-medium'>{maskEmail(email)}</span> para continuar.
                  </>
                ) : (
                  'Revisa tu correo registrado para continuar.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Cuerpo (botón de reenviar) */}
        <div className='p-6'>
          <ClientView email={email} token={token} />
        </div>
      </div>
    </main>
  );
}

// ✅ Enmascara el correo de forma segura
function maskEmail(email: string) {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  if (user.length <= 2) return user[0] + '***@' + domain;
  return user.slice(0, 2) + '*****@' + domain;
}
